async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

class Api {
    listeners_mousemove = [];
    listeners_update_ui = [];

    mouse_position = new Vector2();
    world_mouse_position = new Vector2();

    window_size = new Vector2();
    registered_lerps = [];

    last_anim_frame_timestamp = null;

    camera = null;

    constructor() {
        document.onmousemove = function(e) {
            for (var f of this.listeners_mousemove) {
                f(e);
            }
        }.bind(this);

        document.onresize = function(e) {
            this.set_window_size();
        }.bind(this);

        this.set_window_size();

        this.listeners_mousemove.push(this.set_mouse_position.bind(this));
        this.listeners_update_ui.push(this.update_lerps.bind(this));
        requestAnimationFrame(this.anim_frame_update_ui.bind(this));
    }

    set_window_size() {
        this.window_size.x = window.innerWidth;
        this.window_size.y = window.innerHeight;
    }

    set_mouse_position(e) {
        this.mouse_position.x = e.clientX;
        this.mouse_position.y = e.clientY;

        this.world_mouse_position = this.mouse_position.minus(this.camera.get_position());
    }

    start_stepping_lerp(lerp) {
        if (!lerp.api_is_being_stepped) {
            lerp.api_is_being_stepped = true;
            this.registered_lerps.push(lerp);
        }
    }

    update_lerps(delta_time) {
        for (var i = 0; i < this.registered_lerps.length; i += 1) {
            var lerp = this.registered_lerps[i];
            lerp.step(delta_time);
            if (!lerp.needs_step()) {
                lerp.api_is_being_stepped = false;
                this.registered_lerps.splice(i, 1);
                i -= 1;
                // console.log(`deleted lerp #${i}`);
            }
        }
    }

    anim_frame_update_ui(timestamp) {
        if (this.last_anim_frame_timestamp == null) {
            this.last_anim_frame_timestamp = timestamp;
            requestAnimationFrame(this.anim_frame_update_ui.bind(this));
            return;
        }

        var delta_time = (timestamp - this.last_anim_frame_timestamp) / 1000;

        this.last_anim_frame_timestamp = timestamp;

        for (var f of this.listeners_update_ui) {
            f(delta_time);
        }

        requestAnimationFrame(this.anim_frame_update_ui.bind(this));
    }
}

api = new Api();