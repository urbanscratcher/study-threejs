import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class App {
  #divContaianer;
  #renderer;
  #scene;
  #camera;
  #cube;

  #solarSystem;
  #earthOrbit;
  #moonOrbit;

  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this.#divContaianer = divContainer;

    // Renderer 정의
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // 사용자가 설정하고 있는 배율을 적용
    renderer.setPixelRatio(window.devicePixelRatio);
    // canvas 타입의 DOM 엘레먼트를 추가
    divContainer.appendChild(renderer.domElement);
    this.#renderer = renderer;

    // Scene 정의
    const scene = new THREE.Scene();
    this.#scene = scene;

    this.#setupCamera();
    this.#setupLight();
    this.#setupModel();
    this.#setupControls();

    // bind: resize 메서드 안에서 this가 가리키는 객체가 event 객체가 아닌 App 클래스 객체가 되도록 함
    window.onresize = this.resize.bind(this);
    // 렌더러나 카메라의 속성을 창 크기에 맞게 설정
    this.resize();

    // 렌더 메서드: 3D 그래픽 scene을 만들어줌
    // requestAnimationFrame: 최대한 빠르게 렌더 메서드를 호출
    // bind: 렌더 메서드 안에서 쓰이는 this가 App 클래스 객체를 가리키도록 함
    requestAnimationFrame(this.render.bind(this));
  }

  #setupCamera() {
    const width = this.#divContaianer.clientWidth;
    const height = this.#divContaianer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 20;
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
    new OrbitControls(this.#camera, this.#divContaianer);
  }

  #setupModel() {
    const solarSystem = new THREE.Object3D();
    this.#scene.add(solarSystem);

    const radius = 1;
    const widthSegments = 12;
    const heightSegments = 12;
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    const sunMaterial = new THREE.MeshPhongMaterial({
      emissive: 0xffff00,
      fiatShading: true,
    });

    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(3, 3, 3);
    solarSystem.add(sunMesh);

    const earthOrbit = new THREE.Object3D();
    solarSystem.add(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
      fiatShading: true,
    });

    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.position.x = 10;
    earthOrbit.add(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
      fiatShading: true,
    });

    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);

    this.#solarSystem = solarSystem;
    this.#earthOrbit = earthOrbit;
    this.#moonOrbit = moonOrbit;
  }

  resize() {
    const width = this.#divContaianer.clientWidth;
    const height = this.#divContaianer.clientHeight;

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
    this.#solarSystem.rotation.y = time / 2;

    this.#earthOrbit.rotation.y = time * 2;
    this.#moonOrbit.rotation.y = time * 5;
  }
}

window.onload = () => {
  new App();
};
