<!--
 * @Author: Spearhead
 * @Date: 2023-01-10 14:37:50
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-10 15:18:30
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
camera.position.set(0, 0, 800);
//创建辅助坐标轴
const axesHelper = new THREE.AxesHelper(); //参数200标示坐标系大小，可以根据场景大小去设置
scene.add(axesHelper);
//点光源
const pointlLight = new THREE.PointLight(0xffffff);
pointlLight.position.set(0, 0, 1000); //设置光的位置
scene.add(pointlLight);
// 环境光
const ambient = new THREE.AmbientLight(0x444444, 0.4);
scene.add(ambient);
//创建一个WebGL渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(width, height); //设置渲染区尺寸

/* start创建放置音频的mesh */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.PointsMaterial();
// 用来定位音源的网格模型
const audioMesh = new THREE.Mesh(geometry, material);
// 设置网格模型的位置，相当于设置音源的位置
audioMesh.position.set(200, 200, 200);
scene.add(audioMesh);
/* end */

/**
 * start创建多个网格模型组成的组对象
 */
var group = new THREE.Group();
let N = 128; //控制音频分析器返回频率数据数量
for (let i = 0; i < N / 2; i++) {
  var box = new THREE.BoxGeometry(10, 100, 10); //创建一个立方体几何对象
  var material1 = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
  }); //材质对象
  var mesh = new THREE.Mesh(box, material1); //网格模型对象
  // 长方体间隔20，整体居中
  mesh.position.set(20 * i - (N / 2) * 10, 0, 0);
  group.add(mesh);
}
scene.add(group);
/* end */

var analyser: any = null; // 声明一个分析器变量
// 渲染函数
function render() {
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  if (analyser) {
    // 获得频率数据N个
    var arr = analyser.getFrequencyData();
    // console.log(arr);
    // 遍历组对象，每个网格子对象设置一个对应的频率数据
    group.children.forEach((elem: any, index) => {
      elem.scale.y = arr[index] / 80;
      elem.material.color.r = arr[index] / 200;
    });
  }
}
render();

var listener = new THREE.AudioListener(); //监听者
var audio = new THREE.Audio(listener); //非位置音频对象
var audioLoader = new THREE.AudioLoader(); //音频加载器
// 加载音频文件
audioLoader.load('周杰伦-借口.mp3', (AudioBuffer) => {
  audio.setBuffer(AudioBuffer); // 音频缓冲区对象关联到音频对象audio
  audio.setLoop(true); //是否循环
  audio.setVolume(0.5); //音量
  audio.play(); //播放
  // 音频分析器和音频绑定，可以实时采集音频时域数据进行快速傅里叶变换
  analyser = new THREE.AudioAnalyser(audio, 2 * N);
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
