<!--
 * @Author: Spearhead
 * @Date: 2023-01-05 17:39:11
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-05 18:01:27
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
//添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(200, 200, 200); //设置光的位置
// scene.add(directionalLight); //把平行光添加进场景
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

const controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
controls.addEventListener('change', () => {
  renderer.render(scene, camera); //监听鼠标，键盘事件
});

//创建管道成型的路径(3D样条曲线)
var path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, -50, -50),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(8, 50, 50),
  new THREE.Vector3(-5, 0, 100),
]);
// path:路径   40：沿着轨迹细分数  10：管道半径   25：管道截面圆细分数
var geometry = new THREE.TubeGeometry(path, 40, 10, 25);
const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const tube = new THREE.Mesh(geometry, material);
scene.add(tube);

// 创建多段线条的顶点数据
var p1 = new THREE.Vector3(-85.35, -35.36);
var p2 = new THREE.Vector3(-50, 0, 0);
var p3 = new THREE.Vector3(0, 50, 0);
var p4 = new THREE.Vector3(50, 0, 0);
var p5 = new THREE.Vector3(85.35, -35.36);
// 创建线条一：直线
let line1 = new THREE.LineCurve3(p1, p2);
// 重建线条2：三维样条曲线
var curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
// 创建线条3：直线
let line2 = new THREE.LineCurve3(p4, p5);
let CurvePath = new THREE.CurvePath(); // 创建CurvePath对象
CurvePath.curves.push(line1, curve, line2); // 插入多段线条
//通过多段曲线路径创建生成管道
//通过多段曲线路径创建生成管道，CCurvePath：管道路径
//   @ts-ignore
var geometry2 = new THREE.TubeGeometry(CurvePath, 100, 5, 25, false);
const tube2 = new THREE.Mesh(geometry2, material);
scene.add(tube2);

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
