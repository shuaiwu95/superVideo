import 'babel-polyfill'
// 类库入口文件
import Svideo from './Svideo'
import VideoSource from './source/VideoSource'
import Barrage from './Svideo/Barrage'

// control
import Control from './control/Control'
import NextControl from './control/NextControl'
import FullScreenControl from './control/FullScreenControl'
import DbspeenControl from './control/Dbspeed'
import BarrageControl from './control/BarrageControl'

// 导出类库
export default {
  Svideo,
  Barrage,
  VideoSource,
  Control,
  NextControl,
  FullScreenControl,
  DbspeenControl,
  BarrageControl
}