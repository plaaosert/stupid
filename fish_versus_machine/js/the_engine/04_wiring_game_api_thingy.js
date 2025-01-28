class GameApi {
    camera;
    player;

    constructor() {
        this.camera = new Camera();
        this.player = new Entity("img/guppy.png");

        abstraction_api.listeners_mousemove.push(this.mouse_moved.bind(this));
        abstraction_api.register_for_keys(["w", "a", "s", "d"], this.player_input.bind(this));
    }

    get_mouse_world_position() {
        return abstraction_api.mouse_ui_position.minus(this.camera.get_ui_position());
    }

    mouse_moved() {
        this.player.rotate_towards(this.get_mouse_world_position());
    }

    player_input() {

    }
}

game_api = new GameApi();

