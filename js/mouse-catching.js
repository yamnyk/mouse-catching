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
  controlPanel = {
    wrapper: document.createElement('div'),
    timeAndScore: document.createElement('span'),
    lvl: document.createElement('span'),
    msg: document.createElement('span'),
  };
  lvl = 1;
  time = 10;
  
  
  constructor(containerSelector) {
    const {controlPanel, lvl, time} = this;
    this.gameContainer = document.querySelector(containerSelector);
    controlPanel.lvl.textContent = lvl;
    controlPanel.timeAndScore.textContent = time;
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
    this.setState(this.getStateList().INITIALIZED);
    return this;
  }
}

const mouseCatchingGame = new MouseCatchingGame('.game-field').init();