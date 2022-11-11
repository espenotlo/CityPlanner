// Controller for index.html
// import { OrbitControls } from "../../node_modules/three-orbit-controls/index"

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF8F8F8);

// container for scene
const container = document.getElementById('canvas');
console.log(container.offsetWidth);

// Camera

const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetWidth, 0.1, 1000);
camera.position.set(0, 2, 10);

// Renderer

const renderer = new THREE.WebGLRenderer();

renderer.setSize(container.offsetWidth , container.offsetWidth);
container.appendChild(renderer.domElement);

//Controls
// const controls = new OrbitControls(camera, renderer.domElement);

// controls.update();
// Lights

const sun = new THREE.PointLight(0xfffff0, 3, 100, 2);
sun.position.set(10, 10, 0);
scene.add(sun);

const sunHelper = new THREE.PointLightHelper(sun, 1);
scene.add(sunHelper);

// Objects

const worldGeometry = new THREE.PlaneGeometry(10, 10);

// Materials

const worldMaterial = new THREE.MeshLambertMaterial({color: 0x208020});

// Meshes

const world = new THREE.Mesh(worldGeometry, worldMaterial);
world.rotateX(-1.5708);
scene.add(world);

// Animation

function animate() {
  requestAnimationFrame(animate);
  // controls.update();
  renderer.render(scene, camera);
}
animate();