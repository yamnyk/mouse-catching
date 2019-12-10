function printNothing() {
    console.log("nothing");
}
printNothing();

function randomIntInRange(from, to) {
    return Math.random() * (to - from) + from;
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16) + '88'
}

function changeBG({timing, draw, duration}) {

    let start = performance.now();
    let evenPoint = duration / 1000;

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;

        let progress = timing(timeFraction);
        if (progress > evenPoint) {
            draw(progress);
            progress = 0;
            evenPoint += duration / 1000;
        }

        requestAnimationFrame(animate);

    });
}

changeBG({
    timing: function (t) {
        return t;
    },
    draw: function (progress) {
        const r = randomColor();
        document.querySelector('.game-field').style.backgroundColor = r;
        document.querySelector('.game-table').style.color = r;
    },
    duration: 5000
});

const mouseGame = new MouseGame('game-field');
mouseGame.start();