import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #teapot;
  #cylinderPivot;

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
    this.#setupBackground();

    window.onresize = this.resize.bind(this);
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  #setupCamera() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.set(0, 4, 5);
    this.#camera = camera;
  }

  #setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.#scene.add(light);
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContainer);
  }

  #setupBackground() {
    const loader = new THREE.TextureLoader();
    loader.load("./models/hdri_studio.jpg", (tex) => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(tex.image.height);
      renderTarget.fromEquirectangularTexture(this.#renderer, tex);
      this.#scene.background = renderTarget.texture;
    });
  }

  #setupModel() {
    const teapotRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    teapotRenderTarget._pmremGen = new THREE.PMREMGenerator(this.#renderer);
    const teapotCamera = new THREE.CubeCamera(0.01, 10, teapotRenderTarget);
    const teapotGeometry = new TeapotGeometry(0.7, 24);
    const teapotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      ior: 2.5,
      thickness: 0.2,
      transmission: 1,
      side: THREE.DoubleSide,
      envMap: teapotRenderTarget.texture,
      envMapIntensity: 1,
    });
    const teapot = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapot.add(teapotCamera);
    this.#scene.add(teapot);
    this.#teapot = teapot;

    const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1.5, 32);
    const cylinderMaterial = new THREE.MeshNormalMaterial();
    const cylinderPivot = new THREE.Object3D();
    for (let degree = 0; degree <= 360; degree += 30) {
      const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
      const radian = THREE.MathUtils.degToRad(degree);
      cylinder.position.set(2 * Math.sin(radian), 0, 2 * Math.cos(radian));
      cylinderPivot.add(cylinder);
    }
    this.#scene.add(cylinderPivot);
    this.#cylinderPivot = cylinderPivot;
  }

  resize() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;

    this.#camera.aspect = width / height;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(width, height);
  }

  render(time) {
    this.#renderer.render(this.#scene, this.#camera);
    this.update(time);
    requestAnimationFrame(this.render.bind(this));
  }

  update(time) {
    time *= 0.001; // second unit
    if (this.#cylinderPivot) {
      this.#cylinderPivot.rotation.y = Math.sin(time * 0.5);
    }

    if (this.#teapot) {
      this.#teapot.visible = false;
      const teapotCamera = this.#teapot.children[0];
      teapotCamera.update(this.#renderer, this.#scene);

      // 버전 업데이트돼서 그런지 아래는 안해도 되는 듯? (pmremGen 부분)
      const renderTarget = teapotCamera.renderTarget._pmremGen.fromCubemap(
        teapotCamera.renderTarget.texture
      );
      this.#teapot.material.envMap = renderTarget.texture;
      this.#teapot.material.needsUpdate = true;

      this.#teapot.visible = true;
    }
  }
}

window.onload = () => {
  new App();
};
