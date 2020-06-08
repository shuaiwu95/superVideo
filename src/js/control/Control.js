import '../../css/control.css'
import Target from '../events/Target'

/**
 * @classdesc
 * 控件类基类
 * @class Control
 */
class Control extends Target {
  constructor (controlOption) {
    const defaultOption = {
      'className': 'sv-el-control'
    }
    super()
    this.option = Object.assign({}, defaultOption, controlOption)
    this.element_ = null
  }

  init_ (video) {
    this.element_ = document.createElement('div')
    this.element_.className = `${this.option.className} sv-el-control-style`
    this.video_ = video
    this.create_()
    return this.element_
  }

  /**
   * @description 控件添加成功后回调函数
   *
   * @memberof Control
   */
  create_ () {}
}

export default Control