async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

class AbstractionApi {
    listeners_mousemove = [];
    listeners_resize = [];
    listeners_update_ui = [];

    mouse_ui_position = new Vector2();
    window_size = new Vector2();

    last_anim_frame_timestamp = null;

    lerps_updating = [];

    constructor() {
        document.onmousemove = function(e) {
            for (var f of this.listeners_mousemove) {
                f(e);
            }
        }.bind(this);

        window.onresize = function(e) {
            for (var f of this.listeners_resize) {
                f(e);
            }
        }.bind(this);

        this.set_window_size();

        this.listeners_resize.push(this.set_window_size.bind(this));
        this.listeners_mousemove.push(this.set_mouse_position.bind(this));
        this.listeners_update_ui.push(this.update_lerps.bind(this));
        requestAnimationFrame(this.update_ui.bind(this));
    }

    set_window_size(e) {
        this.window_size.x = window.innerWidth;
        this.window_size.y = window.innerHeight;
        console.log("resized window!", this.window_size);
    }

    set_mouse_position(e) {
        this.mouse_ui_position.x = e.clientX;
        this.mouse_ui_position.y = e.clientY;

        // this.world_mouse_position = this.mouse_ui_position.minus(this.camera.get_position());
    }

    update_ui(timestamp) {
        if (this.last_anim_frame_timestamp == null) {
            this.last_anim_frame_timestamp = timestamp;
            requestAnimationFrame(this.update_ui.bind(this));
            return;
        }

        var delta_time = (timestamp - this.last_anim_frame_timestamp) / 1000;

        this.last_anim_frame_timestamp = timestamp;

        for (var f of this.listeners_update_ui) {
            f(delta_time);
        }

        requestAnimationFrame(this.update_ui.bind(this));
    }

    update_lerps(delta_time) {
        for (var i = 0; i < this.lerps_updating.length; i += 1) {
            var lerp = this.lerps_updating[i];
            lerp.step(delta_time);

            if (!lerp.needs_step()) {
                lerp.is_on_update_list = false;
                this.lerps_updating.splice(i, 1);
                i -= 1;
                // console.log(`deleted lerp #${i}`);
            }
        }
    }

    add_lerp_to_update_list(lerp) {
        if (!lerp.is_on_update_list) {
            this.lerps_updating.push(lerp);
            lerp.is_on_update_list = true;
        }
    }
}

class LerpValue extends BasicLerpValue {
    is_on_update_list = false;
    callback = null;

    set_goal(target_value, current_value = null, inertia = null) {
        super.set_goal(target_value, current_value, inertia);
        abstraction_api.add_lerp_to_update_list(this);
    }
}

class LerpVector2 {
    x;
    y;

    constructor(max_speed = null, acceleration = null, deceleration = null) {
        this.x = new LerpValue(max_speed, acceleration, deceleration);
        this.y = new LerpValue(max_speed, acceleration, deceleration);
    }

    get() {
        return new Vector2(this.x.get(), this.y.get());
    }

    set(value) {
        this.x.set(value.x);
        this.y.set(value.y);
    }

    set_goal(target_value, current_value = null, inertia = null) {
        this.x.set_goal(target_value.x, current_value?.x, inertia?.x);
        this.y.set_goal(target_value.y, current_value?.y, inertia?.y);
    }
}

abstraction_api = new AbstractionApi();
