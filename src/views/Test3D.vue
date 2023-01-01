<!--
 * @Author: Spearhead
 * @Date: 2022-12-31 21:42:12
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-01 16:23:59
-->
<template>
  <button @click="addScene">添加</button>
  <button @click="removeScene()">清除</button>
  <div id="my-three"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { onBeforeUnmount } from 'vue';

let scene: any; // 三维场景
let camera: any; // 透视相机
let mesh: any; // 网格模型对象
let mesh2: any;
let ambient: any; // 环境光源
let light: any; // 点光源
let renderer: any; // WebGL渲染器
let controls: any; // 轨道控制器
let axesHelper: any; // 辅助坐标轴
let width = 1000,
  height = 500;
let raycaster: any;
let doAnimation = false; // 是否进行animate

// 初始化scene
const initScene = () => {
  //创建一个三维场景
  scene = new THREE.Scene();

  //创建一个物体（形状）
  const geometry = new THREE.BoxGeometry(100, 100, 100); //长宽高都是100的立方体
  // const geometry = new THREE.SphereGeometry(60,40,40);//半径是60的圆
  //widthSegments, heightSegments：水平方向和垂直方向上分段数。widthSegments最小值为3，默认值为8。heightSegments最小值为2，默认值为6。
  //创建材质（外观）
  const material = new THREE.MeshLambertMaterial({
    color: 0x0000ff, //设置材质颜色(蓝色)
    // color: 0x00ff00, //(绿色)
    transparent: true, //开启透明度
    opacity: 0.5, //设置透明度
  });
  //创建一个网格模型对象
  mesh = new THREE.Mesh(geometry, material); //网络模型对象Mesh
  //把网格模型添加到三维场景
  scene.add(mesh); //网络模型添加到场景中
  // 添加多个模型（添加圆形）
  const geometry2 = new THREE.SphereGeometry(60, 40, 40);
  const material2 = new THREE.MeshLambertMaterial({
    color: 0xffff00,
  });
  mesh2 = new THREE.Mesh(geometry2, material2); //网格模型对象Mesh
  // mesh3.translateX(120); //球体网格模型沿Y轴正方向平移120
  mesh2.position.set(120, 0, 0); //设置mesh3模型对象的xyz坐标为120,0,0
  scene.add(mesh2);
  //添加光源 //会照亮场景里的全部物体（氛围灯），前提是物体是可以接受灯光的，这种灯是无方向的，即不会有阴影。
  ambient = new THREE.AmbientLight(0xffffff, 0.4);
  light = new THREE.PointLight(0xffffff, 1); //点光源，color:灯光颜色，intensity:光照强度
  light.position.set(120, 0, 400); // 设置点光源位置
  scene.add(ambient);
  scene.add(light);
  //创建一个透视相机，窗口宽度，窗口高度
  // const width = window.innerWidth,
  //   height = window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, width / height, 10, 5000);
  //设置相机位置
  camera.position.set(300, 300, 300);
  //设置相机方向
  camera.lookAt(0, 0, 0);
  // camera.up设置相机以哪个方向为上方向,默认y轴为上方向(帮助我自己理解:设置了controls后鼠标垂直上下移动时候'在上面'的方向)
  // camera.up.x = 0;
  // camera.up.y = 1;
  // camera.up.z = 0;
  //创建辅助坐标轴
  axesHelper = new THREE.AxesHelper(1000); //参数200标示坐标系大小，可以根据场景大小去设置
  scene.add(axesHelper);
  //创建一个WebGL渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); //设置渲染区尺寸
  renderer.render(scene, camera); //执行渲染操作、指定场景、相机作为参数
  //创建控件对象
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => {
    renderer.render(scene, camera); //监听鼠标，键盘事件
  });
};

// 添加renderer的domElement
const appendRenderDomElement = () => {
  renderer.domElement && document.getElementById('my-three')?.appendChild(renderer.domElement);
};

// 添加click事件
const addClickEvent = () => {
  document.getElementById('my-three')?.addEventListener('click', clickEvent);
};
// 移除click事件
const removeClickEvent = () => {
  document.getElementById('my-three')?.removeEventListener('click', clickEvent);
};

// 点击事件
const clickEvent = () => {
  const event: any = window.event;
  //获取在射线上的接触点
  //获取鼠标坐标
  let mouse = new THREE.Vector2();
  raycaster = new THREE.Raycaster();
  // 注意这里的xy,如果是渲染在整个页面用clientXY,如果渲染在容器里建议用offsetXY,不然会有偏差
  mouse.x = (event.offsetX / width) * 2 - 1;
  mouse.y = -(event.offsetY / height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  if (intersects && intersects.length > 0) {
    outlineObj([intersects[0].object]);
  }
};

let renderPass: any;
let outlinePass: any;
let composer: any;

//高亮显示模型（呼吸灯）
const outlineObj = (selectedObjects: any): void => {
  // 创建一个EffectComposer（效果组合器）对象，然后在该对象上添加后期处理通道。
  composer = new EffectComposer(renderer);
  // 新建一个场景通道  为了覆盖到原理来的场景上
  renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  // 物体边缘发光通道
  outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera, selectedObjects);
  outlinePass.selectedObjects = selectedObjects;
  outlinePass.edgeStrength = 8.0; // 边框的亮度
  outlinePass.edgeGlow = 2; // 光晕[0,1]
  outlinePass.usePatternTexture = false; // 是否使用父级的材质
  outlinePass.edgeThickness = 0.5; // 边框宽度
  outlinePass.downSampleRatio = 1; // 边框弯曲度
  outlinePass.pulsePeriod = 10; // 呼吸闪烁的速度
  outlinePass.visibleEdgeColor.set(new THREE.Color(255, 255, 255)); // 呼吸显示的颜色
  outlinePass.hiddenEdgeColor = new THREE.Color(0, 0, 0); // 呼吸消失的颜色
  outlinePass.clear = true;
  composer.addPass(outlinePass);
  // 自定义的着色器通道 作为参数
  let effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height);
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);
};

//渲染场景
let animate = () => {
  if (doAnimation) {
    requestAnimationFrame(animate);
    //渲染外发光
    renderer.render(scene, camera);
    if (composer) {
      composer.render();
    }
  }
};

// 添加scene
const addScene = () => {
  if (document.getElementById('my-three')?.childElementCount == 0) {
    doAnimation = true;
    // 初始化scene
    initScene();
    // 添加renderer的domElement
    appendRenderDomElement();
    // 添加点击事件
    addClickEvent();

    animate();
  }
};

// 清除场景
const removeScene = () => {
  removeClickEvent();
  // 停止animate渲染
  doAnimation = false;
  releaseRender(renderer, scene);
  composer = null;
  renderer = null;
  scene = null;
  console.log(composer);
  console.log(renderer);
  console.log(scene);
  console.log(camera);
  console.log(mesh);
  console.log(ambient);
  console.log(light);
  console.log(axesHelper);
  console.log(controls);
  console.log(raycaster);
};

// 清除render
const releaseRender = (renderer: any, scene: any) => {
  if (!renderer || !scene || document.getElementById('my-three')?.childElementCount == 0) {
    return;
  }

  document.getElementById('my-three')?.removeChild(renderer.domElement);
  let clearScene = function (scene: any) {
    let arr = scene.children.filter((x: any) => x);
    arr.forEach((item: any) => {
      if (item.children.length) {
        clearScene(item);
      } else {
        if (item.type === 'Mesh') {
          item.geometry.dispose();
          item.material.dispose();
          !!item.clear && item.clear();
        }
      }
    });
    !!scene.clear && scene.clear(renderer);
    arr = null;
  };

  try {
    clearScene(scene);
  } catch (e) {
    console.log(e);
  }

  try {
    renderer.renderLists.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement = null;
    renderer.content = null;
    renderer = null;
  } catch (e) {
    console.log(e);
  }

  THREE.Cache.clear();
};

onBeforeUnmount(() => {
  console.log('准备组件卸载前清除缓存和节点');
  removeScene();
});
</script>

<style lang="less" scoped></style>
