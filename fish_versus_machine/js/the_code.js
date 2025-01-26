var guppies = [];

for (var i = 0; i < 5000; i += 1) {
    var guppy = new Sprite("img/guppy.png");
    guppy.change_position(new Vector2(0 + i * 7, 0 + i * 7));
    guppies.push(guppy);
    //guppy.change_rotation(180, 100);
}

// setInterval(function () {
//     for (var guppy of guppies) {
//         guppy.change_rotation(guppy.get_rotation() + 180, 100);
//     }
// }, 0, (180 / 100) * 1000 + 100);

function animate(timestamp) {
    console.log("animating", guppies);
    for (var guppy of guppies) {
        guppy.change_rotation(guppy.get_rotation() + 1);
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// function moved_mouse(e) {

//     var new_rotation = guppy.position.getDegreesBetween(new Vector2(mouse_x, mouse_y));
//     guppy.change_rotation(new_rotation, 90);
// }

// listeners_mousemove.push(moved_mouse);

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
