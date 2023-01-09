<!--
 * @Author: Spearhead
 * @Date: 2023-01-09 10:51:03
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-09 10:56:39
-->
<template>
  <div id="my-three"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted } from 'vue';

// 创建一个三维场景
const scene = new THREE.Scene();
// 创建一个透视相机，窗口宽度，窗口高度
const width = window.innerWidth,
  height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, width / height, 10, 5000);
// 设置相机位置
camera.position.set(150, 150, 150);
// 创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(200); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);
// 点光源
const pointlLight = new THREE.PointLight(0xffffff);
pointlLight.position.set(200, 300, 200); //设置光的位置
scene.add(pointlLight);
// 环境光
const ambient = new THREE.AmbientLight(0x444444, 0.4);
scene.add(ambient);
// 创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height); //设置渲染区尺寸

const bone1 = new THREE.Bone();
const bone2 = new THREE.Bone();
const bone3 = new THREE.Bone();
// 设置关节父子关系   多个骨头关节构成一个树结构
bone1.add(bone2);
bone2.add(bone3);
// 设置关节之间的相对位置
// 根关节Bone1默认位置是(0,0,0)
bone2.position.y = 60; //Bone2相对父对象Bone1位置
bone3.position.y = 40; //Bone3相对父对象Bone2位置
// 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
const skeleton = new THREE.Skeleton([bone1, bone2, bone3]); //创建骨骼系统
// 查看.bones属性中所有骨关节Bone
console.log(skeleton.bones);
// 返回所有关节的世界坐标
skeleton.bones.forEach((elem) => {
  console.log(elem.getWorldPosition(new THREE.Vector3()));
});

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
