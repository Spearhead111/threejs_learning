<!--
 * @Author: Spearhead
 * @Date: 2023-01-05 18:00:57
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-05 18:17:02
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
const camera = new THREE.PerspectiveCamera(45, width / height, 10, 5000);
//设置相机位置
camera.position.set(150, 150, 150);
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
 * 创建旋转网格模型
 */
var points = [new THREE.Vector2(50, 60), new THREE.Vector2(25, 0), new THREE.Vector2(50, -60)];
var geometry = new THREE.LatheGeometry(points, 30);
var material = new THREE.MeshPhongMaterial({
  color: 0x0000ff, //三角面颜色
  side: THREE.DoubleSide, //两面可见
}); //材质对象
material.wireframe = true; //线条模式渲染(查看细分数)
var mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
scene.add(mesh); //旋转网格模型添加到场景中

const controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
controls.addEventListener('change', () => {
  renderer.render(scene, camera); //监听鼠标，键盘事件
});

var shape = new THREE.Shape(); //创建Shape对象
shape.splineThru(points); //顶点带入样条插值计算函数
var splinePoints = shape.getPoints(20); //插值计算细分数20
var geometry2 = new THREE.LatheGeometry(splinePoints, 30); //旋转造型
const mesh2 = new THREE.Mesh(geometry2, material);
scene.add(mesh2);

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
