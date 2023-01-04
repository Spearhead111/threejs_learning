<!--
 * @Author: Spearhead
 * @Date: 2023-01-04 10:26:47
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-04 15:53:36
-->
<template>
  <div id="three"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(100, 100, 100);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const axesHelper = new THREE.AxesHelper(100); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);

var geometry = new THREE.SphereGeometry(100, 25, 25); //创建一个球体几何对象
// 创建一个点材质对象
var material = new THREE.PointsMaterial({
  color: 0x0000ff, //颜色
  size: 5, //点渲染尺寸
});
//点模型对象  参数：几何体  点材质
var point = new THREE.Points(geometry, material);
scene.add(point); //网格模型添加到场景中
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼,让控制器更有真实效果
controls.enableDamping = true;
renderer.render(scene, camera);

const animate = () => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
};
animate();

onMounted(() => {
  document.getElementById('three')?.appendChild(renderer.domElement);
});
</script>

<style lang="less" scoped></style>
