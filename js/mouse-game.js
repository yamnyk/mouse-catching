class MouseGame {
    constructor(containerClassName) {
        this.gameContainer = document.querySelector(`.${containerClassName}`);
        this.time = 10;
        this.lvl = 1;
        this.countDown = null;
        this.redCircle = document.createElement('div');
        this.scoreAndTime = document.createElement('div');
        this.showLevel = document.createElement('span');
        this.time = document.createElement('span');
        this.startBtn = document.createElement('button');

        this.showLevel.textContent = this.lvl;
        this.startBtn.textContent = 'Start';
    }

    start() {
        this.renderGameField();

        const mouseMove = (e) => {
            this.startBtn.innerText = 'Reset';
            if (this.isGameOver(e)) {
                this.endCountDown(mouseMove);
                this.lvl = 1;
            } else {
                this.mouseMoveHandler(e);
            }

        };
        this.startBtn.addEventListener('click', () => {
            this.endCountDown(mouseMove);
            this.startCountDown(mouseMove);
            this.gameContainer.addEventListener('mousemove', mouseMove);
        });
    }

    mouseMoveHandler(e) {
        const cursorX = e.clientX,
            cursorY = e.clientY,
            circleTopCenter = this.redCircle.offsetWidth / 2,
            circleLeftCenter = this.redCircle.offsetHeight / 2;

        setTimeout(() => {
            this.redCircle.style.transform = `translate(${cursorX - circleLeftCenter}px, ${cursorY - circleTopCenter}px)`;
        }, 270 - (this.lvl * 20));
    }

    renderGameField() {
        this.redCircle.classList.add('red-circle');
        this.scoreAndTime.classList.add('game-table');
        this.showLevel.classList.add('game-table__level');
        this.time.classList.add('game-table__time');

        this.scoreAndTime.append(this.showLevel, this.time);

        this.redCircle.style.width = `${this.lvl * 15}px`;
        this.redCircle.style.height = `${this.lvl * 15}px`;
        this.redCircle.style.transform = `translate(0px, 0px)`;
        this.showLevel.textContent = this.lvl;

        this.gameContainer.append(
            this.redCircle,
            this.scoreAndTime,
            this.startBtn
        )
    }

    startCountDown(handler) {
        this.time.textContent = this.lvl * 10;
        this.renderGameField();
        this.countDown = setInterval(() => {
            if (this.time.textContent === '0') {
                this.lvl++;
                this.endCountDown(handler);
            } else {
                this.time.textContent = (parseInt(this.time.textContent) || this.lvl * 10) - 1;
            }
        }, 1000)
    }

    endCountDown(handler) {
        this.gameContainer.removeEventListener('mousemove', handler);
        this.time.textContent = '';
        this.startBtn.textContent = 'Start';
        clearInterval(this.countDown);
    }

    isGameOver(e) {
        const circlePos = parsePosition(this.redCircle.style.transform),
            cursorPos = {
                x: e.clientX,
                y: e.clientY,
            };

        circlePos.circleWidthEnd = circlePos.x + this.redCircle.offsetWidth;
        circlePos.circleHeightEnd = circlePos.y + this.redCircle.offsetHeight;

        return (cursorPos.x >= circlePos.x && cursorPos.x <= circlePos.circleWidthEnd)
            && (cursorPos.y > circlePos.y && cursorPos.y < circlePos.circleHeightEnd);

        function parsePosition(positionString) {
            const open = positionString.indexOf('(') + 1,
                close = positionString.indexOf(')'),
                coma = positionString.indexOf(',') + 1,
                posX = parseInt(positionString.substring(open, coma)),
                posY = parseInt(positionString.substring(coma,close));

            return {
                x: posX,
                y: posY
            };
        }
    }
}