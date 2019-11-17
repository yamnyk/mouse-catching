function randomIntInRange(from, to) {
    return Math.random() * (to - from) + from;
}
function randomColor() {
    return '#'+Math.floor(Math.random()*16777215).toString(16)
}

function changeBG({timing, draw, duration}) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        console.log(timeFraction);

        // if (timeFraction > 1) timeFraction = 1;
        let progress = timing(timeFraction);
        if(progress >= 1) {
            draw(progress);
            progress = 0;
        }

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

changeBG({
    timing: function (t) {
        return t;
    },
    draw: function (progress) {
        document.querySelector('.game-field').style.backgroundColor = randomColor();
    },
    duration: 2000
});

const mouseGame = new MouseGame('game-field');
mouseGame.start();