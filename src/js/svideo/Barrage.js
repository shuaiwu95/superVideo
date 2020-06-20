import { assign } from '../events/eventLib/obj'

/**
 * @classdesc
 * 弹幕类
 * @class Barrage
 */
class Barrage {
  constructor (text = '', barrageOption = {}) {
    const defaultOption = {
      'color': '#ffffff',
      'fontSize': 14,
      'fontFamily': '微软雅黑',
      'fontWeight': 600,
      'text': text,
      'area': 0.5, // 屏占比
      'leftDom': null,
      'rightDom': null
    }
    this.option = assign({}, defaultOption, barrageOption)
  }
  getText () {
    return this.option.text
  }
  getColor () {
    return this.option.color
  }
  getFontSize () {
    return `${this.option.fontSize}px`
  }
  getFontFamily () {
    return this.option.fontFamily
  }
  getMinTop (dom) {
    return dom.clientHeight - dom.clientHeight * (1 - this.option.area) + 80
  }
  getLeftDom () {
    return this.option.leftDom
  }
  getRightDom () {
    return this.option.rightDom
  }
  getFontWeight () {
    return this.option.fontWeight
  }
}
export default Barrage