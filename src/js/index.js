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

// Global illumination
// TODO - Might mess up the calculations in later tasks,
//  but added it for better view, due to pointLight not "bouncing"
const light = new THREE.AmbientLight( 0x404040 );
scene.add( light );

// Objects
const world = new World(11);
let worldCellMeshes = world.getCellMeshes();
worldCellMeshes.forEach(mesh => {
  scene.add(mesh);
});

// Build manager

const buildManager = new BuildManager(scene, world);

// Materials
const brown = new THREE.MeshLambertMaterial( {color: 0x45290a} );
const brick = new THREE.MeshLambertMaterial( {color: 0xf85321b} );
const darkGrey = new THREE.MeshLambertMaterial( {color: 0x1f1e1e} );
const lightGrey = new THREE.MeshLambertMaterial( {color: 0x737070} );

const building1 = new Building(1, 1, 1, brown);
const building2 = new Building(1, 2, 1, brick);
const building3 = new Building(1, 2, 1, darkGrey);
const building4 = new Building(2, 2, 2, lightGrey);

buildManager.addBuilding(building1, 0, 0);
buildManager.addBuilding(building2, 1, 0);
buildManager.addBuilding(building3, 5, 2);
buildManager.addBuilding(building4, 9, 8);



// Animation

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();