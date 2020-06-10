## SuperVideo - H5视频播放插件 ##
**简介**

SuperVideo是一款H5视频播放插件，基于H5 video 对象开发。
该项目用ES6语法编写，可将源码嵌入您的项目按需引用也可以打包后引用。
SuperVideo集成了大部分video对象常用属性与方法，内置了常用的视频播放控件，也支持用户自定义控件。当前版本为 SuperVideo 1.0测试版本，当前api是不稳定的并有可能随时发生变化。

**示例**<br/>
[DEMO][1]
[1]: https://hulalalalala.github.io/superVideo/examples/initVideo.html

**参考文档**<br/>
[参考API][1]
[1]: https://hulalalalala.github.io/superVideo/examples/initVideo.html

**安装使用**<br/>
npm run build
将打包后的dist文件中的JS和CSS文件引入项目即可
您也可以将examples中的文件直接拿来使用，作者会长久维护此案例文件<br/>

**基础用法**<br/>
引入资源
```
<link href="main-css.css" rel="stylesheet"></head>
<script type="text/javascript" src="superVideo.js"></script>
```
编写代码
```
const nextControl = new Super.NextControl() // 实例化“下一个”按钮控件
const Dbspeen = new Super.Dbspeen() // 倍速控件
const fullScreenControl = new Super.FullScreenControl() // 实例化“全屏”控件
const video = new Super.Svideo('videoContainer', {
    source: new Super.VideoSource({ // 引入视频资源
        src: 'test.mp4'
    }),
    leftControls: [nextControl], // 控件栏左槽插入控件
    rightControls: [Dbspeen, fullScreenControl] // 控件栏右槽插入控件
})
video.addEventListener('change', (event) => { // 监听video各属性变化
    // console.log(event)
})
nextControl.addEventListener('click', () => { // 监听“下一个”按钮控件点击事件
    alert('click next menu !!!')
})
fullScreenControl.addEventListener('fullscreen', () => { // 监听进入全屏
    console.log('is fullscreen !!!')
})
fullScreenControl.addEventListener('cancelfullscreen', () => { // 监听退出全屏
    console.log('cancel fullscreen !!!')
})
```

**ES6方式引用**<br/>
将项目SRC文件下的JS和CSS文件放入您的项目，然后import按需引入核心类，资源类，控件类即可<br/>
```
import Svideo from 'Svideo'
import VideoSource from 'VideoSource'

const video = new Svideo('videoContainer', {
    source: new VideoSource({ // 引入视频资源
        src: 'test.mp4'
    })
})
```

**开发自定义控件**<br/>
编码<br/>
```
import Control from 'Control'
export default class CustomControl extends Control {
    constructor () {
        super()
    }
    create_ () {
        // 在这里编写控件相关代码
    }
} 
```
使用<br/>
```
import CustomControl from 'CustomControl'
...

const video = new Svideo('videoContainer', {
    source: new VideoSource({ // 引入视频资源
        src: 'test.mp4'
    }),
    rightControls: [new CustomControl()] // 控件栏右槽插入控件
})

// or

video.addRightControl(new CustomControl())
```

**联系作者**<br/>
shuaiwu123@foxmail.com<br/>
lishuaiwu5201314@gmail.com<br/>

**H5前端交流QQ群**<br/>
106048926

**算法交流QQ群**<br/>
417370175


