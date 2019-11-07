class MouseGame {
    constructor(containerClassName) {
        this.gameContainer = document.querySelector(`.${containerClassName}`);
        this.score = 10;
        this.time = 10;
        this.lvl = 1;
        this.countDown = null;
        this.redCircle = document.createElement('div');
        this.scoreAndTime = document.createElement('div');
        this.score = document.createElement('span');
        this.time = document.createElement('span');
        this.startBtn = document.createElement('button');
        this.startBtn.textContent = 'Start';
    }

    start() {
        this.renderGameField();

        const mouseMove = (e) => {
            this.mouseMoveHandler(e);
        };

        this.startBtn.addEventListener('click', () => {
            this.startCountDown(mouseMove);
            this.gameContainer.addEventListener('mousemove', mouseMove);
        });
    }

    mouseMoveHandler(e) {
        const cursorX = e.clientX;
        const cursorY = e.clientY;
        const circleTopCenter = this.redCircle.offsetWidth / 2;
        const circleLeftCenter = this.redCircle.offsetHeight / 2;
        setTimeout(() => {
            this.redCircle.style.transform = `translate(${cursorX - circleLeftCenter}px, ${cursorY - circleTopCenter}px)`;
        }, 100 / this.lvl);
    }

    renderGameField() {
        this.redCircle.classList.add('red-circle');
        this.scoreAndTime.classList.add('game-table');
        this.score.classList.add('game-table__score');
        this.time.classList.add('game-table__time');

        this.scoreAndTime.append(this.score, this.time);

        this.gameContainer.append(
            this.redCircle,
            this.scoreAndTime,
            this.startBtn
        )
    }

    startCountDown(handler) {
        this.countDown = setInterval(() => {
            if (this.time.textContent === '0') {
                this.gameContainer.removeEventListener('mousemove', handler);
                clearInterval(this.countDown);
            } else {
                this.time.textContent = parseInt(this.time.textContent || this.lvl * 10) - 1;
            }
        }, 1000)
    }
}

const mouseGame = new MouseGame('game-field');
mouseGame.start();