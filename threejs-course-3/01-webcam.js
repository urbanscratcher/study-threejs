import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #cube;

  #videoTexture;

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
    this.#setupVideo();

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
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 2;
    this.#camera = camera;
  }

  #setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    this.#scene.add(light);
  }

  #setupVideo() {
    const video = document.createElement("video");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: { width: 1280, height: 720 },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream;
          video.play();

          const videoTexture = new THREE.VideoTexture(video);
          this.#videoTexture = videoTexture;
          this.#setupModel();
        })
        .catch((err) => {
          console.error("can't access the camera", err);
        });
    } else {
      console.error("can't use mediaDevices interface");
    }
  }

  #setupModel() {
    const geometry = new THREE.BoxGeometry();

    const fillMaterial = new THREE.MeshPhongMaterial({
      map: this.#videoTexture,
    });
    const cube = new THREE.Mesh(geometry, fillMaterial);

    this.#scene.add(cube);
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
