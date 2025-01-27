async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

class Api {
    listeners_mousemove = [];
    listeners_update_ui = [];

    mouse_position = new Vector2();
    registered_lerps = [];

    last_anim_frame_timestamp = null;

    constructor() {
        document.onmousemove = function(e) {
            this.mouse_position.x = e.clientX;
            this.mouse_position.y = e.clientY;

            for (var f of this.listeners_mousemove) {
                f(e);
            }
        }.bind(this)

        requestAnimationFrame(this.anim_frame_update_ui.bind(this));
        this.listeners_update_ui.push(this.update_lerps.bind(this));
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