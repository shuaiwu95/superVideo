class VideoSource {
  constructor (videoSourceOption = {}) {
    const defaultOption = {
      'src': ''
    }
    this.option = Object.assign({}, defaultOption, videoSourceOption)
    this.source_ = null
    this.createSource_()
  }

  /**
   * @description 生成播放资源
   *
   * @memberof Videopc
   */
  createSource_ () {
    const source = this.source_ = document.createElement('source')
    source.setAttribute('src', this.option.src)
  }

  /**
   * @description 获取资源
   *
   * @returns
   * @memberof VideoSource
   */
  getSource () {
    return this.source_
  }

}
export default VideoSource