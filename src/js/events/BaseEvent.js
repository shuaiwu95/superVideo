/**
 * @classdesc
 * 自定义事件基类
 * 该类精简了W3C DOM事件定义方式
 * 该类只提供 type target stopPropagation preventDefault
 * @class BaseEvent
 * @author lishuaiwu
 * @email shuaiwu123@foxmail.com
 * @date 2020/06/06
 */
class BaseEvent {
  constructor (type) {
    this.propagationStopped
    this.type = type
    this.target = null
  }
  /**
   * Stop event propagation.
   */
  preventDefault() {
    this.propagationStopped = true
  }

  /**
   * Stop event propagation.
   */
  stopPropagation() {
    this.propagationStopped = true
  }
}

export function stopPropagation(evt) {
  evt.stopPropagation()
}

export function preventDefault(evt) {
  evt.preventDefault()
}
export default BaseEvent