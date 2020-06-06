const path =require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('css/[name]-css.css')
const extractSASS = new ExtractTextPlugin('css/[name]-sass.css')
//构建前删除dist目录
const CleanWebpackPlugin = require('clean-webpack-plugin')


module.exports={
  'devtool': 'eval-source-map', //配置调试, 正式环境下注册该配置项
  'entry':'./src/js/main.js',//入口JS
  'output':{
    'filename':'superVideo.js',
    'path':path.resolve(__dirname,'./dist'),
    'library': 'Super', //类库名称
    'libraryExport': 'default',
    'libraryTarget': 'umd',
    'umdNamedDefine': true
  },
  'module':{
    'rules':[
      {
        'test':/\.css$/,
        'use': extractCSS.extract({
          'use': 'css-loader',
          'fallback': 'style-loader'
        })


      },
      {
        'test':/\.scss$/,
        'use': extractSASS.extract({
          'use': [
            {'loader': 'css-loader'},
            {'loader': 'sass-loader'}
          ],
          'fallback': 'style-loader'
        })
      },
      {
        'test': /\.js$/,
        'exclude': /(node_modules|bower_components)/,
        'use': {
          'loader': 'babel-loader',
          'options':{
            'cacheDirectory':true//缓存
          }
        }
      },
      { //打包css里的图片
        'test': /\.(png|jpg|gif|jpeg)$/,
        'use': [
          {
            'loader': 'url-loader',
            'options': {
              'limit': 8192, //小于8KB,就base64编码
              'name':'img/[name].[ext]', //在哪里生成
              'publicPath':'../' //在生成的文件引用,前面加
            }
          }
        ]
      }
    ]
  },
  'plugins': [
    new HtmlWebpackPlugin(
      {
        'template': './src/index.html',// 模板文件
        'filename': 'index.html'
      }
    ),
    new CopyWebpackPlugin([
      {'from':'./src/img','to':'./img'}
    ]),
    extractCSS,
    extractSASS,
    new CleanWebpackPlugin(['dist','build'],{
      'verbose':false,
      'exclude':['img']//不删除img静态资源
    })
  ]

}