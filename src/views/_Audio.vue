<!--
 * @Author: Spearhead
 * @Date: 2023-01-10 11:38:49
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-10 14:17:37
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

/*
  背景音乐
*/
// 非位置音频可用于不考虑位置的背景音乐
// 创建一个监听者
const listener = new THREE.AudioListener();
// camera.add( listener );
// 创建一个非位置音频对象  用来控制播放
const audio = new THREE.Audio(listener);
// 创建一个音频加载器对象
const audioLoader = new THREE.AudioLoader();
// 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
audioLoader.load('周杰伦-借口.flac', function (AudioBuffer) {
  // console.log(AudioBuffer)
  // 音频缓冲区对象关联到音频对象audio
  audio.setBuffer(AudioBuffer);
  audio.setLoop(true); //是否循环
  audio.setVolume(0.5); //音量
  // 播放缓冲区中的音频数据
  audio.play(); //play播放、stop停止、pause暂停
});

/*
  定点音频，随距离和移动改变音量等
*/
/* const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.PointsMaterial();
// 用来定位音源的网格模型
const audioMesh = new THREE.Mesh(geometry, material);
// 设置网格模型的位置，相当于设置音源的位置
audioMesh.position.set(200, 200, 200);
scene.add(audioMesh);

// 创建一个虚拟的监听者
const listener = new THREE.AudioListener();
// 监听者绑定到相机对象
camera.add(listener);
// 创建一个位置音频对象,监听者作为参数,音频和监听者关联。
const PosAudio = new THREE.PositionalAudio(listener);
//音源绑定到一个网格模型上
audioMesh.add(PosAudio);
// 创建一个音频加载器
const audioLoader = new THREE.AudioLoader();
// 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
audioLoader.load('周杰伦-借口.flac', function (AudioBuffer) {
  console.log(AudioBuffer);
  // 音频缓冲区对象关联到音频对象audio
  PosAudio.setBuffer(AudioBuffer);
  PosAudio.setVolume(0.5); //音量
  PosAudio.setRefDistance(200); //参数值越大,声音越大
  PosAudio.play(); //播放
}); */

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
