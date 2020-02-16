class MouseCatchingGame {
  circle = {
    x: 0,
    y: 0,
    el: document.createElement('div')
  };
  cursor = {
    x: null,
    y: null,
  };
  controlPanel = Object.freeze({
    wrapper: document.createElement('div'),
    timeAndScore: document.createElement('span'),
    lvl: document.createElement('span'),
    // msg: document.createElement('span'),
  });
  lvl = 1;
  time = 10;
  
  
  constructor(containerSelector) {
    const {controlPanel, lvl, time} = this;
    this.gameContainer = document.querySelector(containerSelector);
    
    const _STATUSES = Object.freeze({
      CREATED: 'CREATED',
      INITIALIZED: 'INITIALIZED',
      GAME_OVER: 'GAME_OVER',
      ON_GAME: 'ON_GAME',
      isPresent: function (check) {
        for (let key in this) {
          if (!(key instanceof Function) && key === check) {
            return true;
          }
        }
        return false;
      }
    });
    
    Object.defineProperty(this, 'state', {writable: false, configurable: true, value: _STATUSES.CREATED});
    
    this.setState = (newStatus) => {
      if (_STATUSES.isPresent(newStatus)) {
        Object.defineProperty(this, 'state', {value: _STATUSES[newStatus]});
      } else {
        throw new TypeError("Wrong status");
      }
    };
    this.__proto__.getStateList = () => Object.freeze({..._STATUSES});
  }
  
  init() {
    this.renderGameField();
    
    this.setState(this.getStateList().INITIALIZED);
    return this;
  }
  
  renderGameField() {
    const {controlPanel, lvl, time, circle, gameContainer} = this;
  
    controlPanel.lvl.textContent = lvl;
    controlPanel.timeAndScore.textContent = time;
    
    circle.el.classList.add('red-circle');
    controlPanel.wrapper.classList.add('game-table');
    controlPanel.timeAndScore.classList.add('game-table__time');
    controlPanel.lvl.classList.add('game-table__level');
    
    controlPanel.wrapper.append(
      controlPanel.timeAndScore,
      controlPanel.lvl
    );
  
    const circleSize = this.lvl * 15;
    circle.el.style.width = `${circleSize}px`;
    circle.el.style.height = `${circleSize}px`;
    circle.el.style.transform = `translate(${gameContainer.offsetWidth / 2 - circleSize}px, ${gameContainer.offsetHeight / 2 - circleSize}px)`;
  
    document.body.oncontextmenu = () => false;
  
    gameContainer.append(
      controlPanel.wrapper,
      circle.el
    )
    
  }
}

const mouseCatchingGame = new MouseCatchingGame('.game-field').init();