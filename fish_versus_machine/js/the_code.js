var guppies = [];

for (var i = 0; i < 1000; i += 1) {
    var guppy = new Sprite("img/guppy.png", new Vector2(64 + i * 7, 64 + i * 7));
    guppies.push(guppy);
    guppy.set_rotation(guppy.get_rotation() + 180);
    //guppy.change_rotation(180, 100);
}

// setInterval(function () {
//     for (var guppy of guppies) {
//         guppy.set_rotation(guppy.get_rotation() + 180, 90);
//     }
// }, 0, (180 / 90) * 1000 + 100);

var last_animation_frame_timestamp = null;

function animate(timestamp) {
    if (last_animation_frame_timestamp == null) {
        last_animation_frame_timestamp = timestamp;
        requestAnimationFrame(animate);
        return;
    }

    var delta_time = (timestamp - last_animation_frame_timestamp) / 1000;

    last_animation_frame_timestamp = timestamp;

    for (var guppy of guppies) {
        // if (guppy.get_rotation() > 200) {
        //     continue;
        // }

        guppy.tick(delta_time);
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// var guppy = guppies[0];
function moved_mouse(e) {

    for (guppy of guppies) {
        var new_rotation = guppy.position.getDegreesBetween(new Vector2(mouse_x, mouse_y));
        guppy.set_rotation(new_rotation, 2700);
    }
}

listeners_mousemove.push(moved_mouse);

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
