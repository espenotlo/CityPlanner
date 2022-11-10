// Controller for index.html

// Scene

const scene = new THREE.Scene();
const buildManager = new BuildManager(scene);

// Camera

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 6, 14);
camera.rotation.x = -0.5;
camera.rotation.y = -0.3;
camera.rotation.z = -0.15;
// Renderer

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights

const sun = new THREE.PointLight(0xfffff0, 3, 100, 2);
sun.position.set(10, 10, 0);
scene.add(sun);

const sunHelper = new THREE.PointLightHelper(sun, 1);
scene.add(sunHelper);

// Objects
const world = new World(11);
let worldCellMeshes = world.getCellMeshes();
worldCellMeshes.forEach(mesh => {
  scene.add(mesh);
});
// Animation

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();