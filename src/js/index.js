// Controller for index.html

// Scene

const scene = new THREE.Scene();
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
sun.position.set(10, 10, 3);
scene.add(sun);

const sunHelper = new THREE.PointLightHelper(sun, 1);
scene.add(sunHelper);

// Objects
const world = new World(11);
let worldCellMeshes = world.getCellMeshes();
worldCellMeshes.forEach(mesh => {
  scene.add(mesh);
});

// Build manager

const buildManager = new BuildManager(scene, world);

// Materials
const material1 = new THREE.MeshLambertMaterial( {color: 0x00ffff} );
const material2 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const material3 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const material4 = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

const materials = [material1, material2, material3, material4]

const building1 = new Building(1, 1, 1, material1);
const building2 = new Building(1, 2, 1, material1);

buildManager.addBuilding(building1, 0, 0);
buildManager.addBuilding(building2, 1, 0);


// Animation

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();