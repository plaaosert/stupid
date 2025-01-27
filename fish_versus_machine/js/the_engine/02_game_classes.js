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

    }

    move_to(value) {

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

    constructor(sprite_url = null, position = null, sprite_size = new Vector2(128, 128), rotation = null) {
        super(position, rotation);
        this.sprite_url = sprite_url;

        this.sprite_size.set(sprite_size);

        this.create_screen_object("img", "sprite");
        var e = this.screen_object;
        e.src = this.sprite_url + `?v=${game_version}`;
        ui_sprite_render_target.appendChild(e);

        this.update_render();
    }

    update_render() {
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

class Camera {
    position;
    camera_container;

    constructor() {
        this.position = new LerpVector2(100, 100, 100);
        this.camera_container = document.getElementById("ui_main_area");

        abstraction_api.listeners_update_ui.push(this.render_camera.bind(this));
    }

    get_position() {
        return this.internal_get_style_position();
    }

    set_position(new_position) {
        this.position.set_goal(new_position);
    }

    internal_get_style_position() {
        var position = this.position.get();
        var style_position = new Vector2(abstraction_api.window_size.x / 2 + position.x, abstraction_api.window_size.y / 2 + position.y);
        return style_position;
    }

    render_camera() {
        var style_position = this.internal_get_style_position();
        this.camera_container.style.left = `${style_position.x}px`;
        this.camera_container.style.top = `${style_position.y}px`;
    }
}