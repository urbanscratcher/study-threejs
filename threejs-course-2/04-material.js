import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper.js";

class App {
  #divContaianer;
  #renderer;
  #scene;
  #camera;
  #cube;

  constructor() {
    const divContainer = document.querySelector("#webgl-container");
    this.#divContaianer = divContainer;

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
    const width = this.#divContaianer.clientWidth;
    const height = this.#divContaianer.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
    camera.position.z = 3;
    this.#camera = camera;
    this.#scene.add(camera);
  }

  #setupLight() {
    // 모든 메쉬의 전체 맵에 대해 균일하게 비추는 빛
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.#scene.add(ambientLight);

    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    // this.#scene.add(light);
    this.#camera.add(light);
  }

  #setupControls() {
    new OrbitControls(this.#camera, this.#divContaianer);
  }

  /*
  // point texture
  #setupModel() {
    const vertices = [];
    Array.from({ length: 10000 }).forEach(() => {
      const x = THREE.MathUtils.randFloatSpread(5);
      const y = THREE.MathUtils.randFloatSpread(5);
      const z = THREE.MathUtils.randFloatSpread(5);

      vertices.push(x, y, z);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const sprite = new THREE.TextureLoader().load(
      "./materials/sprite/disc.png"
    );

    const material = new THREE.PointsMaterial({
      map: sprite,
      alphaTest: 0.5,
      color: "#00ffff",
      size: 0.1,
      sizeAttenuation: true, // 원근 크기 적용 여부
    });

    const points = new THREE.Points(geometry, material);
    this.#scene.add(points);
  }
  */

  /*
  // line texture
  #setupModel() {
    const vertices = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    const material = new THREE.LineDashedMaterial({
      color: 0xffff00,
      dashSize: 0.2,
      gapSize: 0.1,
      scale: 2,
    });

    const line = new THREE.LineLoop(geometry, material);
    // dash 라인을 위해 compute 해줘야 함
    line.computeLineDistances();
    this.#scene.add(line);
  }
  */

  #setupModel() {
    /*
    const material = new THREE.MeshBasicMaterial({
      visible: true,
      transparent: true, // opacity 사용 여부
      opacity: 0.5,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide, // 광원에 영향 받음
      color: 0xffff00,
      wireframe: false,
    });
    */

    /*
    const material = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,

      color: "#d25383",
      emissive: 0x555500, // 재질 자체에서 방출하는 색상값
      wireframe: true,
    });
    */

    /*
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x000000,
      specular: 0xffff00, // 반사광
      shininess: 10,
      flatShading: true,
      wireframe: false,
    });
    */

    /*
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff0000,
      emissive: 0x000000,
      roughness: 1,
      metalness: 0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.1,
      flatShading: false,
      wireframe: false,
    });
    */

    const textureLoader = new THREE.TextureLoader();
    /*
    const map = textureLoader.load("./materials/uv_grid_opengl.jpg", (tex) => {
  
      tex.repeat.x = 1;
      tex.repeat.y = 1;

      // tex.wrapS = THREE.RepeatWrapping;
      // tex.wrapT = THREE.RepeatWrapping;

      tex.wrapS = THREE.ClampToEdgeWrapping; // 1번만 반복되고 나머지는 이미지 끝단 픽셀로 끝까지 채움
      tex.wrapT = THREE.ClampToEdgeWrapping;

      // tex.wrapS = THREE.MirroredRepeatWrapping;
      // tex.wrapT = THREE.MirroredRepeatWrapping;

      tex.offset.x = 0;
      tex.offset.y = 0;

      tex.rotation = THREE.MathUtils.degToRad(0); //반시계 방향으로 회전해서 맵핑됨
      tex.center.x = 0.5;
      tex.center.y = 0.5;

      // tex.magFilter = THREE.LinearFilter; // 가장 가까운 4개의 픽셀 값을 가져와 선형 보간법을 사용한 값을 사용
      tex.magFilter = THREE.NearestFilter; // 가장 가까운 픽셀 1개 값만 가져와 사용

      // minFilter : 원래 이미지 크기보다 작게 렌더링 될 때(멀리서 봤을 때) 보간법
      // MipMap: 1/2 이미지들을 미리 만들어 놓은 이미지 집합
      // tex.minFilter = THREE.NearestFilter;
      // tex.minFilter = THREE.LinearFilter;
      // tex.minFilter = THREE.NearestMipMapNearestFilter;
      tex.minFilter = THREE.LinearMipMapNearestFilter;
      // tex.minFilter = THREE.NearestMipMapLinearFilter;
      // tex.minFilter = THREE.LinearMipmapLinearFilter;
    });
     */

    const map = textureLoader.load(
      "./materials/glass/Glass_Window_002_basecolor.jpg"
    );
    const mapAO = textureLoader.load(
      "./materials/glass/Glass_Window_002_ambientOcclusion.jpg"
    );
    const mapHeight = textureLoader.load(
      "./materials/glass/Glass_Window_002_height.png"
    );
    const mapNormal = textureLoader.load(
      "./materials/glass/Glass_Window_002_normal.jpg"
    );
    const mapRoughness = textureLoader.load(
      "./materials/glass/Glass_Window_002_roughness.jpg"
    );
    const mapMetalic = textureLoader.load(
      "./materials/glass/Glass_Window_002_metallic.jpg"
    );
    const mapAlpha = textureLoader.load(
      "./materials/glass/Glass_Window_002_opacity.jpg"
    );
    const mapLight = textureLoader.load("./materials/glass/light.png");

    const material = new THREE.MeshStandardMaterial({
      map: map,

      normalMap: mapNormal, // 광원에 대한 영향을 계산하는데 사용. 착시 현상으로 입체감 표현

      displacementMap: mapHeight, // 실제 메쉬의 geometry 값을 변경시켜 입체감 표현
      displacementScale: 0.2, // 20%만 적용
      displacementBias: -0.15,

      aoMap: mapAO, // ambient light, uv2 데이터 필요. 미리 만들어진 세밀한 그림자 효과 표현
      aoMapIntensity: 1,

      roughnessMap: mapRoughness, // 거칠기 재질
      roughness: 0.5,

      metalnessMap: mapMetalic,
      metalness: 0.5,

      // alphaMap: mapAlpha,
      transparent: true,
      side: THREE.DoubleSide,

      lightMap: mapLight, // uv2 데이터 필요
      lightMapIntensity: 1.5,
    });

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 256, 256, 256),
      material
    );
    box.position.set(-1, 0, 0);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    this.#scene.add(box);

    // 법선 벡터의 시각화
    // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    // this.#scene.add(boxHelper);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 512, 512),
      material
    );
    sphere.position.set(1, 0, 0);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    this.#scene.add(sphere);

    // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
    // this.#scene.add(sphereHelper);
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
  }
}

window.onload = () => {
  new App();
};
