[![image](https://img.shields.io/npm/v/supervideo)](https://www.npmjs.com/package/supervideo)

## SuperVideo - H5 Video player plugin ##

[中文说明](https://github.com/hulalalalala/superVideo/blob/master/api/README.md)

**Introduction**
SuperVideo is a video playback plug-in developed based on H5 video.
The project is written in ES6 syntax and packaged with webpack.
SuperVideo integrates most common attributes and methods of video objects, built-in common video playback controls, and also supports user-defined controls. The current version is a test version, the current api is unstable and may change at any time

**NPM**<br/>
npm i supervideo --save

**CDN**<br/>
https://cdn.jsdelivr.net/gh/hulalalalala/superVideo@1.1.7/examples/css/main-css.css
https://cdn.jsdelivr.net/gh/hulalalalala/superVideo@1.1.7/examples/superVideo.js

**DEMO**<br/>
[DEMO](https://hulalalalala.github.io/superVideo/examples/index.html)

**API**<br/>
[API](https://hulalalalala.github.io/superVideo/api/index.html)

**run or build**<br/>
npm run build
Import the JS and CSS files in the packaged dist file into the project
You can also use the files in examples directly, the author will maintain this case file for a long time<br/>

**build usage**<br/>
引入资源
```
<link href="main-css.css" rel="stylesheet"></head>
<script type="text/javascript" src="superVideo.js"></script>
```
编写代码
```
    // Instantiate a "next" button control
    var nextControl = new Super.NextControl()
    // Instantiate a double speed control
    var Dbspeen = new Super.DbspeenControl()
    // Instantiate a barrage input box control
    var BarrageControl = new Super.BarrageControl()
    // Instantiate a full-screen button control
    var fullScreenControl = new Super.FullScreenControl()
    // Instantiate video playback resources
    var source = new Super.VideoSource({
      // type: Video type mp4: can play video files in common formats supported by browsers (mp4/ogg/webm) m3u8: can play live streaming video in Hls format (***.m3u8) flv: can play flv video
      // src: Video path, it can be a local path or a network path
      type: 'mp4',
      // blob: false, // Whether to encrypt blob MP4 video
      src: 'https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_AnimatedShot_Winston_Recall.mp4'
    })

    /* options */
    var config = {
      // Whether to play automatically (this function is limited by the browser security policy and may be invalid. The solution is to set mute when initializing, and unmute after loading)
      autoplay: false,
      currentTime: 0, // Set the initial playback time of the video, in seconds
      loop: false, // Whether to loop
      muted: false, // Whether to mute by default
      playbackRate: 1, // Default video playback speed
      poster: '', // The path of the first frame of the video
      volume: 0.5, // Video default volume 0-1
      showPictureInPicture: true, // Whether to enable the picture-in-picture mode button (>=Chrome10 valid)
      source: source, // Set up resources for video plugins
      leftControls: [nextControl], // Insert the "Next" button control on the left side of the bottom control bar
      rightControls: [Dbspeen, fullScreenControl], // Insert the "double speed" control and "full screen" control on the left side of the bottom control bar
      centerControls: [BarrageControl] // Insert "Barrage Input Control" in the middle of the bottom control bar
    }

    //To initialize the plugin superVideo('videoContainer'), please correspond to the plugin container id in the html.
    var video = new Super.Svideo('videoContainer', config)
```
**npm usage**<br/>
```
    import { Svideo, NextControl, VideoSource, DbspeenControl, FullScreenControl, BarrageControl } from 'supervideo'
    // 实例化一个“下一个”按钮控件
    const nextControl = new NextControl()
    // 实例化一个倍速控件
    const Dbspeen = new DbspeenControl()
    // 实例化一个弹幕输入框控件
    const barrageControl = new BarrageControl()
    // 实例化一个全屏按钮控件
    const fullScreenControl = new FullScreenControl()
    // 实例化视频播放资源
    const source = new VideoSource({
      // type: 视频类型 mp4:可播放浏览器支持的常见格式的视频文件(mp4/ogg/webm) m3u8: 可播放Hls形式推流直播视频(***.m3u8) flv: 可播放flv视频
      // src: 视频路径，可以是本地路径亦可是网络路径
      type: 'mp4',
      // blob: false, // 是否blob加密MP4视频
      src: 'https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_AnimatedShot_Winston_Recall.mp4'
    })

    // /* 插件的常用配置参数 */
    const config = {
      // 是否自动播放（该功能受限于浏览器安全策略，可能会失效，解决思路为初始化时设置为静音，加载完毕后取消静音）
      autoplay: false,
      currentTime: 0, // 设置视频初始播放时间，单位为秒
      loop: false, // 是否循环播放
      muted: false, // 是否默认静音
      playbackRate: 1, // 视频默认播放速度
      poster: '', // 视频首帧图片路径
      volume: 0.5, // 视频默认音量 0-1
      showPictureInPicture: true, // 是否启用画中画模式按钮（>=Chrome10有效）
      source: source, // 为视频插件设置资源
      leftControls: [nextControl], // 在底部控件栏左侧插入 “下一个”按钮控件
      rightControls: [Dbspeen, fullScreenControl], // 在底部控件栏左侧插入 “倍速” 控件和 “全屏” 控件
      centerControls: [barrageControl] // 在底部控件栏中间插入 “弹幕输入控件”
    }

    // 初始化插件superVideo('videoContainer')请对应好html中的插件容器id.
    /* eslint-disable no-new */
    new Svideo('videoContainer', config)
```
**Custom control**<br/>
```
  // Write control
  import { Control } from 'supervideo'
  export default class CustomControl extends Control {
    constructor () {
       super()
    }
    create_ () {
      // Write control related code here
      // this.element_ // Control parent container, add the HTML NODE you write to the container, then it can be loaded into the player normally
    }
  }
  // Use control
  new Svideo('videoContainer', {
    rightControls: [ new CustomControl() ]
  })
```
**event**<br/>
Support all event monitoring of native video object

**thanks**<br/>
The video decoding of superVideo's hls and flv formats all rely on hls.js and flv.js<br/>
Thanks to the great gods who developed these two video decoding open source libraries

**Contact the author email**<br/>
shuaiwu123@foxmail.com<br/>
lishuaiwu5201314@gmail.com<br/>

**SuperVideo QQ group**<br/>
1127738585

**H5 front-end exchange QQ group**<br/>
106048926

**Algorithm exchange QQ group**<br/>
417370175

**If this plugin is helpful to you, please donate a popsicle money to encourage**<br/>



