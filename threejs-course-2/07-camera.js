import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";

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
    const aspect = width / height;

    // Perspective Camera: fovy, aspect, zNear, zFar
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);

    // Orthogrpahic Camera
    // const camera = new THREE.OrthographicCamera(
    //   -1 * aspect,
    //   1 * aspect,
    //   1,
    //   -1,
    //   0.1,
    //   100
    // );
    // camera.zoom = 0.15;

    camera.position.set(7, 7, 0);
    camera.lookAt(0, 0, 0);
    this.#camera = camera;
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContainer);
  }

  #setupLight() {
    // const light = new THREE.AmbientLight(0xff0000, 0.2);

    // const light = new THREE.HemisphereLight("#b0d8f5", "#bb7a1c", 1);

    // const light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.set(0, 5, 0);
    // light.target.position.set(0, 0, 0);
    // this.#scene.add(light.target);
    // const helper = new THREE.DirectionalLightHelper(light);
    // this.#scene.add(helper);
    // this.#lightHelper = helper;

    // const light = new THREE.PointLight(0xffffff, 5);
    // light.position.set(0, 5, 0);
    // light.distance = 2;
    // const helper = new THREE.PointLightHelper(light);
    // this.#scene.add(helper);

    // const light = new THREE.SpotLight(0xffffff, 10);
    // light.position.set(0, 5, 0);
    // light.target.position.set(0, 0, 0);
    // light.angle = THREE.MathUtils.degToRad(30);
    // light.penumbra = 1; // 빛 감쇄율(0~1)
    // this.#scene.add(light.target);
    // const helper = new THREE.SpotLightHelper(light);
    // this.#scene.add(helper);
    // this.#lightHelper = helper;

    RectAreaLightUniformsLib.init();
    const light = new THREE.RectAreaLight(0xffffff, 10, 6, 0.5);
    light.position.set(0, 5, 0);
    light.rotation.x = THREE.MathUtils.degToRad(-90);
    const helper = new RectAreaLightHelper(light);
    light.add(helper);

    this.#scene.add(light);
    this.#light = light;
  }

  #setupModel() {
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: "#aaaaaa",
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = THREE.MathUtils.degToRad(-90);
    this.#scene.add(ground);

    const bigSphereGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI);
    const bigSphereMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.1,
      metalness: 0.2,
    });

    const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);
    bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
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
    this.#scene.add(smallSpherePivot);

    const targetPivot = new THREE.Object3D();
    const target = new THREE.Object3D();
    targetPivot.add(target);
    targetPivot.name = "targetPivot";
    target.position.set(3, 0.5, 0);
    this.#scene.add(targetPivot);
  }

  resize() {
    const width = this.#divContainer.clientWidth;
    const height = this.#divContainer.clientHeight;
    const aspect = width / height;

    // resize by camera
    if (this.#camera instanceof THREE.PerspectiveCamera) {
      this.#camera.aspect = aspect;
    } else {
      this.#camera.left = -1 * aspect; // xLeft
      this.#camera.right = 1 * aspect; // xRight
    }

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

      //
      const smallSphere = smallSpherePivot.children[0];
      smallSphere.getWorldPosition(this.#camera.position);

      const targetPivot = this.#scene.getObjectByName("targetPivot");
      if (targetPivot) {
        targetPivot.rotation.y = THREE.MathUtils.degToRad(time * 50 + 10);

        const target = targetPivot.children[0];
        const pt = new THREE.Vector3();

        target.getWorldPosition(pt);
        this.#camera.lookAt(pt);
      }

      if (this.#light.target) {
        const smallSphere = smallSpherePivot.children[0];
        smallSphere.getWorldPosition(this.#light.target.position);
        if (this.#lightHelper) this.#lightHelper.update();
      }
    }
  }
}

window.onload = () => {
  new App();
};
