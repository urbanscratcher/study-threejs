import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "./RectAreaLightUniformsLib.js";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #light;
  #lightHelper;
  #cube;

  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this.#divContainer = divContainer;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    // shadow - renderer setting
    renderer.shadowMap.enabled = true;
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
    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);
    this.#camera = camera;
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContainer);
  }

  #setupLight() {
    const auxLight = new THREE.DirectionalLight(0xffffff, 0.5);
    auxLight.position.set(0, 5, 0);
    auxLight.target.position.set(0, 0, 0);
    this.#scene.add(auxLight.target);
    this.#scene.add(auxLight);

    // const light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.set(0, 5, 0);
    // light.target.position.set(0, 0, 0);
    // this.#scene.add(light.target);
    // const helper = new THREE.DirectionalLightHelper(light);
    // this.#scene.add(helper);
    // this.#lightHelper = helper;

    // Point Lighting
    // const light = new THREE.PointLight(0xffffff, 0.5);
    // light.position.set(0, 5, 0);

    // Spot Lighting
    const light = new THREE.SpotLight(0xffffff, 50);
    light.position.set(0, 5, 0);
    light.target.position.set(0, 0, 0);
    light.angle = THREE.MathUtils.degToRad(30);
    light.penumbra = 0.5;
    this.#scene.add(light.target);

    // light을 표현하기 위한 카메라에서 카메라가 비추는 절두체를 벗어나는 그림자는 잘려 보임
    // -> 절두체 크기를 키워야 함
    light.shadow.camera.top = light.shadow.camera.right = 6;
    light.shadow.camera.bottom = light.shadow.camera.left = -6;

    // 그림자 품질 향상
    // 기본 텍스쳐 크기는 512 -> 늘리기
    light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;

    // 그림자 외곽 blur
    light.shadow.radius = 1;

    // 그림자 카메라 helper
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    this.#scene.add(cameraHelper);

    this.#scene.add(light);
    this.#light = light;
    // shadow - light setting
    light.castShadow = true;
  }

  #setupModel() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "#5d718b",
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    // shadow - model setting
    ground.receiveShadow = true;
    this.#scene.add(ground);

    // const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const bigSphereGeometry = new THREE.TorusKnotGeometry(
      1,
      0.3,
      128,
      64,
      2,
      3
    );
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.2,
    });

    const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    // bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
    bigSphere.position.y = 1.6;
    // shadow - model setting
    bigSphere.receiveShadow = true;
    bigSphere.castShadow = true;
    this.#scene.add(bigSphere);

    const torusGeometry = new THREE.TorusGeometry(0.4, 0.1, 32, 32);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: "#9b59b6",
      roughness: 0.5,
      metalness: 0.9,
    });

    Array.from({ length: 8 }).forEach((_, i) => {
      const torusPivot = new THREE.Object3D();
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
      torus.position.set(3, 0.5, 0);
      torusPivot.add(torus);
      torus.receiveShadow = true;
      torus.castShadow = true;
      this.#scene.add(torusPivot);
    });

    const smallSphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const smallSphereMaterial = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0.2,
      metalness: 0.5,
    });
    const smallSpherePivot = new THREE.Object3D();
    const smallSphere = new THREE.Mesh(
      smallSphereGeometry,
      smallSphereMaterial
    );
    smallSpherePivot.add(smallSphere);
    smallSpherePivot.name = "smallSpherePivot";
    smallSphere.position.set(3, 0.5, 0);
    smallSphere.receiveShadow = true;
    smallSphere.castShadow = true;
    this.#scene.add(smallSpherePivot);
  }

  resize() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  // parameter: ms time (for animation)
  render(time) {
    this.#renderer.render(this.#scene, this.#camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001;
    const smallSpherePivot = this.#scene.getObjectByName("smallSpherePivot");
    if (smallSpherePivot) {
      smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time * 50);

      if (this.#light.target) {
        const smallSphere = smallSpherePivot.children[0];
        smallSphere.getWorldPosition(this.#light.target.position);
        if (this.#lightHelper) this.#lightHelper.update();
      }

      // PointLight
      if (this.#light instanceof THREE.PointLight) {
        const smallSphere = smallSpherePivot.children[0];
        smallSphere.getWorldPosition(this.#light.position);
      }
    }
  }
}

window.onload = () => {
  new App();
};
