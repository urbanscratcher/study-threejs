import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class Particle {
  #mesh;

  constructor(scene, geometry, material, x, y) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0);
    scene.add(mesh);
    mesh.wrapper = this;
    this.awakenTime = undefined;
    this.#mesh = mesh;
  }

  awake(time) {
    if (!this.awakenTime) {
      this.awakenTime = time;
    }
  }

  update(time) {
    if (this.awakenTime) {
      const period = 12.0;
      const pastDuration = time - this.awakenTime; // sec
      if (pastDuration >= period) this.awakenTime = undefined;

      this.#mesh.rotation.x = THREE.MathUtils.lerp(
        0,
        Math.PI * 2 * period,
        pastDuration / period
      );

      let h_s, l;
      if (pastDuration < period / 2) {
        h_s = THREE.MathUtils.lerp(0.0, 1.0, pastDuration / (period / 2));
        l = THREE.MathUtils.lerp(0.1, 1, pastDuration / (period / 2.0));
      } else {
        h_s = THREE.MathUtils.lerp(1.0, 1.0, pastDuration / (period / 2) - 1);
        l = THREE.MathUtils.lerp(1.0, 0.1, pastDuration / (period / 2.0) - 1);
      }

      this.#mesh.material.color.setHSL(h_s, h_s, l);
      this.#mesh.position.z = h_s * 15.0;
    }
  }
}

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #cube;
  #raycaster;

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
    this.#setupPicking();

    window.onresize = this.resize.bind(this);
    this.resize();
    requestAnimationFrame(this.render.bind(this));
  }

  #setupCamera() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 40;
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

  #setupModel() {
    const geometry = new THREE.BoxGeometry();

    for (let x = -20; x <= 20; x += 1.1) {
      for (let y = -20; y <= 20; y += 1.1) {
        const color = new THREE.Color();
        color.setHSL(0, 0, 0.1);
        const material = new THREE.MeshStandardMaterial({ color });
        new Particle(this.#scene, geometry, material, x, y);
      }
    }
  }

  #setupPicking() {
    const raycaster = new THREE.Raycaster();
    raycaster.cursorNormalizedPosition = undefined;
    this.#divContainer.addEventListener(
      "mousemove",
      this.#onMouseMove.bind(this)
    );
    this.#raycaster = raycaster;
  }

  #onMouseMove(e) {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;

    // -1~1 값으로 정규화
    const x = (e.offsetX / width) * 2 - 1;
    const y = -(e.offsetY / height) * 2 + 1;
    this.#raycaster.cursorNormalizedPosition = { x, y };
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

    if (this.#raycaster && this.#raycaster.cursorNormalizedPosition) {
      this.#raycaster.setFromCamera(
        this.#raycaster.cursorNormalizedPosition,
        this.#camera
      );
      const targets = this.#raycaster.intersectObjects(this.#scene.children);

      if (targets.length > 0) {
        const mesh = targets[0].object;
        const particle = mesh.wrapper;
        particle.awake(time);
      }
    }

    this.#scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.wrapper.update(time);
      }
    });
  }
}

window.onload = () => {
  new App();
};
