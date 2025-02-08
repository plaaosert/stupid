ui_sprite_render_target = document.getElementById("ui_game_area");

class GameObject {
    position = new LerpVector2();
    rotation = new LerpValue(360, 2700, 2700);
    scale = new LerpVector2();

    screen_object = null;

    constructor(position = null, rotation = null) {
        if (position != null) {
            this.position.set(position);
        }

        if (rotation != null) {
            this.rotation.set(rotation);
        }
    }

    create_screen_object(object_type = "div", object_class = null) {
        if (this.screen_object == null) {
            var e = document.createElement(object_type);

            if (object_class != null) {
                e.className = object_class;
            }

            this.screen_object = e;
        }
    }

    get_position() {
        return this.position.get();
    }

    move_to(value, instant = false) {
        if (instant) {
            this.position.set(value);
        } else {
            this.position.set_goal(value);
        }
    }

    get_rotation() {
        return this.normalize_rotation(this.rotation.get());
    }

    rotate_to(value, instant = false) {
        value = this.normalize_rotation(value);

        if (instant) {
            this.rotation.set(value);
        } else {
            var start_position = this.get_rotation();
            var end_position = this.normalize_rotation(value);

            // console.log(`${start_position} -> ${end_position}`);

            var degree_distance = Math.abs(end_position - start_position);
            if (degree_distance > 180) {
                degree_distance = 360 - degree_distance;
                if (end_position > start_position) {
                    end_position -= 360;
                } else {
                    end_position += 360;
                }
            }

            // since start_position might've done a 360 to become positive, we need to update the Lerp for it too!
            this.rotation.set_goal(end_position, start_position);
        }
    }

    rotate_towards(point, instant = false) {
        var new_rotation = this.get_position().getDegreesBetween(point);
        this.rotate_to(new_rotation, instant);
    }

    normalize_rotation(rotation) {
        if (rotation < 0) {
            rotation += Math.abs(Math.floor(rotation / 360) * 360);
        }

        if (rotation > 360) {
            rotation -= Math.floor(rotation / 360) * 360;
        }

        return rotation;
    }
}

class Sprite extends GameObject {
    sprite_url;
    sprite_size = new LerpVector2(100, 100, 100);
    screen_object_needs_update = true;

    constructor(sprite_url = null, sprite_size = new Vector2(128, 128), position = null, rotation = null) {
        super(position, rotation);
        this.sprite_url = sprite_url;

        this.sprite_size.set(sprite_size);

        this.create_screen_object("img", "sprite");
        var e = this.screen_object;
        ui_sprite_render_target.appendChild(e);

        this.position.add_callback(this.mark_screen_object_needs_update.bind(this));
        this.rotation.add_callback(this.mark_screen_object_needs_update.bind(this));
        this.sprite_size.add_callback(this.mark_screen_object_needs_update.bind(this));

        abstraction_api.listeners_update_ui.push(this.update_screen_object.bind(this));
    }

    mark_screen_object_needs_update() {
        this.screen_object_needs_update = true;
    }

    update_screen_object() {
        if (!this.screen_object_needs_update) {
            return;
        }

        var e = this.screen_object;
        var sprite_size = this.sprite_size.get();
        var position = this.position.get();

        e.src = this.sprite_url + `?v=${game_version}`;

        e.style.width = `${sprite_size.x}px`;
        e.style.height = `${sprite_size.y}px`;

        e.style.top = `${Math.round(position.y - sprite_size.y / 2)}px`;
        e.style.left = `${Math.round(position.x - sprite_size.x / 2)}px`;

        var rotation = -this.get_rotation();
        e.style.rotate = `${rotation}deg`;
    }
}

class Entity extends Sprite {

    movement = new LerpVector2(3, 15, 15);
    max_movement_speed = 3;

    constructor() {
        super();
        this.movement.set_instant_flip(true);
        abstraction_api.listeners_update_ui.push(this.update_position.bind(this));
    }

    set_movement_direction(north, east, west, south) {
        if (north && south) {
            north = false;
            south = false;
        }

        if (east && west) {
            east = false;
            west = false;
        }

        var dir_x = 0;
        var dir_y = 0;

        if (north) {
            dir_y = -1;
        }

        if (south) {
            dir_y = 1;
        }

        if (east) {
            dir_x = 1;
        }

        if (west) {
            dir_x = -1;
        }

        if (dir_x != 0 && dir_y != 0) {
            dir_x *= 1 / Math.SQRT2;
            dir_y *= 1 / Math.SQRT2;
        }

        //this.movement.set_goal(new Vector2(dir_x, dir_y));
        let deg_r = Math.PI * ((this.get_rotation()) / 180);
        console.log(this.get_rotation(), deg_r, new Vector2(Math.cos(deg_r) * dir_y, Math.sin(deg_r) * dir_y).toString());

        let goal = new Vector2(0, 0);

        if (dir_y > 0) {
            dir_y /= 2;
        }

        dir_x /= 2;

        goal = goal.plus(new Vector2(Math.cos(deg_r) * -dir_y, -Math.sin(deg_r) * -dir_y));
        if (dir_x != 0) {
            deg_r = Math.PI * ((this.get_rotation() + 90) / 180);
            goal = goal.plus(new Vector2(Math.cos(deg_r) * -dir_x, -Math.sin(deg_r) * -dir_x));
        }

        this.movement.set_goal(goal);

        //console.log("goal", dir_x, dir_y);
    }

    update_position() {
        //console.log("move speed", this.movement.get().toString());

        var movement_delta = this.movement.get();
        movement_delta.x *= this.max_movement_speed;
        movement_delta.y *= this.max_movement_speed;

        this.position.set(this.position.get().plus(movement_delta));
    }
}

class Camera extends GameObject {
    constructor() {
        super();
        this.screen_object = document.getElementById("ui_main_area");
        this.move_to(new Vector2(0, 0), true);

        abstraction_api.listeners_update_ui.push(this.update_screen_object.bind(this));
    }

    get_ui_position() {
        var position = this.get_position();
        var style_position = new Vector2(abstraction_api.window_size.x / 2 + position.x, abstraction_api.window_size.y / 2 + position.y);
        return style_position;
    }

    update_screen_object() {
        var style_position = this.get_ui_position();
        this.screen_object.style.left = `${style_position.x}px`;
        this.screen_object.style.top = `${style_position.y}px`;
    }
}