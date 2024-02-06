import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #cube;

  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this.#divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    divContainer.appendChild(renderer.domElement);
    this.#renderer = renderer;

    const scene = new THREE.Scene();
    this.#scene = scene;

    this.#setupCamera();
    this.#setupLight();
    this.#setupModel();
    this.#setupControls();

    window.onresize = this.resize.bind(this);
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  #setupCamera() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0, 4, 9);
    this.#camera = camera;
  }

  #setupLight() {
    this.#scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    const color = 0xffffff;
    const intensity = 5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.#scene.add(light);
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContainer);
  }

  #setupModel() {
    const renderTargetOptions = {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    };

    const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(
      512,
      renderTargetOptions
    );
    const sphereCamera = new THREE.CubeCamera(0.1, 1000, sphereRenderTarget);
    const sphereGeometry = new THREE.SphereGeometry(1.5);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: sphereRenderTarget.texture,
      reflectivity: 0.95,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // 큐브 카메라 위치 잡기 - pivot 개념 적용
    const spherePivot = new THREE.Object3D();
    spherePivot.add(sphere);
    spherePivot.add(sphereCamera);
    spherePivot.position.set(1, 0, 1);
    this.#scene.add(spherePivot);

    const cylinderRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    );
    const cylinderCamera = new THREE.CubeCamera(
      0.1,
      1000,
      cylinderRenderTarget
    );
    const cylinderGeometry = new THREE.CylinderGeometry(0.5, 1, 3, 32);
    const cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: cylinderRenderTarget.texture,
      reflectivity: 0.95,
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    const cylinderPivot = new THREE.Object3D();
    cylinderPivot.add(cylinder);
    cylinderPivot.add(cylinderCamera);
    cylinderPivot.position.set(-1, 0, -1);
    this.#scene.add(cylinderPivot);

    const torusRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    );
    const torusCamera = new THREE.CubeCamera(0.1, 1000, torusRenderTarget);
    const torusGeometry = new THREE.TorusGeometry(4, 0.5, 24, 64);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: torusRenderTarget.texture,
      reflectivity: 0.95,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    const torusPivot = new THREE.Object3D();
    torusPivot.add(torus);
    torusPivot.add(torusCamera);
    torus.rotation.x = Math.PI / 2;
    torus.name = "torus";
    this.#scene.add(torusPivot);

    const planeRenderTarget = new THREE.WebGLCubeRenderTarget(
      2048,
      renderTargetOptions
    );
    const planeCamera = new THREE.CubeCamera(0.1, 1000, planeRenderTarget);
    const planeGeometry = new THREE.PlaneGeometry(12, 12);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      envMap: planeRenderTarget.texture,
      reflectivity: 0.95,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    const planePivot = new THREE.Object3D();
    planePivot.add(plane);
    planePivot.add(planeCamera);
    plane.rotation.x = -Math.PI / 2;
    planePivot.position.y = -4.8;
    this.#scene.add(planePivot);
  }

  resize() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  render(time) {
    this.#scene.traverse((obj) => {
      if (obj instanceof THREE.Object3D) {
        const mesh = obj.children[0];
        const cubeCamera = obj.children[1];

        if (
          mesh instanceof THREE.Mesh &&
          cubeCamera instanceof THREE.CubeCamera
        ) {
          mesh.visible = false;
          cubeCamera.update(this.#renderer, this.#scene);
          mesh.visible = true;
        }
      }
    });

    this.#renderer.render(this.#scene, this.#camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; // second unit

    const torus = this.#scene.getObjectByName("torus");
    if (torus) {
      torus.rotation.x = Math.sin(time);
    }
  }
}

window.onload = () => {
  new App();
};
