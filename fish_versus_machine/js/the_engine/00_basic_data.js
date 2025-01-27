version = "0.1";

class Vector2 {
    x;
    y;

    toString() {
        return `x ${this.x}, y ${this.y}`;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    getDegreesBetween(v2) {
        var angle = Math.atan2(- (v2.y - this.y), v2.x - this.x) * 180 / Math.PI;

        if (angle < 0) {
            angle = 180 + (180 - Math.abs(angle));
        }

        return angle;
    }

    plus(v2) {
        return new Vector2(this.x + v2.x, this.y + v2.y);
    }

    minus(v2) {
        return new Vector2(this.x - v2.x, this.y - v2.y);
    }
}

class Vector4 {
    x;
    y;
    z;
    w;

    constructor(x = 0, y = 0, z = 0, w = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}

class LerpValue {
    current_value = 0;
    target_value = 0;

    inertia = 0;
    max_speed = null;

    acceleration;
    deceleration;

    precision = 0.01;

    api_is_being_stepped = false;
    step_callback = null;

    constructor(max_speed = null, acceleration = null, deceleration = null) {
        if (acceleration == null) {
            acceleration = max_speed;
        }

        if (deceleration == null) {
            deceleration = max_speed;
        }

        this.max_speed = max_speed;
        this.acceleration = acceleration;
        this.deceleration = deceleration;
    }

    get() {
        return this.current_value;
    }

    set_goal(target_value, current_value = null, inertia = null) {
        this.target_value = target_value;

        if (current_value != null) {
            this.current_value = current_value;
        }

        if (inertia != null) {
            this.inertia = inertia;
        }

        api.start_stepping_lerp(this);
    }

    needs_step() {
        return this.current_value != this.target_value;
    }

    step(delta_time) {
        var distance = Math.abs(this.current_value - this.target_value);

        if (this.max_speed == null || distance <= this.precision) {
            this.current_value = this.target_value;
        } else {
            // console.log(`${delta_time}, ${this.current_value} -> ${this.target_value} (${distance}) @ ${this.inertia} / ${this.max_speed} deg/s`);

            var going_wrong_way = false;

            if (((this.current_value < this.target_value) && this.inertia < 0)
                || ((this.current_value > this.target_value) && this.inertia > 0)
            ) {
                // going wrong way
                // console.log("wrong way!");
                this.internal_decelerate(delta_time);
            } else {
                var time_to_stop = Math.abs(this.inertia / this.deceleration);
                var distance_travelled_if_stop_now = Math.abs((this.inertia / 2) * time_to_stop);
                // console.log(`${time_to_stop}s, ${distance_travelled_if_stop_now} distance`);

                if (distance -  distance_travelled_if_stop_now <= this.precision) {
                    // console.log("stopping!");
                    this.internal_decelerate(delta_time);
                } else {
                    this.internal_accelerate(delta_time);
                }
            }

            this.current_value += this.inertia * delta_time;
        }

        if (this.step_callback != null) {
            this.step_callback();
        }
    }

    internal_decelerate(delta_time) {
        if (this.inertia < 0) {
            this.inertia += delta_time * this.deceleration;
        } else {
            this.inertia -= delta_time * this.deceleration;
        }
    }

    internal_accelerate(delta_time) {
        if (this.inertia < 0) {
            this.inertia -= delta_time * this.acceleration;

            if (this.inertia < -this.max_speed) {
                this.inertia = -this.max_speed;
            }
        } else {
            this.inertia += delta_time * this.acceleration;

            if (this.inertia > this.max_speed) {
                this.inertia = this.max_speed;
            }
        }
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

    set_goal(target_value, current_value = null, inertia = null) {
        var current_value_vec2 = new Vector2(null, null);
        var inertia_vec2 = new Vector2(null, null);

        if (current_value != null) {
            current_value_vec2.x = current_value.x;
            current_value_vec2.y = current_value.y;
        }

        if (inertia != null) {
            inertia_vec2.x = inertia.x;
            inertia_vec2.y = inertia.y;
        }

        this.x.set_goal(target_value.x, current_value_vec2.x, inertia_vec2.x);
        this.y.set_goal(target_value.y, current_value_vec2.y, inertia_vec2.y);
    }
}

class Bezier {
    static cubic_bezier_precision = 50;
    static cubic_beziers = {
        // "0.42, 0, 0.58, 1.0": [],
        // "0.5, 0.5, 0.5, 0.5": [],
        // "0.25, 0.1, 0.25, 1": [],
        // "0, 0, 0.58, 1": []
    };

    static cubic_bezier(bezier_params, t) {
        var p1x = bezier_params.x;
        var p1y = bezier_params.y;
        var p2x = bezier_params.z;
        var p2y = bezier_params.w;

        var coord_x = 0;
        var coord_y = 0;

        coord_x = 3 * Math.pow(1 - t, 2) * t * p1x
                +
                3 * (1 - t) * Math.pow(t, 2) * p2x
                +
                Math.pow(t, 3);

        coord_y = 3 * Math.pow(1 - t, 2) * t * p1y
                +
                3 * (1 - t) * Math.pow(t, 2) * p2y
                +
                Math.pow(t, 3);

        return new Vector2(coord_x, coord_y);
    }

    static get_bezier_value(bezier_params, x) {
        if (Bezier.cubic_beziers[bezier_params] == null) {
            console.log("umm");
            Bezier.precalculate_bezier(bezier_params);
        }

        x = Math.round(x * Bezier.cubic_bezier_precision);
        return Bezier.cubic_beziers[bezier_params][x];
    }

    static get_bezier_value_plus_one(bezier_params, x) {
        x = Math.round(x * Bezier.cubic_bezier_precision);
        x += 1;
        if (x > Bezier.cubic_bezier_precision) {
            x = Bezier.cubic_bezier_precision;
        }

        return Bezier.cubic_beziers[bezier_params][x];
    }

    static precalculate_bezier(bezier_params_string) {
        var bezier_params_list = [];

        for (x of bezier_params_string.split(", ")) {
            bezier_params_list.push(parseFloat(x));
        }

        var bezier_params = new Vector4(bezier_params_list[0], bezier_params_list[1], bezier_params_list[2], bezier_params_list[3]);

        var x_values = {};
        x_values[0] = 0;
        x_values[Bezier.cubic_bezier_precision] = 1;

        var increment_amount = 1 / Bezier.cubic_bezier_precision;
        for (var i = 0; i <= 1; i += increment_amount) {
            var point = Bezier.cubic_bezier(bezier_params, i);
            // console.log("function point", i, point.x, point.y);

            // var s = new Sprite("img/tester.png", 2);
            // if (point.x > 1) {
            //     s.change_size(128);
            // }

            // s.change_position(new Vector2(512 + point.x * 128, 512 - point.y * 128));

            var x = Math.round(point.x * Bezier.cubic_bezier_precision);
            x_values[x] = point.y;
        }

        var precalculated_list = [];

        function find_closest_defined_value(x) {
            var distance = 0;
            var value_found = null;

            while (value_found == null) {
                // console.log("search is", x, x + distance, x - distance, x_values[x + distance], x_values[x - distance], x_values);

                if (x_values[x + distance] != null) {
                    value_found = x_values[x + distance];
                }

                if (x_values[x - distance] != null) {
                    value_found = x_values[x - distance];
                }

                distance += 1;
            }

            return value_found;
        }

        for (var i = 0; i <= Bezier.cubic_bezier_precision; i += 1) {
            var value = find_closest_defined_value(i);
            precalculated_list.push(value);
        }

        Bezier.cubic_beziers[bezier_params_string] = precalculated_list;
        console.log("precalculated", bezier_params_string, precalculated_list);
    }

}
