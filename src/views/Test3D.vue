<!--
 * @Author: Spearhead
 * @Date: 2022-12-31 21:42:12
 * @LastEditors: Spearhead
 * @LastEditTime: 2023-01-03 17:55:37
-->
<template>
  <div class="control">
    <button @click="addScene">添加</button>
    <button @click="removeScene">清除</button>
  </div>
  <div id="my-three"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import Stats from 'stats.js';
import gsap from 'gsap';
import * as dat from 'dat.gui';

let scene: any; // 三维场景
let camera: any; // 透视相机
let mesh: THREE.Mesh; // 网格模型对象
let mesh2: THREE.Mesh;
let ambient: any; // 环境光源
let light: any; // 点光源
let renderer: THREE.WebGLRenderer; // WebGL渲染器
let controls: any; // 轨道控制器
let axesHelper: any; // 辅助坐标轴
let width = window.innerWidth,
  height = window.innerHeight;
let raycaster: any;
let doAnimation = false; // 是否进行animate
let stats: any; // 性能控件
let renderPass: any; // 场景通道
let outlinePass: any; // 物体边缘发光通道
let composer: any; // EffectComposer（效果组合器）对象
const clock = new THREE.Clock();
let gui: dat.GUI;

// 初始化scene
const initScene = () => {
  //创建一个三维场景
  scene = new THREE.Scene();
  //创建一个透视相机
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
  mesh2.position.set(120, 0, 0); //设置mesh3模型对象的xyz坐标为120,0,0
  scene.add(mesh2);
  //添加光源 //会照亮场景里的全部物体（氛围灯），前提是物体是可以接受灯光的，这种灯是无方向的，即不会有阴影。
  ambient = new THREE.AmbientLight(0xffffff, 0.4);
  light = new THREE.PointLight(0xffffff, 1); //点光源，color:灯光颜色，intensity:光照强度
  light.position.set(120, 0, 400); // 设置点光源位置
  scene.add(ambient);
  scene.add(light);
  // 创建一个WebGL渲染器
  // renderer = new THREE.WebGLRenderer();
  // 设置渲染器的透明度实现背景
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearAlpha(0.2); // 设置alpha的值，范围在0 - 1.0之间
  renderer.setSize(width, height); //设置渲染区尺寸
  renderer.render(scene, camera); //执行渲染操作、指定场景、相机作为参数
  //创建控件对象
  controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼,让控制器更有真实效果
  controls.enableDamping = true;
  controls.addEventListener('change', () => {
    renderer.render(scene, camera); //监听鼠标，键盘事件
  });
  appendRenderDomElement();
};

// 初始化stats性能控件
const initStats = () => {
  stats = new Stats();
  //设置统计模式
  stats.setMode(0); // 0: fps, 1: ms
  //统计信息显示在左上角
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  //将统计对象添加到对应的<div>元素中
  stats.domElement && document.getElementById('my-three')?.appendChild(stats.domElement);
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

// 添加window的resize事件
const addWindowResizeEvent = () => {
  window.addEventListener('resize', onWindowResize);
};

// 移除window的resize事件
const removeWindowResizeEvent = () => {
  window.removeEventListener('resize', onWindowResize);
};

// 添加双击进入/取消全屏
const addFullScreenEvent = () => {
  window.addEventListener('dblclick', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      renderer.domElement?.requestFullscreen();
    }
  });
};
//  页面大小改变回调,根据页面的大小更新更新渲染
const onWindowResize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  // 更新相机
  camera.aspect = width / height;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器尺寸大小
  renderer.setSize(width, height);
  // 设置渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // // css2d渲染器更新
  // scene.cssRender.setSize(width, height);
  // // css3d渲染器更新
  // scene.css3DRender.setSize(width, height);
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
  outlinePass.edgeStrength = 8.0; // 边框的亮度，最大10
  outlinePass.edgeGlow = 0.8; // 光晕[0,1]//,最大1
  outlinePass.usePatternTexture = false; // 是否使用父级的材质
  outlinePass.edgeThickness = 2; // 边框宽度,最大4
  outlinePass.downSampleRatio = 1; // 边框弯曲度
  outlinePass.pulsePeriod = 1; // 呼吸闪烁的速度
  outlinePass.visibleEdgeColor.set(new THREE.Color(0, 0, 255)); // 呼吸显示的颜色
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
    // // 获取时间间隔
    // const deltaTime = clock.getDelta();
    // // 设置移动
    // mesh.position.x += deltaTime * 20;

    renderer.render(scene, camera);
    controls && controls.update();
    stats && stats.update();
    composer && composer.render();
    requestAnimationFrame(animate);
  }
};

// 添加scene
const addScene = () => {
  if (document.getElementById('my-three')?.childElementCount == 0) {
    doAnimation = true;
    // 初始化scene
    initScene();
    // 初始化status
    initStats();
    // 添加点击事件
    addClickEvent();
    // 添加window的resize函数
    addWindowResizeEvent();
    // // 添加双击全屏事件
    // addFullScreenEvent();
    // // 利用gsap来设置mesh1的移动
    // const meshAnimateX = gsap.to(mesh.position, {{}
    //   x: 400,
    //   // y: 200,
    //   duration: 4,
    //   ease: 'power1.inOut',
    //   // 重复次数,-1表示无限循环
    //   repeat: -1,
    //   // 往返运动
    //   yoyo: true,
    //   // 延时运动
    //   delay: 0,
    //   onStart: () => {
    //     console.log('动画开始');
    //   },
    //   onComplete: () => {
    //     console.log('动画结束');
    //   },
    // });
    // // 添加双击暂停时间
    // document.getElementById('my-three')?.addEventListener('dblclick', () => {
    //   meshAnimateX.isActive() ? meshAnimateX.pause() : meshAnimateX.resume();
    // });
    // // gsap.to(mesh.rotation, { x: Math.PI, duration: 2 });
    // 添加dat的gui控件
    gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '0';
    gui.domElement.style.right = '200px';
    gui
      .add(mesh2.position, 'x')
      .min(120)
      .max(300)
      .step(1)
      .name('mesh2的x')
      .onChange(() => {
        console.log(mesh2.position);
      })
      .onFinishChange(() => {
        console.log('完成修改');
      });
    // 修改物体颜色
    const params = {
      color: '#ffff00',
      fn: () => {
        gsap.to(mesh2.position, { y: 100, duration: 2, yoyo: true, repeat: -1 });
      },
    };
    gui.addColor(params, 'color').onChange((value) => {
      //   @ts-ignore
      mesh2.material.color.set(value);
    });
    gui.add(mesh2, 'visible').name('是否显示');
    // 点击触发某个事件
    gui.add(params, 'fn').name('球运动');
    //
    const folder = gui.addFolder('设置立方体');
    folder.add(mesh2.material, 'wireframe').name('mesh2的网格展示');
    folder.add(mesh.material, 'wireframe').name('mesh的网格展示');

    animate();
  }
};

// 移除场景
const removeScene = () => {
  removeClickEvent();
  removeWindowResizeEvent();
  // 停止animate渲染
  doAnimation = false;
  releaseRender(renderer, scene);
  composer = null;
  // renderer = null;
  scene = null;
  // 移除dat的gui控件
  gui && gui.domElement?.parentNode && gui.destroy();
};

// 清除render
const releaseRender = (renderer: any, scene: any) => {
  if (!renderer || !scene || document.getElementById('my-three')?.childElementCount == 0) {
    return;
  }
  renderer.domElement && document.getElementById('my-three')?.removeChild(renderer.domElement);
  stats?.domElement && document.getElementById('my-three')?.removeChild(stats.domElement);
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

<style lang="less" scoped>
.control {
  position: absolute;
  z-index: 1;
  right: 10px;
  top: 10px;
  button {
    margin-left: 10px;
  }
}

#my-three {
  position: relative;
  overflow: hidden;
  background: url('../assets/star2.jpeg');
  background-size: cover;
}
</style>
