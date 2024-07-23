// 拼接贝塞尔曲线路径
export const joinCubicBezierPath = (startPoint, endPoint, point1, point2) => {
  return `M ${startPoint.x},${startPoint.y} C ${point1.x},${point1.y} ${point2.x},${point2.y} ${endPoint.x},${endPoint.y}`
}

// 计算贝塞尔曲线的控制点
export const computeCubicBezierPathPoints = (x1, y1, x2, y2) => {
  const min = 5
  let cx1 = x1 + (x2 - x1) / 2
  let cy1 = y1
  let cx2 = cx1
  let cy2 = y2
  if (Math.abs(x1 - x2) <= min) {
    cx1 = x1 + (y2 - y1) / 2
    cx2 = cx1
  }
  if (Math.abs(y1 - y2) <= min) {
    cx1 = x1
    cy1 = y1 - (x2 - x1) / 2
    cx2 = x2
    cy2 = cy1
  }
  return [
    {
      x: cx1,
      y: cy1
    },
    {
      x: cx2,
      y: cy2
    }
  ]
}

// 三次贝塞尔曲线
export const cubicBezierPath = (x1, y1, x2, y2) => {
  const controlPoints = computeCubicBezierPathPoints(x1, y1, x2, y2)
  return joinCubicBezierPath(
    { x: x1, y: y1 },
    { x: x2, y: y2 },
    controlPoints[0],
    controlPoints[1]
  )
}

// 获取矩形的连接点
export const getRectPoint = (rect, dir = 'right', offset = 0) => {
  const { x, y, width, height } = rect
  switch (dir) {
    case 'left':
      return {
        x,
        y: y + height / 2 - offset
      }
    case 'right':
      return {
        x: x + width,
        y: y + height / 2 - offset
      }
    case 'top':
      return {
        x: x + width / 2 - offset,
        y
      }
    case 'bottom':
      return {
        x: x + width / 2 - offset,
        y: y + height
      }
    default:
      break
  }
}

//获取一个矩形的中心点
export const getRectCenterPoint = rect => {
  return {
    x: rect.x() + rect.width() / 2,
    y: rect.y() + rect.height() / 2
  }
}

// 获取一个矩形各个端点的atan2值列表
// 从左上角开始
export const getRectAtan2EdgeList = rect => {
  const center = getRectCenterPoint(rect)
  const pointList = [
    [rect.x(), rect.y()],
    [rect.x() + rect.width(), rect.y()],
    [rect.x() + rect.width(), rect.y() + rect.height()],
    [rect.x(), rect.y() + rect.height()]
  ]
  return pointList.map(item => {
    return radToDeg(Math.atan2(item[1] - center.y, item[0] - center.x))
  })
}

// 弧度转角度
export const radToDeg = r => {
  return (r * 180) / Math.PI
}

// 获取角度所在矩形的方向
export const getDegDir = (deg, degList) => {
  if (deg >= degList[0] && deg < degList[1]) {
    return 'top'
  } else if (deg >= degList[1] && deg < degList[2]) {
    return 'right'
  } else if (deg >= degList[2] && deg < degList[3]) {
    return 'bottom'
  } else {
    return 'left'
  }
}

// 获取角度在所在方向角度范围内的比例，相当于起始角度
export const getDegRatio = (deg, dir, degList) => {
  switch (dir) {
    case 'top':
      return (deg - degList[0]) / (degList[1] - degList[0])
    case 'right':
      return (deg - degList[1]) / (degList[2] - degList[1])
    case 'bottom':
      return (deg - degList[2]) / (degList[3] - degList[2])
    case 'left':
      // 因为该范围包含起点终点，所以要判断一下
      const range = 180 - degList[3] + (180 + degList[0])
      const offset = deg > 0 ? deg - degList[3] : 180 + deg + 180 - degList[3]
      return offset / range
  }
}

// 根据方向和比例计算新的坐标
export const getPointBy = (rect, dir, ratio) => {
  switch (dir) {
    case 'top':
      return {
        x: rect.x() + rect.width() * ratio,
        y: rect.y()
      }
    case 'right':
      return {
        x: rect.x() + rect.width(),
        y: rect.y() + rect.height() * ratio
      }
    case 'bottom':
      return {
        x: rect.x() + rect.width() * (1 - ratio),
        y: rect.y() + rect.height()
      }
    case 'left':
      return {
        x: rect.x(),
        y: rect.y() + rect.height() * (1 - ratio)
      }
  }
}
