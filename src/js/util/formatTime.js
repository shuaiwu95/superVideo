export const formatSeconds = (value) => {
  let theTime = parseInt(value)// 秒
  let theTime1 = 0// 分
  let theTime2 = 0// 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
    }
  }

  let result = String(parseInt(theTime))//秒
  if (theTime < 10 > 0) {
    result = '0' + parseInt(theTime)//秒
  } else {
    result = String(parseInt(theTime))//秒
  }

  if (theTime1 < 10 > 0) {
    result = '0' + parseInt(theTime1) + ':' + result//分，不足两位数，首位补充0，
  } else {
    result = String(parseInt(theTime1)) + ':' + result//分
  }
  if (theTime2 > 0) {
    result = String(parseInt(theTime2)) + ':' + result//时
  }
  return result
}