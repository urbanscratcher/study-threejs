import * as THREE from "three";

class App {
  #divContainer;
  #renderer;
  #scene;
  #camera;
  #cube;

  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this.#divContainer = divContainer;

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

  #setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });
    const cube = new THREE.Mesh(geometry, material);
    this.#scene.add(cube);
    this.#cube = cube;
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
    this.#cube.rotation.x = time;
    this.#cube.rotation.y = time;
  }
}

window.onload = () => {
  new App();
};
