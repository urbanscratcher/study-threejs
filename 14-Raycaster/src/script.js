import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { gsap } from "gsap";

//Scene
const scene = new THREE.Scene();

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

//Meshes
//1-Mesh
const geometry = new THREE.BoxBufferGeometry();
const material = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 1;
scene.add(mesh);

//2-Mesh
const geometry2 = new THREE.BoxBufferGeometry();
const material2 = new THREE.MeshBasicMaterial();
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.x = -1;
scene.add(mesh2);

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
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(aspect.width, aspect.height);

//Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const meshes = [mesh, mesh2];
const oneIntersectMesh = [];

window.addEventListener("mousemove", (e) => {
  // -1 < < 1
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  //casting ray
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(meshes);

  // for (let i = 0; i < intersects.length; i++) {
  //   intersects[i].object.material.color.set(0xff0000);
  // }

  if (intersects.length > 0) {
    if (oneIntersectMesh.length < 1) {
      oneIntersectMesh.push(intersects[0]);
    }
    oneIntersectMesh[0].object.material.color.set("red");
    gsap.to(oneIntersectMesh[0].object.scale, {
      duration: 0.5,
      x: 1.25,
      y: 1.25,
      z: 1.25,
    });
    console.log(oneIntersectMesh);
  } else if (oneIntersectMesh[0] !== undefined) {
    // intersects.length === 0;
    oneIntersectMesh[0].object.material.color.set("white");
    gsap.to(oneIntersectMesh[0].object.scale, {
      duration: 0.5,
      x: 1,
      y: 1,
      z: 1,
    });
    oneIntersectMesh.shift();
  }
});

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
