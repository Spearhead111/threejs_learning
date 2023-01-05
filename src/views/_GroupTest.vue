<!--
 * @Author: Spearhead
 * @Date: 2023-01-05 16:28:37
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-05 17:36:51
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
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const axesHelper = new THREE.AxesHelper(100); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);
// 头部网格模型和组
var headMesh = sphereMesh(10, 0, 0, 0);
headMesh.name = '脑壳';
var leftEyeMesh = sphereMesh(1, 8, 5, 4);
leftEyeMesh.name = '左眼';
var rightEyeMesh = sphereMesh(1, 8, 5, -4);
rightEyeMesh.name = '右眼';
var headGroup = new THREE.Group();
headGroup.name = '头部';
headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);
// 身体网格模型和组
var neckMesh = cylinderMesh(3, 10, 0, -15, 0);
neckMesh.name = '脖子';
var bodyMesh = cylinderMesh(14, 30, 0, -35, 0);
bodyMesh.name = '腹部';
var leftLegMesh = cylinderMesh(4, 60, 0, -80, -7);
leftLegMesh.name = '左腿';
var rightLegMesh = cylinderMesh(4, 60, 0, -80, 7);
rightLegMesh.name = '右腿';
var legGroup = new THREE.Group();
legGroup.name = '腿';
legGroup.add(leftLegMesh, rightLegMesh);
var bodyGroup = new THREE.Group();
bodyGroup.name = '身体';
bodyGroup.add(neckMesh, bodyMesh, legGroup);
// 人Group
var personGroup = new THREE.Group();
personGroup.name = '人';
personGroup.add(headGroup, bodyGroup);
personGroup.translateY(50);
scene.add(personGroup);

var geometry1 = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
// 三维样条曲线  Catmull-Rom算法
var curve1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-50, 20, 90),
  new THREE.Vector3(-10, 40, 40),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(60, -60, 0),
  new THREE.Vector3(70, 0, 80),
]);
//getPoints是基类Curve的方法，返回一个vector3对象作为元素组成的数组
var points = curve1.getPoints(200); //分段数100，返回101个顶点
// setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
geometry1.setFromPoints(points);
//材质对象
var material1 = new THREE.LineBasicMaterial({
  color: 0x000000,
});
//线条模型对象
var line = new THREE.Line(geometry1, material1);
scene.add(line); //线条对象添加到场景中

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
const controls = new OrbitControls(camera, renderer.domElement); //创建控件对象
controls.addEventListener('change', () => {
  renderer.render(scene, camera); //监听鼠标，键盘事件
});
renderer.render(scene, camera);

// 球体网格模型创建函数
function sphereMesh(R: number, x: number, y: number, z: number) {
  var geometry = new THREE.SphereGeometry(R, 25, 25); //球体几何体
  var material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
  }); //材质对象Material
  var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
  mesh.position.set(x, y, z);
  return mesh;
}
// 圆柱体网格模型创建函数
function cylinderMesh(R: number, h: number, x: number, y: number, z: number) {
  var geometry = new THREE.CylinderGeometry(R, R, h, 25, 25); //球体几何体
  var material = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
  }); //材质对象Material
  var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
  mesh.position.set(x, y, z);
  return mesh;
}
// 递归遍历方法.traverse()
scene.traverse(function (obj: any) {
  if (obj.type === 'Group') {
    console.log(obj.name);
  }
  if (obj.type === 'Mesh') {
    console.log('  ' + obj.name);
    obj.material.color.set(0xffff00);
  }
  if (obj.name === '左眼' || obj.name === '右眼') {
    obj.material.color.set(0x000000);
  }
  // 打印id属性
  console.log(obj.id);
  // 打印该对象的父对象
  console.log(obj.parent);
  // 打印该对象的子对象
  console.log(obj.children);
  console.log('#######################');
});
onMounted(() => {
  document.getElementById('three')?.appendChild(renderer.domElement);
});
</script>

<style lang="less" scoped></style>
