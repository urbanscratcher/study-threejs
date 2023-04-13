// Scene Mesh Camera Renderer

// Scene
const scene = new THREE.Scene();

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "purple" });
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

// Camera
const aspect = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".draw"); // Select the canvas
const renderer = new THREE.WebGLRenderer({ canvas }); // add Webgl Renderer
renderer.setSize(aspect.width, aspect.height); // Renderer size

// Clock Class
const clock = new THREE.Clock();

const animate = () => {
  // GetElapsedTime
  const elapsedTime = clock.getElapsedTime();

  // Update Rotation on X Axis
  mesh.rotation.y = elapsedTime * Math.PI * 2; // 360도를 1초에 한번 도는 애니메이션
  // mesh.position.x += 0.01;
  // mesh.position.y += 0.01;

  // Renderer
  renderer.render(scene, camera); // draw what the camera inside the scene captured

  // RequestAnimationFrame
  window.requestAnimationFrame(animate);
};
animate();

// function will get called 60 times per second on some devices : 0.01 * 60 = 0.6 on x
// function will get called 120 times per second on some devices : 0.01 * 120 = 1.2 on x
// fps : frames per seconds -> depends on devices
// fps가 높을 수록 포지션 변화 빨라짐 -> clock class 사용해서 해결해야 함
