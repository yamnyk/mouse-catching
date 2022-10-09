import db from './api/firebase.js'
import {STATUS, CONSTANTS} from "./helpers/enums";
import {initialSelectors, initialElements, initialCursor} from "./helpers/initialValues";

export default class MouseGame {
  status = STATUS.NONE
  selectors = initialSelectors
  elements = initialElements
  cursor = initialCursor
  enemy = {
    self: document.createElement('div'),
    rendered: false,
    position: initialCursor
  }
  time = null
  didFirstMove = false
  user = null


  constructor({selectors, elements, classes}) {
    this.selectors = {...this.selectors, ...selectors};

    if (!elements) {
      Object.entries(this.selectors).forEach(([key, selector]) => {
        this.elements[key] = document.querySelector(selector);
      })
    } else {
      this.elements = {...this.elements, ...elements};
    }

    this.classes = {...this.classes, ...classes};

    document.oncontextmenu = e => {
      e.preventDefault()
      return null
    }
  }


  async render() {
    document.addEventListener('mousemove', e => this.handleMouseMove(e))

    document.addEventListener('keyup', e => {
      if (
        this.status === STATUS.NONE &&
        e.code.toLowerCase() === CONSTANTS.SPACE &&
        this.isCursorInFrame &&
        this.user
      ) {
        this.start()
      }
    })

    this.elements.userName.addEventListener('blur', async ({target}) => {
      const snSht = await db
        .collection('users')
        .where('name', '==', target.value)
        .get()
      let usr

      if (!snSht.empty) {
        const usrRes = snSht.docs[0]
        usr = {
          id: usrRes.id,
          ...usrRes.data()
        }
      } else {
        const saved = await db.collection('users').add({name: target.value})
        const usrFromDb = await db.collection('users').doc(saved.id).get()
        usr = {
          id: saved.id,
          ...usrFromDb.data()
        }
      }

      this.user = usr
      await this.getAllHistory()
    })

    await this.getAllHistory()
  }

  start() {
    this.status = STATUS.STARTED

    this.elements.field.style.overflow = 'hidden'
    this.elements.field.classList.remove(this.classes.gameOverLose)
    this.elements.field.classList.remove(this.classes.gameOverWin)

    if (!this.enemy.rendered) {
      this.makeEnemy()
    }

    const intervalID = setInterval(() => {
      if (
        this.status === STATUS.STARTED &&
        (!this.isCursorInFrame || this.isEnemyOnCursor())
      ) {
        this.status = STATUS.LOSE
      }

      if (this.isGameOver()) {
        this.endGame(intervalID)
        this.status = STATUS.NONE
      } else {
        this.handleInterval()
      }
    }, CONSTANTS.INTERVAL)
  }

  async endGame(intervalID) {
    clearInterval(intervalID)
    this.enemy.self.remove()
    this.enemy.rendered = false

    if (this.time !== null) {
      await this.handleSaveHistory({
        time: this.time,
        date: Date.now()
      })
    }

    this.time = null
    this.elements.controlsTiming.textContent = `Your time:`
    this.didFirstMove = false

    if (this.status === STATUS.LOSE) {
      this.elements.field.classList.add(this.classes.gameOverLose)
    } else if (this.status === STATUS.WIN) {
      this.elements.field.classList.add(this.classes.gameOverWin)
    }
  }

  isGameOver() {
    return this.status === STATUS.LOSE || this.status === STATUS.WIN
  }

  handleMouseMove(e) {
    if (
      this.status === STATUS.STARTED &&
      !this.didFirstMove &&
      this.time === null
    ) {
      this.didFirstMove = true
    }
    this.cursor.x = e.clientX
    this.cursor.y = e.clientY

    this.isCursorInFrame =
      this.cursor.x >= this.elements.field.offsetLeft &&
      this.cursor.x <=
      this.elements.field.offsetLeft + this.elements.field.clientWidth &&
      this.cursor.y >= this.elements.field.offsetTop &&
      this.cursor.y <=
      this.elements.field.offsetTop + this.elements.field.clientHeight

    const handleChange = (cursorX, cursorY) => {
      this.enemy.position.x = cursorX - this.enemy.self.clientWidth / 2
      this.enemy.position.y = cursorY - this.enemy.self.clientHeight / 2

      this.enemy.self.style.left = `${this.enemy.position.x}px`
      this.enemy.self.style.top = `${this.enemy.position.y}px`
    }

    setTimeout(
      handleChange,
      CONSTANTS.ENEMY_DELAY,
      this.cursor.x,
      this.cursor.y,
      this.elements.field.offsetLeft,
      this.elements.field.offsetTop
    )
  }

  handleInterval() {
    if (this.didFirstMove) {
      this.time += CONSTANTS.INTERVAL

      this.elements.controlsTiming.textContent = `Your time: ${this.getTime()}`
    }
  }

  makeEnemy() {
    const {self: enemy, position} = this.enemy
    const {field} = this.elements

    position.x = '50%'
    position.y = '50%'

    field.style.transformOrigin = 'center'

    enemy.style.position = 'fixed'
    enemy.style.left = position.x
    enemy.style.top = position.y

    enemy.classList.add('enemy')

    field.append(enemy)
    enemy.rendered = true
  }

  getTime() {
    return `${Math.round(this.time / 1000)}.${
      Math.round(this.time % 1000) / CONSTANTS.INTERVAL
    }`
  }

  isEnemyOnCursor() {
    const {x: cursorX, y: cursorY} = this.cursor
    const {x: enemyX, y: enemyY} = this.enemy.position
    const {offsetWidth: enemyWidth, offsetHeight: enemyHeight} =
      this.enemy.self

    return (
      cursorX >= enemyX &&
      cursorX <= enemyX + enemyWidth &&
      cursorY > enemyY &&
      cursorY < enemyY + enemyHeight
    )
  }

  async getAllHistory() {
    if (!this.user) return null

    const dataSnapshot = await db.collection('history').doc(this.user.id).get()
    const data = dataSnapshot.data()

    this.history = data.list.sort(({time: timeA}, {time: timeB}) => timeB - timeA)

    this.renderHistory()
  }

  async handleSaveHistory(payload) {
    if (!this.user) return null
    this.history = [...this.history, payload].sort(({time: timeA}, {time: timeB}) => timeB - timeA)

    await db.collection('history').doc(this.user.id).set({
      list: this.history
    })

    this.renderHistory()
  }

  renderHistory() {
    this.elements.controlsInfoList.innerHTML = ''

    this.elements.controlsInfoList.insertAdjacentHTML(
      'afterbegin',
      this.history.slice(0, 9).map(h => `<li class="${this.selectors.controlsInfoItem.slice(1)}">${h.time}</li>`).join('\n')
    )
  }
}