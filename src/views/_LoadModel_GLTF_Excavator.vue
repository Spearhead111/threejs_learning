<!--
 * @Author: Spearhead
 * @Date: 2023-01-11 10:56:45
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-11 11:23:55
-->
<template>
  <div id="my-three"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { onMounted } from 'vue';

//创建一个三维场景
const scene = new THREE.Scene();
//创建一个透视相机，窗口宽度，窗口高度
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
//设置相机位置
camera.position.set(10, 10, 10);
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(10); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);
//点光源
const pointlLight = new THREE.PointLight(0xffffff);
pointlLight.position.set(200, 300, 200); //设置光的位置
scene.add(pointlLight);
// 环境光
const ambient = new THREE.AmbientLight(0x444444, 1);
scene.add(ambient);
//创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height); //设置渲染区尺寸

/*
  write here
*/
const loader = new GLTFLoader();
let excavator: GLTF;
loader.load('_工程车01.gltf', (gltf: GLTF) => {
  excavator = gltf;
  scene.add(excavator.scene);
  renderer.render(scene, camera); //执行渲染操作、指定场景、相机作为参数
});

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const render = () => {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  //clock.getDelta()方法获得两帧的时间间隔
  if (excavator) {
    excavator.scene.position.z += 0.01;
  }
};
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
