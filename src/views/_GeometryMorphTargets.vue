<!--
 * @Author: Spearhead
 * @Date: 2023-01-10 09:25:22
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-10 10:57:42
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
 * 创建网格模型，并给模型的几何体设置多个变形目标
 */
// 创建一个几何体具有8个顶点
const geometry = new THREE.BoxGeometry(50, 50, 50); //立方体几何对象
// 为geometry提供变形目标的数据
const box1 = new THREE.BoxGeometry(100, 5, 100); //为变形目标1提供数据
const box2 = new THREE.BoxGeometry(5, 200, 5); //为变形目标2提供数据
// 设置变形目标的数据
// Geometry已经弃用，现在用BufferGeometry，BufferGeometry的morphAttributes写法不同了:
geometry.morphAttributes.position = [box1.attributes.position, box2.attributes.position];
console.log(geometry);

const material = new THREE.MeshLambertMaterial({
  // morphTargets: true, //允许变形 (现在不需要特别设置了，改属性已经删除了？)
  color: 0x0000ff,
}); //材质对象
const mesh = new THREE.Mesh(geometry, material); //网格模型对象
// 新建一个和mesh一样的mesh2作为参考
const mesh2 = new THREE.Mesh(geometry, material); //网格模型对象
mesh2.position.set(50, 0, 0);
scene.add(mesh); //网格模型添加到场景中
scene.add(mesh2);
console.log(mesh);

// 启用变形目标并设置变形目标影响权重，范围一般0~1,
// 设置第一组顶点对几何体形状影响的变形系数
// mesh.morphTargetInfluences![0] = 0.5;
// 设置第二组顶点对几何体形状影响的变形系数
// mesh.morphTargetInfluences![1] = 1;

/**
 * 设置关键帧数据
 */
// 利用关键帧动态改变变形目标影响权重，达到动画帧动画的效果
const Track1 = new THREE.KeyframeTrack('.morphTargetInfluences[0]', [0, 10, 20], [0, 1, 0]);
// 设置变形目标2对应权重随着时间的变化
const Track2 = new THREE.KeyframeTrack('.morphTargetInfluences[1]', [20, 30, 40], [0, 1, 0]);
// 创建一个剪辑clip对象，命名"default"，持续时间40
const clip = new THREE.AnimationClip('default', 40, [Track1, Track2]);

/**
 * 播放编辑好的关键帧数据
 */
const mixer = new THREE.AnimationMixer(mesh); //创建混合器
const AnimationAction = mixer.clipAction(clip); //返回动画操作对象
AnimationAction.timeScale = 5; //默认1，可以调节播放速度
// AnimationAction.loop = THREE.LoopOnce; //不循环播放
AnimationAction.clampWhenFinished = true; //暂停在最后一帧播放的状态
AnimationAction.play(); //开始播放
// 创建一个时钟对象Clock
const clock = new THREE.Clock();
// 渲染函数
function render() {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧

  //clock.getDelta()方法获得两帧的时间间隔
  // 更新混合器相关的时间
  mixer.update(clock.getDelta());
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
