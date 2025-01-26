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

    anim_rotation_tracker = new Animation();

    constructor(img_url = null, width = 128, height = null, rotation = 0) {
        super();
        this.img_url = img_url;

        if (height == null) {
            height = width;
        }

        this.width = width;
        this.height = height;

        this.make_screen_object_if_absent();
        this.change_rotation(rotation);
    }

    get_rotation() {
        return this.normalize_rotation(this.anim_rotation_tracker.get_current_point());
    }

    make_screen_object_if_absent() {
        if (this.screen_object !== null) {
            return;
        }

        var e = document.createElement("img");
        e.className = "sprite";
        e.src = this.img_url + `?v=${version}`;
        this.screen_object = e;

        this.internal_render_size();
        this.internal_render_position();
        this.internal_render_rotation();

        ui_sprite_render_target.appendChild(e);
    }

    change_rotation(rotation, speed = null) {
        rotation = this.normalize_rotation(rotation);

        if (speed == null) {
            var rat = this.anim_rotation_tracker;
            rat.end_position = rotation;
            rat.duration = 0;

            this.internal_render_rotation();
        } else {
            var e = this.screen_object;

            var start_position = this.get_rotation();
            var end_position = rotation;

            var degree_distance = Math.abs(end_position - start_position);
            if (degree_distance > 180) {
                degree_distance = 360 - degree_distance;
                if (end_position > start_position) {
                    end_position -= 360;
                } else {
                    end_position += 360;
                }
            }

            var duration = (degree_distance * 1000) / speed;

            var rat = this.anim_rotation_tracker;
            rat.start_position = start_position;
            rat.end_position = end_position;
            rat.duration = duration;
            rat.time_start = Date.now();
            rat.bezier_params = "0.5, 0.5, 0.5, 0.5";

            console.log(`rotate ${start_position} -> ${end_position}`);

            // adjust since css is doing things the opposite way
            start_position = -start_position;
            end_position = -end_position;
            const animation_prop = [
                { rotate: `${start_position}deg`, offset: 0 },
                { rotate: `${end_position}deg`, offset: 1 },
            ];

            const animation_speed = {
                duration: duration,
                iterations: 1,
                fill: "forwards",
                easing: `cubic-bezier(${rat.bezier_params})`
            };

            e.animate(animation_prop, animation_speed);
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

    internal_render_size() {
        var e = this.screen_object;
        e.style.width = `${this.width}px`;
        e.style.height = `${this.height}px`;
    }

    internal_render_position() {
        var e = this.screen_object;
        e.style.top = `${Math.round(this.position.y - this.height / 2)}px`;
        e.style.left = `${Math.round(this.position.x - this.width / 2)}px`;
    }

    internal_render_rotation() {
        var e = this.screen_object;
        var rotation = -this.get_rotation();

        e.style.rotate = `${rotation}deg`;
    }

    get_rotation_from_style() {
        var e = this.screen_object;
        var deg = e.style.rotate;
        deg = deg.slice(0, -3);
        console.log(deg);
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