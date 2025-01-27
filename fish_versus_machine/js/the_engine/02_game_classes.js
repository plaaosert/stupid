ui_sprite_render_target = document.getElementById("ui_game_area");

class GameObject {
    position = new Vector2();
}

class Sprite extends GameObject {
    screen_object = null;
    img_url = null;

    width;
    height;

    rotation = new LerpValue(360, 2700, 2700);

    constructor(img_url = null, position = new Vector2(0, 0), width = 128, height = null, rotation = 0) {
        super();
        this.img_url = img_url;

        if (height == null) {
            height = width;
        }

        this.position = position;
        this.width = width;
        this.height = height;

        this.create_screen_object();
        this.set_rotation(rotation);
        this.update_render();
    }

    get_rotation() {
        return this.normalize_rotation(this.rotation.get());
    }

    set_rotation(rotation, speed = null) {
        rotation = this.normalize_rotation(rotation);

        if (speed == null) {
            this.rotation.current_speed = 0;
            this.rotation.current_value = rotation;
            this.rotation.target_value = rotation;
        } else {
            var start_position = this.get_rotation();
            var end_position = this.normalize_rotation(rotation);

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
            this.rotation.current_value = start_position;
            this.rotation.target_value = end_position;
            this.rotation.max_speed = speed;
            api.start_stepping_lerp(this.rotation);
        }
    }

    update_render() {
        var e = this.screen_object;

        e.style.width = `${this.width}px`;
        e.style.height = `${this.height}px`;

        e.style.top = `${Math.round(this.position.y - this.height / 2)}px`;
        e.style.left = `${Math.round(this.position.x - this.width / 2)}px`;

        var rotation = -this.get_rotation();
        e.style.rotate = `${rotation}deg`;
    }

    create_screen_object() {
        if (this.screen_object !== null) {
            return;
        }

        var e = document.createElement("img");
        e.className = "sprite";
        e.src = this.img_url + `?v=${version}`;
        this.screen_object = e;

        ui_sprite_render_target.appendChild(e);
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

class Camera {
    position;
    camera_container;

    constructor() {
        position = new LerpVector2(100, 100, 100);
        camera_container = document.getElementById("ui_game_area");
    }

    go_to_position(new_position) {
        this.position.x.target_value = new_position.x;
        this.position.y.target_value = new_position.y;
    }

    render_camera() {
        camera_container.style.top
    }
}