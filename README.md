## SuperVideo - H5视频播放插件 ##
**简介**

SuperVideo是一款基于 H5 video 开发的视频播放插件。
该项目用ES6语法编写,webpack打包。
SuperVideo集成了大部分video对象常用属性与方法，内置了常用的视频播放控件，也支持用户自定义控件。当前版本为 SuperVideo 1.0.7测试版本，当前api是不稳定的并有可能随时发生变化。

**示例**<br/>
[DEMO][https://hulalalalala.github.io/superVideo/examples/index.html]

**参考文档**<br/>
[API][https://hulalalalala.github.io/superVideo/api/index.html]

**安装使用**<br/>
npm run build
将打包后的dist文件中的JS和CSS文件引入项目即可
您也可以将examples中的文件直接拿来使用，作者会长久维护此案例文件<br/>

**build包用法**<br/>
引入资源
```
<link href="main-css.css" rel="stylesheet"></head>
<script type="text/javascript" src="superVideo.js"></script>
```
编写代码
```
// 实例化一个“下一个”按钮控件
    var nextControl = new Super.NextControl()
    // 实例化一个倍速控件
    var Dbspeen = new Super.DbspeenControl()
    // 实例化一个弹幕输入框控件
    var BarrageControl = new Super.BarrageControl()
    // 实例化一个全屏按钮控件
    var fullScreenControl = new Super.FullScreenControl()
    // 实例化视频播放资源
    var source = new Super.VideoSource({
      // type: 视频类型 mp4:可播放浏览器支持的常见格式的视频文件(mp4/ogg/webm) m3u8: 可播放Hls形式推流直播视频(***.m3u8) flv: 可播放flv视频
      // src: 视频路径，可以是本地路径亦可是网络路径
      type: 'mp4',
      src: 'https://blz-videos.nosdn.127.net/1/OverWatch/AnimatedShots/Overwatch_AnimatedShot_Winston_Recall.mp4'
    })

    /* 插件的常用配置参数 */
    var config = {
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
      centerControls: [BarrageControl] // 在底部控件栏中间插入 “弹幕输入控件”
    }

    //初始化插件superVideo('videoContainer')请对应好html中的插件容器id.
    var video = new Super.Svideo('videoContainer', config)
```

**事件监听**<br/>
支持原生video对象的所有事件监听

**感谢**<br/>
superVideo 的hls 和 flv 格式的视频解码全部依托于 hls.js 与 flv.js<br/>
感谢开发这两个视频解码开源库的大神

**联系作者**<br/>
shuaiwu123@foxmail.com<br/>
lishuaiwu5201314@gmail.com<br/>

**SuperVideo交流群1**<br/>
1127738585

**H5前端交流QQ群**<br/>
106048926

**算法交流QQ群**<br/>
417370175



