import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'https://unpkg.com/three@0.146.0/examples/jsm/objects/Sky.js';

import { World } from './world.js';
import { BuildManager } from './building/build_manager.js';
import { Building } from './building/building.js';
import { DirectionalLightHelper, Mesh, MeshPhongMaterial, Raycaster, SphereGeometry } from 'three';

// Controller for index.html
let camera, scene, renderer;
let sky, sun, sunlight, ambience, world, buildManager;
let mousePosition, rayCaster;
let intersects = [];
let time = 8;
let speed = 1;
let skyChanged, timeChanged;
let passTime = true;

//container for the scene
const container = document.getElementById('canvas');

const worldCellGroup = new THREE.Group();

init();

function initWorld() {
  let planeGeo = new SphereGeometry(1000);
  planeGeo.scale(1,0.0005,1);
  let planeMat = new MeshPhongMaterial({color: 0x806050});
  planeMat.shininess = 0;
  let plane = new Mesh(planeGeo, planeMat);
  plane.position.set(0,-1,0);
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);

  world = new World(11);
  let worldCellMeshes = world.getCellMeshes();

  worldCellMeshes.forEach(mesh => {
    worldCellGroup.add(mesh);
  });
  scene.add(worldCellGroup)
}

function initBuildings() {
  buildManager = new BuildManager(scene, world);
  // Materials
  const brown = new THREE.MeshPhongMaterial( {color: 0x45290a} );
  const brick = new THREE.MeshPhongMaterial( {color: 0xf85321b} );
  const darkGrey = new THREE.MeshPhongMaterial( {color: 0x1f1e1e} );
  const lightGrey = new THREE.MeshPhongMaterial( {color: 0x737070} );

  // Buildings
  const building1 = new Building(1, 1, 1, brown);
  const building2 = new Building(1, 2, 1, brick);
  const building3 = new Building(1, 2, 1, darkGrey);
  const building4 = new Building(2, 2, 2, lightGrey);
  const building5 = new Building(1, 2, 1, lightGrey);

  buildManager.addBuilding(building1, 0, 0);
  buildManager.addBuilding(building2, 1, 0);
  buildManager.addBuilding(building3, 5, 1);
  buildManager.addBuilding(building4, 9, 8);
  buildManager.addBuilding(building5, 8, 10);
}

function initSky() {

  // Add Sky
  sky = new Sky();
  sky.scale.setScalar( 450000 );
  scene.add( sky );

  sun = new THREE.Vector3();
  sunlight = new THREE.DirectionalLight(0xfffff0, 1);

  //Set up shadow properties for the light
  sunlight.castShadow = true;
  const d = 100;
  sunlight.shadow.camera.left = -d;
  sunlight.shadow.camera.right = d;
  sunlight.shadow.camera.top = d;
  sunlight.shadow.camera.bottom = -d;
  sunlight.shadow.mapSize.width = 512;
  sunlight.shadow.mapSize.height = 512;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 1000;
  scene.add(sunlight);  

  let sunlightHelper = new DirectionalLightHelper(sunlight);
  scene.add(sunlightHelper);

  //Global illumination
  ambience = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.05 ); 
  scene.add( ambience );

  // Sky controller:
  const effectController = {
    turbidity: 20,
    rayleigh: 1,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: -Math.cos(time/3.82) * 40 + 10,
    azimuth: 180 - 180 * time / 12,
    exposure: renderer.toneMappingExposure
  };

  timeChanged = function() {
    effectController.elevation = -Math.cos(time/3.82) * 40 + 10;
    effectController.azimuth = 180 - 180 * time / 12;
  }

  skyChanged = function() {
    const uniforms = sky.material.uniforms;
    uniforms[ 'turbidity' ].value = effectController.turbidity;
    uniforms[ 'rayleigh' ].value = effectController.rayleigh;
    uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
    const theta = THREE.MathUtils.degToRad( effectController.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );
    sunlight.position.setFromSphericalCoords(100, phi, theta);
    uniforms[ 'sunPosition' ].value.copy( sun );

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render( scene, camera );
  }
  skyChanged();
}

function init() {
  camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 1, 2000000 );
  camera.position.set(75, 75, 75);

  scene = new THREE.Scene();

  const helper = new THREE.GridHelper( 110, 1, 0xffffff, 0xffffff );
  scene.add( helper );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( container.offsetWidth, container.offsetHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById('canvas').appendChild( renderer.domElement );

  mousePosition = new THREE.Vector2;
  rayCaster = new THREE.Raycaster();

  // Camera controller
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.enableZoom = true;
  controls.enablePan = false;

  initSky();
  initWorld();
  initBuildings();

  window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.offsetWidth, container.offsetHeight);
}

// Animation
function animate() {
  if(passTime){
    time+=0.01 * speed;
  }
  timeChanged();
  skyChanged();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

export function toggleAnimation() {
  passTime = !passTime;
  document.getElementById('timeOfDay').classList.toggle('grayOut');

}
window.toggleAnimation = toggleAnimation;


//Set time of day to a specific value;
export function setTimeOfDay(value) {
  time = Number(value)
  renderer.render(scene, camera);
}
window.setTimeOfDay = setTimeOfDay;



function getMousePosition(event){
  intersects = [];

  //calculates mouse 2d position on canvas (0,0) is center
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  mousePosition.x = ( x/ renderer.domElement.offsetWidth )  * 2 - 1;
  mousePosition.y = - ( y /renderer.domElement.offsetHeight )  * 2 + 1;


  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(worldCellGroup.children, true);

  let xPos = Math.abs(Math.round((intersects[0].point.x/10)+5));
  let zPos = Math.abs(Math.round((intersects[0].point.z/10)+5));
  return {xPos, zPos};
}

function addBuildingOnMouseClick(event) {
  event.preventDefault();

  let position = getMousePosition(event);
  let building = createBuilding();

  buildManager.addBuilding(building, position.xPos, position.zPos);
}

function createBuilding() {
  let settings = getBuildingSettings();
  let material = createMaterialFromName(settings.textureOfBuilding);

  return new Building(settings.widthOfBuilding, settings.heightOfBuilding, settings.depthOfBuilding, material)
}

function createMaterialFromName(name) {
  let color;
  switch (name) {
    case 'brown':
      color = {color: 0x45290a}
      break;
    case 'brick':
      color = {color: 0xf85321b}
      break;
    case 'darkGrey':
      color = {color: 0x1f1e1e}
      break;
    case 'lightGrey':
      color = {color: 0x737070}
      break;
    default:
      console.log('No valid color');
      break;
  }
  return new THREE.MeshPhongMaterial(color);
}

function removeBuildingAtMousePosition(event){
  intersects = [];

  //calculates mouse 2d position on canvas (0,0) is center
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  mousePosition.x = ( x/ renderer.domElement.offsetWidth )  * 2 - 1;
  mousePosition.y = - ( y /renderer.domElement.offsetHeight )  * 2 + 1;

  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(scene.children, true);

  let buildingId = intersects[0].object.name;
  
  removeSelectedBuilding(buildingId);
}

function removeSelectedBuilding(buildingId) {
  buildManager.removeBuilding(buildingId);
}


export function setMouseFunction(functionality) {
  //TODO: probably a better way to remove the listeners
  container.removeEventListener('mousedown',addBuildingOnMouseClick,false);
  container.addEventListener('mousedown',removeBuildingAtMousePosition,false);

  document.getElementById('addBuildingSettings').classList.add('grayOut');
  switch (functionality) {
    case 'addBuilding':
      document.getElementById('addBuildingSettings').classList.remove('grayOut');
      container.addEventListener('mousedown',addBuildingOnMouseClick,false)
      break;
    case 'removeBuilding':
      container.addEventListener('mousedown',removeBuildingAtMousePosition,false)
      break;
    default:
      break;
  }
}
window.setMouseFunction = setMouseFunction;