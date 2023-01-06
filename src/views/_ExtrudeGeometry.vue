<!--
 * @Author: Spearhead
 * @Date: 2023-01-06 11:40:57
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-06 15:26:51
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
 * 创建扫描网格模型
 */
var shape = new THREE.Shape();
/**四条直线绘制一个矩形轮廓*/
shape.moveTo(0, 0); //起点
shape.lineTo(0, 10); //第2点
shape.lineTo(10, 10); //第3点
shape.lineTo(10, 0); //第4点
shape.lineTo(0, 0); //第5点
/**创建轮廓的扫描轨迹(3D样条曲线)*/
var curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-10, -50, -50),
  new THREE.Vector3(10, 0, 0),
  new THREE.Vector3(8, 50, 50),
  new THREE.Vector3(-5, 0, 100),
]);
var geometry = new THREE.ExtrudeGeometry( //拉伸造型
  shape, //二维轮廓
  //拉伸参数
  {
    bevelEnabled: false, //无倒角
    extrudePath: curve, //选择扫描轨迹
    steps: 50, //扫描方向细分数
  }
);
const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
console.log(boxGeometry.attributes);

var material = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
}); //材质对象
var mesh = new THREE.Mesh(geometry, material); //点模型对象
scene.add(mesh); //点模型添加到场景中

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
