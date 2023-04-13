import "./style.css";
import * as THREE from "three";
import {
  MapControls,
  OrbitControls,
} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

//Scene
const scene = new THREE.Scene();

//Debugging
const gui = new dat.GUI();

const materialColor = {
  color: 0xffffff,
};

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 2, 2);
scene.add(ambientLight, pointLight);

//LoadingManager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("Start");
};
loadingManager.onLoad = () => {
  console.log("Loading . . .");
};
loadingManager.onProgress = () => {
  console.log("Progress");
};
loadingManager.onError = () => {
  console.log("Error");
};

//textureLoader
const textureLoader = new THREE.TextureLoader(loadingManager);
const colorTexture = textureLoader.load("texture/color.jpg");
const bumpTexture = textureLoader.load("texture/bump.jpg");
const displacementTexture = textureLoader.load("texture/displacementMap.jpg");
const normalTexture = textureLoader.load("texture/Normal.jpeg");
const matcapTexture = textureLoader.load("texture/mat2.png");

//cubeTextureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const envTexture = cubeTextureLoader.load([
  "/texture/env/px.png",
  "/texture/env/nx.png",
  "/texture/env/py.png",
  "/texture/env/ny.png",
  "/texture/env/pz.png",
  "/texture/env/nz.png",
]);
scene.background = envTexture;

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

//Mesh
// const geometry = new THREE.SphereBufferGeometry(0.5, 32, 32);
const geometry = new THREE.PlaneBufferGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });

// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshPhongMaterial();
// const material = new THREE.MeshToonMaterial();
// const material = new THREE.MeshStandardMaterial();

// material.map = colorTexture;
// material.wireframe = true;
// material.color = new THREE.Color("skyblue");
// material.transparent = true;
// material.opacity = 0.4;
// material.side = THREE.DoubleSide;
// material.visible = false;
// material.matcap = matcapTexture;
// material.shininess = 200;
// material.specular = new THREE.Color("green");
// material.metalness = 0.9;
// material.roughness = 0.1;
// material.envMap = envTexture;

// material.bumpMap = bumpTexture;
// material.displacementMap = displacementTexture;

// const geometry2 = new THREE.PlaneBufferGeometry(1, 1, 64, 64);
// const material2 = new THREE.MeshBasicMaterial();
// const mesh2 = new THREE.Mesh(geometry, material);
// mesh2.position.z = -1;
// scene.add(mesh2)

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 1) Range
gui.add(mesh.position, "x").min(-3).max(3).step(0.1).name("X MeshOne");
// 2) Boolean
gui.add(material, "wireframe");
// console.log(material.color);
// console.log(mesh.position.x);
// 3) Color
gui.addColor(materialColor, "color").onChange(() => {
  material.color.set(materialColor.color);
});

//Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 1;
scene.add(camera);

//Renderer
const canvas = document.querySelector(".draw");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(aspect.width, aspect.height);

//OrbitControls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

//Clock Class
const clock = new THREE.Clock();

const animate = () => {
  //GetElapsedTime
  const elapsedTime = clock.getElapsedTime();

  //Update Controls
  orbitControls.update();

  //Renderer
  renderer.render(scene, camera);

  //RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();
