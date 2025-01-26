version = "0.1";
ui_sprite_render_target = document.getElementById("ui_main_area");
mouse_x = null;
mouse_y = null;

listeners_mousemove = [];

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

class Animation {
    start_position = 0;
    end_position = 0;
    duration = 0;
    time_start = 0;
    bezier_params = null;

    is_happening() {
        return (Date.now() - this.time_start) < this.duration;
    }

    get_current_point() {
        var elapsed = Date.now() - this.time_start;

        if (elapsed >= this.duration) {
            return this.end_position;
        } else {
            var proportion = elapsed / this.duration;
            console.log(proportion);
            if (this.bezier_params !== null) {
                proportion = Bezier.get_bezier_value(this.bezier_params, proportion);
            }

            return this.start_position + (this.end_position - this.start_position) * proportion;
        }
    }
}

class GameObject {
    position = new Vector2();
}

class Sprite extends GameObject {
    screen_object = null;
    img_url = null;

    width;
    height;
    // rotation;

    rotation_tracker = new Lerp(0, 0, 0, 2700, 2700);

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
        return this.normalize_rotation(this.rotation_tracker.current_value);
    }

    set_rotation(rotation, speed = null) {
        rotation = this.normalize_rotation(rotation);

        if (speed == null) {
            this.rotation_tracker.current_speed = 0;
            this.rotation_tracker.current_value = rotation;
            this.rotation_tracker.target_value = rotation;
        } else {
            var start_position = this.get_rotation();
            var end_position = this.normalize_rotation(rotation);

            console.log(`${start_position} -> ${end_position}`);

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
            this.rotation_tracker.current_value = start_position;
            this.rotation_tracker.target_value = end_position;
            this.rotation_tracker.max_speed = speed;
        }
    }

    change_size(width, height = null, speed = null) {
        if (speed == null) {
            this.width = width;
            if (height == null) {
                height = this.width;
            }
            this.height = height;

            this.internal_render_size();
        } else {

        }
    }

    change_position(position, speed = null) {
        if (speed == null) {
            this.position = position;
            this.internal_render_position();
        } else {

        }
    }

    tick(delta_time) {
        this.rotation_tracker.step(delta_time);
        this.update_render();
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

document.onmousemove = function(e) {
    mouse_x = e.clientX;
    mouse_y = e.clientY;

    for (f of listeners_mousemove) {
        f(e);
    }
}

// async function uiUpdate() {
//     while(true) {
//         timestampStart = Date.now();
//         await sleep(16);
//     }
// }