<!--
 * @Author: Spearhead
 * @Date: 2023-01-06 15:57:27
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-06 17:07:43
-->
<template>
  <div id="my-three"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';

//创建一个三维场景
const scene = new THREE.Scene();
//创建一个透视相机，窗口宽度，窗口高度
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(60, width / height, 10, 5000);
//设置相机位置
camera.position.set(292, 109, 268);
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(200); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);
//点光源
const pointlLight = new THREE.PointLight(0xffffff);
pointlLight.position.set(200, 300, 200); //设置光的位置
scene.add(pointlLight);
// 环境光
const ambient = new THREE.AmbientLight(0x444444, 0.4);
scene.add(ambient);
//创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height); //设置渲染区尺寸

/**
 * 精灵创建下雨效果
 */
// 加载雨滴理贴图
const rainTexture = new THREE.TextureLoader().load('rain.png');
// 创建一个组表示所有的雨滴
var group = new THREE.Group();
// 批量创建表示雨滴的精灵模型
for (let i = 0; i < 400; i++) {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: rainTexture, //设置精灵纹理贴图
  });
  // 创建精灵模型对象
  const sprite = new THREE.Sprite(spriteMaterial);
  // 控制精灵大小,
  sprite.scale.set(8, 10, 1); // 只需要设置x、y两个分量就可以
  const k1 = Math.random() - 0.5;
  const k2 = Math.random() - 0.5;
  const k3 = Math.random() - 0.5;
  // 设置精灵模型位置，在整个空间上上随机分布
  sprite.position.set(1000 * k1, 300 * Math.random(), 1000 * k2);
  group.add(sprite);
}
scene.add(group);

// 渲染函数
function render() {
  // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
  // 每次渲染都会更新雨滴的位置，进而产生动画效果
  group.children.forEach((sprite) => {
    // 雨滴的y坐标每次减1
    sprite.position.y -= 1;
    if (sprite.position.y < 0) {
      // 如果雨滴落到地面，重置y，从新下落
      sprite.position.y = 200;
    }
  });
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();
const controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
controls.addEventListener('change', () => {
  renderer.render(scene, camera); //监听鼠标，键盘事件
});
renderer.render(scene, camera); //执行渲染操作、指定场景、相机作为参数

onMounted(() => {
  document.getElementById('my-three')?.appendChild(renderer.domElement);
});
</script>

<style lang="less" scoped>
#my-three {
  overflow: hidden;
}
</style>
