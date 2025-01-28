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

    constructor(sprite_url = null, position = null, sprite_size = new Vector2(128, 128), rotation = null) {
        super(position, rotation);
        this.sprite_url = sprite_url;

        this.sprite_size.set(sprite_size);

        this.create_screen_object("img", "sprite");
        var e = this.screen_object;
        e.src = this.sprite_url + `?v=${game_version}`;
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

        e.style.width = `${sprite_size.x}px`;
        e.style.height = `${sprite_size.y}px`;

        e.style.top = `${Math.round(position.y - sprite_size.y / 2)}px`;
        e.style.left = `${Math.round(position.x - sprite_size.x / 2)}px`;

        var rotation = -this.get_rotation();
        e.style.rotate = `${rotation}deg`;
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