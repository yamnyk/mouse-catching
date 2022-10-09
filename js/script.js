import MouseGame from './mouse-game.js';

const gameConfig = {
  selectors: {
    field: '.game-field',
    controls: '.controls',
    userName: '.controls-username',
    controlsInfo: '.controls-info',
    controlsInfoTitle: '.controls-info-title',
    controlsInfoList: '.controls-info-list',
    controlsInfoItem: '.controls-info-item',
  },
  classes: {
    gameOverLose: 'game-field--lose',
    gameOverWin: 'game-field--win'
  }
}
const mouseGame = new MouseGame(gameConfig);
mouseGame.render();