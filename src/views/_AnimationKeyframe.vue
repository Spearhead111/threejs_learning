<!--
 * @Author: Spearhead
 * @Date: 2023-01-09 09:23:04
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-09 09:43:09
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
camera.position.set(100, 100, 100);
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

const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
const sphereGeometry = new THREE.SphereGeometry(10);
const mesh1 = new THREE.Mesh(boxGeometry, material);
const mesh2 = new THREE.Mesh(sphereGeometry, material);
mesh1.position.set(40, 0, 0);
const group = new THREE.Group();
group.add(mesh1, mesh2);
mesh1.name = 'Box';
mesh2.name = 'Sphere';
scene.add(group);

/**
 * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
 */
// 创建名为Box对象的关键帧数据
var times = [0, 10]; //关键帧时间数组，离散的时间点序列
var values = [0, 0, 0, 150, 0, 0]; //与时间点对应的值组成的数组
// 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
var posTrack = new THREE.KeyframeTrack('Box.position', times, values);
// 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
var colorKF = new THREE.KeyframeTrack('Box.material.color', [10, 20], [1, 0, 0, 0, 0, 1]);
// 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
var scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);

// duration决定了默认的播放时间，一般取所有帧动画的最大时间
// duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
var duration = 20;
// 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
var clip = new THREE.AnimationClip('default', duration, [posTrack, colorKF, scaleTrack]);

/**
 * 播放编辑好的关键帧数据
 */
// group作为混合器的参数，可以播放group中所有子对象的帧动画
var mixer = new THREE.AnimationMixer(group);
// 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
var AnimationAction = mixer.clipAction(clip);
//通过操作Action设置播放方式
AnimationAction.timeScale = 20; //默认1，可以调节播放速度
// AnimationAction.loop = THREE.LoopOnce; //不循环播放
AnimationAction.play(); //开始播放

// 创建一个时钟对象Clock
var clock = new THREE.Clock();
const render = () => {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  //clock.getDelta()方法获得两帧的时间间隔
  // 更新混合器相关的时间
  mixer.update(clock.getDelta());
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
