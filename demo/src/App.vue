<template>
  <div class="container" ref="container"></div>
  <div class="toolbar"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Konva from "konva";

const container = ref(null);

// 初始化图形
let layer = null,
  line;
export const init = (container, onDragMove) => {
  const { width, height } = container.value.getBoundingClientRect();

  // 创建舞台
  let stage = new Konva.Stage({
    container: container.value,
    width,
    height,
  });

  // 创建图层
  layer = new Konva.Layer();

  line = new Konva.Line({
    points: [],
    stroke: "#e6a23c",
    strokeWidth: 2,
    lineJoin: "round",
  });

  layer.add(line);

  // 创建两个矩形
  let rect1 = new Konva.Rect({
    x: 400,
    y: 200,
    width: 100,
    height: 100,
    fill: "#fbfbfb",
    stroke: "#f56c6c",
    strokeWidth: 4,
    draggable: true,
  });

  let rect2 = new Konva.Rect({
    x: 800,
    y: 600,
    width: 100,
    height: 100,
    fill: "#fbfbfb",
    stroke: "#409eff",
    strokeWidth: 4,
    draggable: true,
  });

  // 矩形添加到图层
  layer.add(rect1);

  layer.add(rect2);

  // 图层添加到舞台
  stage.add(layer);

  // 绘制
  layer.draw();

  return {
    rect1,
    rect2,
    line,
  };
};

onMounted(() => {
  let { rect1, rect2 } = init();
});
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
