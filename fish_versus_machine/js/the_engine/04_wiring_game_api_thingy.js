class GameApi {
    camera;
    player;

    constructor() {
        this.camera = new Camera();
        this.player = new Entity();
        this.player.sprite_url = "img/guppy.png";
        this.player.screen_object_needs_update = true;

        abstraction_api.listeners_update_ui.push(this.player_face_mouse.bind(this));
        //abstraction_api.register_for_keys(["w", "a", "s", "d"], this.player_input.bind(this));
        abstraction_api.listeners_update_ui.push(this.player_input.bind(this));

    }

    get_mouse_world_position() {
        return abstraction_api.mouse_ui_position.minus(this.camera.get_ui_position());
    }

    player_face_mouse() {
        this.player.rotate_towards(this.get_mouse_world_position());
    }

    player_input() {
        var w = abstraction_api.is_key_pressed("w");
        var a = abstraction_api.is_key_pressed("a");
        var s = abstraction_api.is_key_pressed("s");
        var d = abstraction_api.is_key_pressed("d");

        this.player.set_movement_direction(w, d, a, s);
    }
}

game_api = new GameApi();

