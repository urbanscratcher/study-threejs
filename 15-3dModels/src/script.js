import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

//Scene
const scene = new THREE.Scene();

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
directionalLight.position.z = 2;
scene.add(ambientLight, directionalLight);

//Debugging
// const gui = new dat.GUI();

/*
//OBJLoader
const objLoader = new OBJLoader();

//Loading Model
objLoader.load("models/monkey.obj", (obj) => {
  scene.add(obj);
  // obj.position.y = 1;
  // obj.children[0].position.z = -3;
  // console.log(obj);
  console.log(obj.children[0].material);
  obj.children[0].material = new THREE.MeshNormalMaterial({ color: "red" });
  console.log(obj);
});
*/

//GLTFLoader
const gltfLoader = new GLTFLoader();

//DRACOLoader (loading compressed gltf)
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");
gltfLoader.setDRACOLoader(dracoLoader);

//FBXLoader
const fbxloader = new FBXLoader();

let animationMixer = null;
//Loading GLTF Model
gltfLoader.load("models/newModel.glb", (glb) => {
  animationMixer = new THREE.AnimationMixer(glb.scene);
  const clipAction = animationMixer.clipAction(glb.animations[3]);
  clipAction.play();
  // glb.scale.set(0.01, 0.01, 0.01);
  glb.scene.position.y = -0.8;
  scene.add(glb.scene);
  console.log(glb);
});

//Resizing
window.addEventListener("resize", () => {
  //Update Size
  aspect.width = window.innerWidth;
  aspect.height = window.innerHeight;

  //New Aspect Ratio
  camera.aspect = aspect.width / aspect.height;
  camera.updateProjectionMatrix();

  //New RendererSize
  renderer.setSize(aspect.width, aspect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor("#808080", 0.6);
renderer.setSize(aspect.width, aspect.height);

//OrbitControls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

//Clock Class
const clock = new THREE.Clock();
let prevTime = 0;

const animate = () => {
  //GetElapsedTime
  const elapsedTime = clock.getElapsedTime();
  const frameTime = elapsedTime - prevTime; //프레임 간 경과시간
  prevTime = elapsedTime;

  //Update AnimationMixer
  if (animationMixer) {
    animationMixer.update(frameTime);
  }

  //Update Controls
  // orbitControls.update();

  //Renderer
  renderer.render(scene, camera);

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();

// 1) Weight
// 2) Data Type
// 3) Compression
// 4) Copyright
// 5) etc...
