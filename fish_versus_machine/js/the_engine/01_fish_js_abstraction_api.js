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

    key_pressed = {};
    listeners_any_key = [];
    listeners_specific_key = {};

    document_was_invisible = false;

    constructor() {
        document.onmousemove = function(e) {
            for (let f of this.listeners_mousemove) {
                f(e);
            }
        }.bind(this);

        window.onresize = function(e) {
            for (let f of this.listeners_resize) {
                f(e);
            }
        }.bind(this);

        document.addEventListener("keydown", this.event_keydown.bind(this));
        document.addEventListener("keyup", this.event_keyup.bind(this));

        this.set_window_size();

        this.listeners_resize.push(this.set_window_size.bind(this));
        this.listeners_mousemove.push(this.set_mouse_position.bind(this));
        this.listeners_update_ui.push(this.update_lerps.bind(this));
        requestAnimationFrame(this.update_ui.bind(this));

        document.addEventListener("visibilitychange", function() {
            document_visible = !document.hidden && document.visibilityState == "visible";
            if (!document_visible) {
                this.document_was_invisible = true;
            }

        }.bind(this));
    }

    event_keydown(e) {
        let key = e.key;

        if (this.key_pressed[key] == 1) {
            return;
        }

        this.key_pressed[key] = 1;

        for (let f of this.listeners_any_key) {
            f(key);
        }

        if (this.listeners_specific_key[key] != null) {
            for (let f of this.listeners_specific_key[key]) {
                f(key);
            }
        }

        // console.log(e, e.key);
    }

    event_keyup(e) {
        let key = e.key;

        if (this.key_pressed[key] == 0) {
            return;
        }

        this.key_pressed[key] = 0;

        for (let f of this.listeners_any_key) {
            f(key);
        }

        if (this.listeners_specific_key[key] != null) {
            for (let f of this.listeners_specific_key[key]) {
                f(key);
            }
        }

        // console.log(e, e.key);
    }

    is_key_pressed(key) {
        if (this.key_pressed[key] != null) {
            return this.key_pressed[key] == 1;
        }

        return false;
    }

    register_for_keys(keys, callback) {
        if (typeof keys == "string") {
            keys = [keys];
        }

        for (let key of keys) {
            if (this.listeners_specific_key[key] == null) {
                this.listeners_specific_key[key] = [];
            }

            this.listeners_specific_key[key].push(callback);
        }
    }

    set_window_size(e) {
        this.window_size.x = window.innerWidth;
        this.window_size.y = window.innerHeight;
    }

    set_mouse_position(e) {
        this.mouse_ui_position.x = e.clientX;
        this.mouse_ui_position.y = e.clientY;

        // this.world_mouse_position = this.mouse_ui_position.minus(this.camera.get_position());
    }

    update_ui(timestamp) {
        if (this.last_anim_frame_timestamp == null || this.document_was_invisible) {
            this.document_was_invisible = false;
            this.last_anim_frame_timestamp = timestamp;
            requestAnimationFrame(this.update_ui.bind(this));
            return;
        }

        let delta_time = (timestamp - this.last_anim_frame_timestamp) / 1000;
        if (delta_time > 1) {
            delta_time = 1;
        }

        this.last_anim_frame_timestamp = timestamp;

        for (let f of this.listeners_update_ui) {
            f(delta_time);
        }

        requestAnimationFrame(this.update_ui.bind(this));
    }

    update_lerps(delta_time) {
        for (let i = 0; i < this.lerps_updating.length; i += 1) {
            let lerp = this.lerps_updating[i];
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
    callbacks = [];

    set_goal(target_value, current_value = null, inertia = null) {
        super.set_goal(target_value, current_value, inertia);

        if (this.needs_step(target_value, current_value)) {
            abstraction_api.add_lerp_to_update_list(this);
        }
    }

    set_instant_flip(instant_flip) {
        this.instant_flip = instant_flip;
    }

    add_callback(f) {
        this.callbacks.push(f);
    }

    step(delta_time) {
        super.step(delta_time);

        for (let f of this.callbacks) {
            f();
        }
    }
}

class LerpVector2 {
    x;
    y;
    callbacks = [];

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

    set_instant_flip(instant_flip) {
        this.x.set_instant_flip(instant_flip);
        this.y.set_instant_flip(instant_flip);
    }

    set_goal(target_value, current_value = null, inertia = null) {
        this.x.set_goal(target_value.x, current_value?.x, inertia?.x);
        this.y.set_goal(target_value.y, current_value?.y, inertia?.y);
    }

    set_deceleration_coef(deceleration_coef) {
        this.x.deceleration_coef = deceleration_coef.x;
        this.y.deceleration_coef = deceleration_coef.y;
    }

    add_callback(f) {
        this.x.add_callback(f);
        this.y.add_callback(f);
    }
}

abstraction_api = new AbstractionApi();
