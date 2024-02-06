import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #cube;
  #controls;
  #mixer;
  #clock;

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
    this.#setupModel();

    window.onresize = this.resize.bind(this);
    this.resize();

    requestAnimationFrame(this.render.bind(this));
  }

  #setupControls() {
    this.#controls = new OrbitControls(this.#camera, this.#divContainer);
  }

  #zoomFit(object3D, camera, viewMode, bFront) {
    // 모델의 경계 박스 구하기
    const box = new THREE.Box3().setFromObject(object3D);

    // 모델의 경계 박스에 대한 Euclidean 대각선 길이 구하기
    const sizeBox = box.getSize(new THREE.Vector3()).length();

    // 모델의 경계 박스 중심 위치 구하기
    const centerBox = box.getCenter(new THREE.Vector3());

    let offsetX = 0,
      offsetY = 0,
      offsetZ = 0;
    viewMode === "X"
      ? (offsetX = 1)
      : viewMode === "Y"
      ? (offsetY = 1)
      : (offsetZ = 1);

    if (!bFront) {
      offsetX *= -1;
      offsetY *= -1;
      offsetZ *= -1;
    }

    camera.position.set(
      centerBox.x + offsetX,
      centerBox.y + offsetY,
      centerBox.z + offsetZ
    );

    // 모델 크기의 절반 계산
    const halfSizeModel = sizeBox * 0.5;

    // 카메라의 fov의 절반값
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);

    // 모델을 화면에 꽉 채우기 위한 적당한 거리
    const dist = halfSizeModel / Math.tan(halfFov);

    // 모델 중심에서 카메라 위치로 향하는 방향 단위 벡터 계산
    const direction = new THREE.Vector3()
      .subVectors(camera.position, centerBox)
      .normalize();

    // 모델 중심 위치에서 단위 방향 벡터 방향으로 dist 거리에 대한 위치
    const position = direction.multiplyScalar(dist).add(centerBox);
    camera.position.copy(position);

    // 모델 크기에 맞춰 카메라의 near, far 값을 대략 조정
    camera.near = sizeBox / 100;
    camera.far = sizeBox * 100;

    // 카메라 기본 속성 변경에 따라 투영행렬 업데이트
    camera.updateProjectionMatrix();

    // 카메라가 모델의 중심을 바라보도록 함
    camera.lookAt(centerBox.x, centerBox.y, centerBox.z);
    this.#controls.target.set(centerBox.x, centerBox.y, centerBox.z);
  }

  #setupCamera() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 4;
    this.#camera = camera;

    this.#scene.add(this.#camera);
  }

  #setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // this.#scene.add(light);
    this.#camera.add(light);
  }

  #setupModel() {
    this.#clock = new THREE.Clock();
    const loader = new FBXLoader();
    loader.load("./models/hook_punch.fbx", (obj) => {
      // animating
      this.#mixer = new THREE.AnimationMixer(obj);
      const action = this.#mixer.clipAction(obj.animations[0]);
      action.play();

      this.#scene.add(obj);
      this.#zoomFit(obj, this.#camera, "Z", true);
    });
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

    // animating - 경과된 시간 delta (초) 이용
    const delta = this.#clock.getDelta();
    if (this.#mixer) this.#mixer.update(delta);
  }
}

window.onload = () => {
  new App();
};
