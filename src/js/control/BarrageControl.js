import Control from './Control'
import eventType from '../events/EventType'
import Barrage from '../svideo/Barrage'
import { assign } from '../events/eventLib/obj'

/**
 * @classdesc
 * 控件 弹幕
 * @class BarrageControl
 * @extends {Control}
 */
class BarrageControl extends Control {
  constructor (barrageOption = {}) {
    const defaultOption = {
      'width': 240,
      'colors': [
        '#FE0302',
        '#FF7204',
        '#FFAA02',
        '#FFD302',
        '#00CD00',
        '#A0EE00',
        '#00CD00',
        '#019899',
        '#4266BE',
        '#89D5FF',
        '#CC0273',
        '#222222',
        '#9B9B9B',
        '#FFFFFF'
      ],
      'activeColor': '#FFFFFF',
      'value': ''
    }
    super()
    this.option = assign({}, defaultOption, barrageOption)
    this.activeLi_ = null
  }
  create_ () {
    const barrage = document.createElement('div')
    barrage.className = 'sv-barrage'
    this.element_.appendChild(barrage)
    const barrageA = document.createElement('div')
    barrageA.className = 'sv-barrage-a'
    barrage.appendChild(barrageA)
    const barrageInput = this.barrageInput_ = document.createElement('input')
    barrageInput.className = 'sv-barrage-input'
    barrageInput.placeholder = '发个弹幕见证当下'
    barrage.appendChild(barrageInput)
    const barrageButton = document.createElement('button')
    barrageButton.className = 'sv-barrage-button'
    barrageButton.innerHTML = '发送'
    barrage.appendChild(barrageButton)
    const font = document.createElement('div')
    font.innerHTML = '&#xe62b;'
    font.className = 'sv-barrage-font sv-font sv-fontBtn'
    barrage.appendChild(font)
    // 字体设置面板
    const aPanel = document.createElement('div')
    aPanel.className = 'sv-apanel hide'
    barrage.appendChild(aPanel)
    // item
    const panelItem = document.createElement('div')
    panelItem.className = 'sv-apanel-item'
    aPanel.appendChild(panelItem)
    const panelItemTitle = document.createElement('span')
    panelItemTitle.innerHTML = '颜色'
    panelItem.appendChild(panelItemTitle)
    const panelItemUl = document.createElement('ul')
    this.option.colors.forEach(item => {
      const li = document.createElement('li')
      li.setAttribute('color', item)
      li.style.backgroundColor = item
      panelItemUl.appendChild(li)
      li.onclick = () => {
        this.option.activeColor = li.getAttribute('color')
        li.classList.add('activeColor')
        this.activeLi_.classList.remove('activeColor')
        this.activeLi_ = li
      }
      if (item === '#FFFFFF') {
        this.activeLi_ = li
        li.classList.add('activeColor')
      }
    })
    panelItem.appendChild(panelItemUl)
    // 设置输入框宽度
    this.setWidth()
    // 调用弹幕接口
    barrageButton.onclick = () => {
      const color = this.option.activeColor
      this.video_.addBarrage_(new Barrage(barrageInput.value, {
        'color': color
      }))
      this.option.value = barrageInput.value
      barrageInput.value = ''
      this.dispatchEvent(eventType.SEND)
    }
    barrageInput.onkeydown = (event) => {
      if (event.keyCode === 13) {
        barrageButton.click()
      }
    }

    font.onmouseover = () => {
      aPanel.classList.remove('hide')
    }
    let timer = null
    font.onmouseleave = () => {
      timer = setTimeout(() => {
        aPanel.classList.add('hide')
        clearTimeout(timer)
      }, 500)
    }

    aPanel.onmouseover = () => {
      aPanel.classList.remove('hide')
      clearTimeout(timer)
    }
    aPanel.onmouseleave = () => {
      aPanel.classList.add('hide')
    }
  }

  /**
   * @description
   * 输入弹幕
   * @param {*} val
   * @memberof BarrageControl
   */
  setBarrage_ (val) {
    this.video_.addBarrage_(val)
  }

  /**
   * @description
   * 设置输入框宽度
   * @memberof BarrageControl
   */
  setWidth (width = 240) {
    this.barrageInput_.style.width = `${width}px`
    this.option.width = width
  }
}

export default BarrageControl