import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js";
import { GLTFExporter } from "https://unpkg.com/three@0.146.0/examples/jsm/exporters/GLTFExporter.js";
import { GLTFLoader } from "https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js";
import { Sky } from "https://unpkg.com/three@0.146.0/examples/jsm/objects/Sky.js";

import { World } from "./world.js";
import { BuildManager } from "./building/build_manager.js";
import { Building } from "./building/building.js";
import {
  DirectionalLightHelper,
  Vector3,
  Mesh,
  MeshPhongMaterial,
  Raycaster,
  SphereGeometry,
} from "three";

// Controller for index.html
let camera, scene, renderer;
let sky, sun, sunlight, ambience, world, buildManager, plane;
let mousePosition, rayCaster;
let intersects = [];
let time = 8;
let speed = 1;
let skyChanged, timeChanged;
let passTime = true;

//container for the scene
const container = document.getElementById("canvas");

const worldCellGroup = new THREE.Group();

//link for downloading
const link = document.createElement("a");

init();

function initWorld() {
  let planeGeo = new SphereGeometry(1000);
  planeGeo.scale(1, 0.0005, 1);
  let planeMat = new MeshPhongMaterial({ color: 0x806050 });
  planeMat.shininess = 0;
  plane = new Mesh(planeGeo, planeMat);
  plane.position.set(0, -1, 0);
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);

  world = new World(11);
  let worldCellMeshes = world.getCellMeshes();

  worldCellMeshes.forEach((mesh) => {
    worldCellGroup.add(mesh);
  });
  scene.add(worldCellGroup);
}

function initBuildings() {
  buildManager = new BuildManager(scene, world);
  // Materials
  const brown = new THREE.MeshPhongMaterial({ color: 0x45290a });
  const brick = new THREE.MeshPhongMaterial({ color: 0xf85321b });
  const darkGrey = new THREE.MeshPhongMaterial({ color: 0x1f1e1e });
  const lightGrey = new THREE.MeshPhongMaterial({ color: 0x737070 });

  // Buildings
  const building1 = new Building(1, 1, 1, brown, true);
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
  sky.scale.setScalar(450000);
  scene.add(sky);

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
  ambience = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.05);
  scene.add(ambience);

  // Sky controller:
  const effectController = {
    turbidity: 20,
    rayleigh: 1,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: -Math.cos(time / 3.82) * 40 + 10,
    azimuth: 180 - (180 * time) / 12,
    exposure: renderer.toneMappingExposure,
  };

  timeChanged = function () {
    effectController.elevation = -Math.cos(time / 3.82) * 40 + 10;
    effectController.azimuth = 180 - (180 * time) / 12;
  };

  skyChanged = function () {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);
    sunlight.position.setFromSphericalCoords(100, phi, theta);
    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(scene, camera);
  };
  skyChanged();
}

function init() {
  camera = new THREE.PerspectiveCamera(
    60,
    container.offsetWidth / container.offsetHeight,
    1,
    2000000
  );
  camera.position.set(75, 75, 75);

  scene = new THREE.Scene();

  const helper = new THREE.GridHelper(110, 1, 0xffffff, 0xffffff);
  scene.add(helper);

  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("canvas").appendChild(renderer.domElement);

  mousePosition = new THREE.Vector2();
  rayCaster = new THREE.Raycaster();


  // Camera controller
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.enableZoom = true;
  controls.enablePan = false;

  initSky();
  initWorld();
  initBuildings();

  //Heatmap raycasting test
  getHeatmap(sunlight);
  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.offsetWidth, container.offsetHeight);
}
// Animation
function animate() {
  if (passTime) {
    time += 0.01 * speed;
  }
  buildManager.animateMarker();
  timeChanged();
  skyChanged();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

function toggleAnimation() {
  passTime = !passTime;
  document.getElementById("timeOfDay").classList.toggle("grayOut");
}

//Set time of day to a specific value;
export function setTimeOfDay(value) {
  time = Number(value);
  renderer.render(scene, camera);
}
window.setTimeOfDay = setTimeOfDay;

function updateMousePosition(event) {
  //calculates mouse 2d position on canvas (0,0) is center
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  mousePosition.x = (x / renderer.domElement.offsetWidth) * 2 - 1;
  mousePosition.y = -(y / renderer.domElement.offsetHeight) * 2 + 1;
}

function getMouseWorldPosition(event) {
  intersects = [];

  updateMousePosition(event);

  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(worldCellGroup.children, true);
  if (intersects.length < 1) return;
  let xPos = Math.abs(Math.round(intersects[0].point.x / 10 + 5));
  let zPos = Math.abs(Math.round(intersects[0].point.z / 10 + 5));
  return { xPos, zPos };
}

function addBuildingOnMouseClick(event) {
  event.preventDefault();

  let position = getMouseWorldPosition(event);
  let building = createBuilding();
  if (position != null) {
    buildManager.addBuilding(building, position.xPos, position.zPos);
  }
}

function createBuilding() {
  let settings = getBuildingSettings();
  document.getElementById("isLandmark").checked = false;

  let material = createMaterialFromName(settings.textureOfBuilding);

  return new Building(
    settings.widthOfBuilding,
    settings.heightOfBuilding,
    settings.depthOfBuilding,
    material,
    settings.isLandmark
  );
}

function createMaterialFromName(name) {
  let color;
  switch (name) {
    case "brown":
      color = { color: 0x45290a };
      break;
    case "brick":
      color = { color: 0xf85321b };
      break;
    case "darkGrey":
      color = { color: 0x1f1e1e };
      break;
    case "lightGrey":
      color = { color: 0x737070 };
      break;
    default:
      console.log("No valid color");
      break;
  }
  return new THREE.MeshPhongMaterial(color);
}

function removeBuildingAtMousePosition(event) {
  intersects = [];

  updateMousePosition(event);

  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(scene.children, true);

  let buildingId = intersects[0].object.name;

  removeSelectedBuilding(buildingId);
}

function removeSelectedBuilding(buildingId) {
  buildManager.removeBuilding(buildingId);
}

function saveScene() {
  const exporter = new GLTFExporter();

  const params = {
    trs: false,
    onlyVisible: false,
    binary: false,
    maxTextureSize: 4096,
  };
  const options = {
    trs: params.trs,
    onlyVisible: params.onlyVisible,
    binary: params.binary,
    maxTextureSize: params.maxTextureSize,
  };

  exporter.parse(
    scene,
    function (result) {
      if (result instanceof ArrayBuffer) {
        saveArrayBuffer(result, "scene.glb");
      } else {
        const output = JSON.stringify(result, null, 2);
        saveString(output, "scene.gltf");
      }
    },
    function (error) {
      console.log("An error happened during parsing", error);
    },
    options
  );
}

function saveArrayBuffer(buffer, fileName) {
  save(new Blob([buffer], { type: "application/octet-stream" }), fileName);
}
function save(blob, fileName) {
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
function saveString(text, filename) {
  save(new Blob([text], { type: "text/plain" }), filename);
}

function uploadFileAndLoad() {
  showFileUpload();
}

function checkLandmarkVisibility(event) {
  intersects = [];

  updateMousePosition(event);

  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(scene.children, true);
  if (intersects.length < 1) return;
  let building = null;
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name != "") {
      building = buildManager.map.get(intersects[i].object.name);
      break;
    }
  }
  if (building == null) return;
  let visibility = buildManager.getVisibilityToLandmark(building);

  showLandmarkVisibility(visibility);
}

// The level of sky-exposure at cursor location.
function checkSkyExposure(event) {
  intersects = [];

  updateMousePosition(event);

  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(scene.children, true);
  if (intersects < 1) return;
  let building = null;
  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.name != "") {
      building = intersects[i].object;
    }
  }
  if (building == null) return;
  console.dir(building);
  showSkyExposure(buildManager.getSkyExposure(building));
}

let prevValue = null;
let prevPrevValue = null; // used to unselect current mode in button is pressed again
export function selectedEditMode(functionality) {
  //TODO: probably a better way to remove the listeners
  container.removeEventListener("mousedown", addBuildingOnMouseClick, false);
  container.removeEventListener(
    "mousedown",
    removeBuildingAtMousePosition,
    false
  );
  container.removeEventListener("mousedown", checkLandmarkVisibility, false);
  container.removeEventListener("mousedown", checkSkyExposure, false);

  hideLandmarkVisibility();
  document.getElementById("addBuildingSettings").classList.add("grayOut");
  if (functionality != prevValue || prevValue === prevPrevValue) {
    switch (functionality) {
      case "addBuilding":
        document
          .getElementById("addBuildingSettings")
          .classList.remove("grayOut");
        container.addEventListener("mousedown", addBuildingOnMouseClick, false);
        showCurrentMode("Add building");
        break;
      case "removeBuilding":
        container.addEventListener(
          "mousedown",
          removeBuildingAtMousePosition,
          false
        );
        showCurrentMode("Remove building");
        break;
      case "toggleAnimation":
        toggleAnimation();
        break;
      case "loadScene":
        uploadFileAndLoad();
        break;
      case "saveScene":
        saveScene();
        break;
      case "checkVisibility":
        container.addEventListener("mousedown", checkLandmarkVisibility, false);
        showCurrentMode("Check landmark visibility");
        break;
      case "checkSkyExposure":
        container.addEventListener("mousedown", checkSkyExposure, false);
        showCurrentMode("Get sky exposure");
        break;
      default:
        break;
    }
  } else {
    showCurrentMode("none");
  }
  prevPrevValue = prevValue;
  prevValue = functionality;
}
window.selectedEditMode = selectedEditMode;

function selectLandmarkBox() {
  if (buildManager.getLandmark() != null) {
    document.getElementById("isLandmark").checked = false;
    let infoText = document
      .getElementById("isLandmarkInfo")
      .appendChild(document.createTextNode("Landmark already exist"));
    setTimeout(function () {
      infoText.remove();
    }, 2000);
  }
}
window.selectLandmarkBox = selectLandmarkBox;

function getHeatmap(light) {
  renderer.render(scene, camera);
  let meshes = [];
  //buildManager.buildings.forEach(building => meshes.push(building.cube));
  meshes.push(...worldCellGroup.children);
  //meshes.push(plane);
  let colorArray = [];
  let rayStart = light.position;
  for (let x = -15; x <= 15; x++) {
    let colorRow = [];
    for (let y = -15; y <= 15; y++) {
      let des = new Vector3(x, y, 0.0);
      colorRow.push(shootRay(rayStart, des, meshes));
    }
    colorArray.push(colorRow);
  }
  drawHeatmap(colorArray);
}

function drawHeatmap(colors) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");
  let pixSize = 8;
  console.log(colors);
  console.log(colors[0]);
  for (let x = 0; x < colors.length; x++) {
    let col = colors[x];
    for (let y = 0; y < col.length; y++) {
      console.log("rgb(" + col[y].r + ",", col[y].g + ",", col[y].b + ")");
      (context.fillStyle = "rgb(" + col[y].r + ","),
        col[y].g + ",",
        col[y].b + ")";
      context.fillRect(y * pixSize, x * pixSize, pixSize, pixSize);
    }
  }
  document.getElementById("heatmap").appendChild(canvas);
}

function drawHeatmap2(colors) {
  const canvas = new HTMLCanvasElement();
  // set the width and height of the canvas

  // get the 2D rendering context of the canvas
  const context = canvas.getContext("2d");

  let newArray = [];
  colors.forEach((color) => {
    newArray.push(color.r * 255);
    newArray.push(color.r * 255);
    newArray.push(color.r * 255);
    newArray.push(0);
  });
  console.log(newArray.length);
  console.log(newArray);
  let testArray = Array.apply(null, Array(961 * 4)).map(
    Number.prototype.valueOf,
    1
  );

  const imageData = new ImageData(new Uint8ClampedArray(testArray), 31, 31);

  context.putImageData(imageData, 0, 0);

  document.getElementById("heatmap").appendChild(canvas);
}

function shootRay(rayStart, rayEnd, mesh) {
  rayCaster.set(rayStart, rayEnd.clone().sub(rayStart).normalize());

  // Check if the ray intersects with the mesh or the other object
  const intersections = rayCaster.intersectObjects(mesh);

  if (intersections.length > 0) {
    let mesh = intersections[0].object;
    // If it's the mesh, check if the geometry is a PlaneGeometry
    if (mesh.geometry instanceof THREE.PlaneGeometry) {
      // If it's a PlaneGeometry, set the color to the color at the intersection point
      return {
        r: mesh.material.color.r * 255,
        g: mesh.material.color.g * 255,
        b: mesh.material.color.b * 255,
      };
    } else {
      // If it's the other object, set the color to black
      return { r: 0, g: 0, b: 0 };
      //return new THREE.Color(0,0,0);
    }
  }
}

function loadFile() {
  const file = document.getElementById("file").files[0];
  let loader = new GLTFLoader();
  let url = URL.createObjectURL(file);
  loader.load(url, (gltf) => {
    scene = gltf.scene;
    renderer.render(scene, camera);
  });
}
window.loadFile = loadFile;

// Calculates the light intensity at mouse screen position.
function getLightIntensityAtMouse(event){
  var rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  mousePosition.x = (x / renderer.domElement.offsetWidth) * 2 - 1;
  mousePosition.y = -(y / renderer.domElement.offsetHeight) * 2 + 1;

  // get the luminance of the texture of the object at mouse position
  rayCaster.setFromCamera(mousePosition, camera);
  intersects = rayCaster.intersectObjects(scene.children, true);
  if (intersects.length < 1) return;
  let color = intersects[0].object.material.color;

  let sourceLuminance =
    0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;

  // get the luminance of the pixel at mouse position
  var offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = rect.width;
  offscreenCanvas.height = rect.height;
  var ctx = offscreenCanvas.getContext("2d");
  ctx.drawImage(
    renderer.domElement,
    -0 * offscreenCanvas.width,
    -0 * offscreenCanvas.height,
    rect.width,
    rect.height
  );
  var imageData = ctx.getImageData(x, y, 1, 1);
  var c = imageData.data;
  c = [c[0], c[1], c[2]];
  var luminance =
    (0.2126 * c[0]) / 255 + 0.7152 * (c[1] / 255) + 0.0722 * (c[2] / 255);
  // console.log("luminance: " + luminance / sourceLuminance);
  let LightValue = Math.round(Math.min(luminance / sourceLuminance, 1) *100);
  console.log(LightValue);
  let element = document.getElementById('progressBar')
  element.style.width = LightValue + '%';
  element.innerHTML = LightValue + '%';

}
window.getLightIntensityAtMouse = getLightIntensityAtMouse;

container.addEventListener("mousedown", getLightIntensityAtMouse, false);
