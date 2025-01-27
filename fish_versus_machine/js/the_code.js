var guppies = [];

for (var i = 0; i < 1; i += 1) {
    var guppy = new Sprite("img/guppy.png", new Vector2(0 + i * 7, 0 + i * 7));
    guppies.push(guppy);
}

api.listeners_update_ui.push(function (t) {
    for (var guppy of guppies) {
        guppy.update_render();
    }
});

function moved_mouse(e) {
    for (guppy of guppies) {
        var new_rotation = guppy.position.getDegreesBetween(api.world_mouse_position);
        guppy.set_rotation(new_rotation);
    }
}

api.listeners_mousemove.push(moved_mouse);

camera = new Camera();
api.camera = camera;
camera.set_position(new Vector2(0, 0));

// async function test() {
//     while (true) {
//         for (var i = 0; i < 1000; i += 2) {
//             // guppy.position.x = i;
//             // guppy.position.y = i;

//             guppy.width = 128 + ((i - 500) / 500) * 128;
//             guppy.height = 128 + ((i - 500) / 500) * 128;
//             guppy.rotation = i;
//             guppy.render();
//             await sleep(10);
//         }
//         await sleep(1000);
//     }
// }

// test();
