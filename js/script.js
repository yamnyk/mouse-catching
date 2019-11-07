class MouseGame {
    constructor(containerClassName) {
        this.gameContainer = document.querySelector(`.${containerClassName}`);
        this.score = 10;
        this.time = 10;
        this.lvl = 0;
        this.redCircle = document.createElement('div');
        this.scoreAndTime = document.createElement('div');
        this.score = document.createElement('span');
        this.time = document.createElement('span');
    }

    start() {
        this.renderGameField();
        this.gameContainer.addEventListener('mousemove', (e) => {
            this.mouseMoveHandler(e);
        });
    }

    mouseMoveHandler(e) {
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        const circleTopCenter = this.redCircle.offsetWidth / 2;
        const circleLeftCenter = this.redCircle.offsetHeight / 2;
        this.redCircle.style.transform = `translate(${cursorX + circleLeftCenter}px, ${cursorY + circleTopCenter}px)`;
    }

    renderGameField() {
        this.redCircle.classList.add('red-circle');
        this.scoreAndTime.classList.add('game-table');
        this.score.classList.add('game-table__score');
        this.time.classList.add('game-table__time');

        this.scoreAndTime.append(this.score, this.time);

        this.gameContainer.append(
            this.redCircle,
            this.scoreAndTime
        )
    }
}

const mouseGame = new MouseGame('game-field');
mouseGame.start();