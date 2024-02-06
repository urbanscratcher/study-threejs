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
    this.#setupControls();
    this.#setupLight();
    // this.#setupModel();
    this.#setupBackground();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContainer);
  }

  #setupCamera() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 80;
    this.#camera = camera;

    this.#scene.add(this.#camera);
  }

  #setupLight() {
    const color = 0xffffff;
    const intensity = 1.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.#scene.add(light);
  }

  #setupBackground() {
    // this.#scene.background = new THREE.Color("#9b59b6");
    // this.#scene.fog = new THREE.Fog("#9b59b6", 0, 150);
    // this.#scene.fog = new THREE.FogExp2("#9b59b6", 0.02);
    // const loader = new THREE.TextureLoader();
    // loader.load("./models/night_sky.jpg", (tex) => {
    //   this.#scene.background = tex;
    //   this.#setupModel();
    // });
    // const loader = new THREE.CubeTextureLoader();
    // loader.load(
    //   [
    //     "./models/cubemap_sf/posx.jpg",
    //     "./models/cubemap_sf/negx.jpg",
    //     "./models/cubemap_sf/posy.jpg",
    //     "./models/cubemap_sf/negy.jpg",
    //     "./models/cubemap_sf/posz.jpg",
    //     "./models/cubemap_sf/negz.jpg",
    //   ],
    //   (cube) => {
    //     this.#scene.background = cube;
    //     this.#setupModel();
    //   }
    // );

    const loader = new THREE.TextureLoader();
    loader.load("./models/hdri_sky.jpeg", (tex) => {
      const renderTarget = new THREE.WebGLCubeRenderTarget(tex.image.height);
      renderTarget.fromEquirectangularTexture(this.#renderer, tex);
      this.#scene.background = renderTarget.texture;
      this.#setupModel();
    });
  }

  #setupModel() {
    // 모델에 배경이 반사되도록 함
    const pmremG = new THREE.PMREMGenerator(this.#renderer);
    const renderTarget = pmremG.fromEquirectangular(this.#scene.background);

    const geometry = new THREE.SphereGeometry();
    const material1 = new THREE.MeshStandardMaterial({
      color: "#2ecc71",
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: "#e74c3c",
      roughness: 0,
      metalness: 1,
      envMap: renderTarget.texture,
    });

    const rangeMin = -20.0,
      rangeMax = 20.0;
    const gap = 10.0;
    let flag = true;

    for (let x = rangeMin; x <= rangeMax; x += gap) {
      for (let y = rangeMin; y <= rangeMax; y += gap) {
        for (let z = rangeMin * 10; z <= rangeMax; z += gap) {
          flag = !flag;

          const mesh = new THREE.Mesh(geometry, flag ? material1 : material2);
          mesh.position.set(x, y, z);
          this.#scene.add(mesh);
        }
      }
    }
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
    time *= 0.001; // second unit
  }
}

window.onload = () => {
  new App();
};
