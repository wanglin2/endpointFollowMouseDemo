<template>
  <div class="container" ref="container"></div>
  <div class="toolbar"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Konva from 'konva'
import {
  cubicBezierPath,
  getRectPoint,
  computeCubicBezierPathPoints,
  joinCubicBezierPath,
  getRectCenterPoint,
  getRectAtan2EdgeList,
  radToDeg,
  getDegDir,
  getDegRatio,
  getPointBy
} from './utils'

const container = ref(null)

let layer = null,
  rect1, // 矩形1
  rect2, // 矩形2
  line, // 连接两个矩形的贝塞尔曲线
  point1, // 矩形1的控制点
  point2, // 矩形2的控制点
  line1, // 控制点1到矩形1的连线
  line1StartPoint, // line1在矩形上的连接点坐标
  line2, // 控制点2到矩形2的连线
  line2StartPoint // line1在矩形上的连接点坐标

// 初始化
const init = () => {
  const { width, height } = container.value.getBoundingClientRect()

  // 创建舞台
  const stage = new Konva.Stage({
    container: container.value,
    width,
    height
  })

  // 创建图层
  layer = new Konva.Layer()

  // 图层添加到舞台
  stage.add(layer)
}

// 创建矩形
const renderRects = () => {
  // 创建两个矩形
  rect1 = new Konva.Rect({
    x: 400,
    y: 200,
    width: 100,
    height: 100,
    fill: '#fbfbfb',
    stroke: '#f56c6c',
    strokeWidth: 4
  })

  rect2 = new Konva.Rect({
    x: 800,
    y: 600,
    width: 100,
    height: 100,
    fill: '#fbfbfb',
    stroke: '#409eff',
    strokeWidth: 4
  })

  // 矩形添加到图层
  layer.add(rect1)
  layer.add(rect2)
}

// 获取两个矩形初始的连接点位置
const getRectPos = () => {
  // 计算两个矩形初始的连接点
  const rect1Pos = getRectPoint({
    x: rect1.x(),
    y: rect1.y(),
    width: rect1.width(),
    height: rect1.height()
  })
  const rect2Pos = getRectPoint(
    {
      x: rect2.x(),
      y: rect2.y(),
      width: rect2.width(),
      height: rect2.height()
    },
    'left'
  )
  return {
    rect1Pos,
    rect2Pos
  }
}

// 创建控制点和矩形到控制点的连线
const createLine = () => {
  // 矩形上初始的连接点
  const { rect1Pos, rect2Pos } = getRectPos()
  line1StartPoint = {
    x: rect1Pos.x,
    y: rect1Pos.y
  }
  line2StartPoint = {
    x: rect2Pos.x,
    y: rect2Pos.y
  }
  // 计算连接两个连接点的三次贝塞尔曲线的两个控制点
  const controlPoints = computeCubicBezierPathPoints(
    line1StartPoint.x,
    line1StartPoint.y,
    line2StartPoint.x,
    line2StartPoint.y
  )
  // 连接两个矩形的贝塞尔曲线
  const path = joinCubicBezierPath(
    line1StartPoint,
    line2StartPoint,
    controlPoints[0],
    controlPoints[1]
  )
  line = new Konva.Path({
    data: path,
    stroke: '#e6a23c',
    strokeWidth: 2
  })
  layer.add(line)

  // 矩形1的控制点和其连线
  point1 = new Konva.Circle({
    x: controlPoints[0].x,
    y: controlPoints[0].y,
    radius: 10,
    fill: '#f56c6c',
    draggable: true
  })
  layer.add(point1)
  line1 = new Konva.Line({
    points: [controlPoints[0].x, controlPoints[0].y, line1StartPoint.x, line1StartPoint.y],
    stroke: '#f56c6c',
    strokeWidth: 2
  })
  layer.add(line1)

  // 矩形2的控制点和其连线
  point2 = new Konva.Circle({
    x: controlPoints[1].x,
    y: controlPoints[1].y,
    radius: 10,
    fill: '#409eff',
    draggable: true
  })
  layer.add(point2)
  line2 = new Konva.Line({
    points: [controlPoints[1].x, controlPoints[1].y, line2StartPoint.x, line2StartPoint.y],
    stroke: '#409eff',
    strokeWidth: 2
  })
  layer.add(line2)
}

const bindEvent = () => {
  // 控制点1的拖动事件
  // 顶点的倾斜角列表
  const rect1Atan2EdgeList = getRectAtan2EdgeList(rect1)
  point1.on('dragmove', () => {
    // 中心点
    const rect1CenterPoint = getRectCenterPoint(rect1)
    // 控制点的倾斜角
    const deg = radToDeg(
      Math.atan2(
        point1.y() - rect1CenterPoint.y,
        point1.x() - rect1CenterPoint.x
      )
    )
    // 所在方向
    const dir = getDegDir(deg, rect1Atan2EdgeList)
    // 所在方向的比例
    const ratio = getDegRatio(deg, dir, rect1Atan2EdgeList)
    // 计算连接点坐标
    line1StartPoint = getPointBy(rect1, dir, ratio)
    // 更新连线
    line1.points([point1.x(), point1.y(), line1StartPoint.x, line1StartPoint.y])
    updateCubicBezierPath()
  })

  // 控制点2的拖动事件
  // 顶点的倾斜角列表
  const rect2Atan2EdgeList = getRectAtan2EdgeList(rect2)
  point2.on('dragmove', () => {
    // 中心点
    const rect2CenterPoint = getRectCenterPoint(rect2)
    // 控制点的倾斜角
    const deg = radToDeg(
      Math.atan2(
        point2.y() - rect2CenterPoint.y,
        point2.x() - rect2CenterPoint.x
      )
    )
    // 所在方向
    const dir = getDegDir(deg, rect2Atan2EdgeList)
    // 所在方向的比例
    const ratio = getDegRatio(deg, dir, rect2Atan2EdgeList)
    // 计算连接点坐标
    line2StartPoint = getPointBy(rect2, dir, ratio)
    // 更新连线
    line2.points([point2.x(), point2.y(), line2StartPoint.x, line2StartPoint.y])
    updateCubicBezierPath()
  })
}

// 更新贝塞尔曲线
const updateCubicBezierPath = () => {
  const path = joinCubicBezierPath(
    line1StartPoint,
    line2StartPoint,
    {
      x: point1.x(),
      y: point1.y()
    },
    {
      x: point2.x(),
      y: point2.y()
    }
  )
  line.data(path)
}

onMounted(() => {
  init()
  renderRects()
  createLine()
  bindEvent()
})
</script>

<style>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.toolbar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 50px;
  display: flex;
}

.toolbar .item {
  display: flex;
  align-items: center;
  margin: 0 10px;
}

.toolbar .item .name {
  font-size: 14px;
  color: #666;
}
</style>
