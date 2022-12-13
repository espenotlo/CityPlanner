// import { setTimeOfDay } from "./index";

function toggleElement(element){
    element.classList.toggle("hideItem")
}

function showHome(){
    document.getElementById('editButton').classList.remove('menuItemSelected');
    document.getElementById('homeButton').classList.add('menuItemSelected');

    document.getElementById('selectedMode').classList.add('hideItem');
    let container = document.getElementById('inputs');
    for( const child of container.children){
        child.classList.add("hideItem")
    }
    document.getElementById('home').classList.toggle('hideItem');
    document.getElementById("canvas").addEventListener("mouseup", setSelectedPoint,false);
}

function showEdit(){
    document.getElementById('homeButton').classList.remove('menuItemSelected');
    document.getElementById('editButton').classList.add('menuItemSelected');

    document.getElementById('selectedMode').classList.remove('hideItem');
    let container = document.getElementById('inputs');
    for( const child of container.children){
        child.classList.add("hideItem")
    }
    document.getElementById('editMode').classList.toggle('hideItem');
    document.getElementById("canvas").removeEventListener("mouseup", setSelectedPoint,false);
    console.log();

}


function getBuildingSettings() {
    let widthOfBuilding = parseInt(document.getElementById('settingsWidth').value);
    let heightOfBuilding = parseInt(document.getElementById('settingsHeight').value);
    let depthOfBuilding = parseInt(document.getElementById('settingsDepth').value);
    let textureOfBuilding = document.getElementById('textures').value;
    let isLandmark = document.getElementById("isLandmark").checked

    return({widthOfBuilding, heightOfBuilding, depthOfBuilding, textureOfBuilding, isLandmark});    
}
window.getBuildingSettings = getBuildingSettings;


function showLandmarkVisibility(visibility) {
    let canvas = document.getElementById('canvas');
    let element = document.getElementById('landmarkVisibilityOverlay');
    if (typeof(element) != 'undefined' && element != null) {
        element.classList.remove('hideItem');
        element.innerHTML = 'Landmark visibility: '+ visibility.toFixed(3);
        element.id = 'landmarkVisibilityOverlay';
    } else {
        let containerDiv = document.createElement('div');

        containerDiv.innerHTML = 'Landmark visibility: '+ visibility.toFixed(3);
        containerDiv.id = 'landmarkVisibilityOverlay';
    
        canvas.appendChild(containerDiv);
    }
}
window.showLandmarkVisibility = showLandmarkVisibility;

function showSkyExposure(exposure) {
    let canvas = document.getElementById('canvas');
    let element = document.getElementById('landmarkVisibilityOverlay');
    if (typeof(element) != 'undefined' && element != null) {
        element.classList.remove('hideItem');
        element.innerHTML = 'Sky exposure: '+ exposure.toFixed(3)*100 + '%';
        element.id = 'landmarkVisibilityOverlay';
    } else {
        let containerDiv = document.createElement('div');

        containerDiv.innerHTML = 'Landmark visibility: '+ exposure.toFixed(3)*100 + '%';
        containerDiv.id = 'landmarkVisibilityOverlay';
    
        canvas.appendChild(containerDiv);
    }
}
window.showSkyExposure = showSkyExposure;

function hideLandmarkVisibility() {
    let element = document.getElementById('landmarkVisibilityOverlay');
    if (typeof(element) != 'undefined' && element != null) {
        element.classList.add('hideItem');
    }
}
window,hideLandmarkVisibility = hideLandmarkVisibility


function showCurrentMode(mode) {

    let element = document.getElementById('selectedMode')
    if (typeof(element) != 'undefined' && element != null) {
        element.innerHTML = 'Selected mode: ' + mode;
    }
}
window.showCurrentMode = showCurrentMode;


function showFileUpload() {
    let canvas = document.getElementById('canvas');
    let element = document.getElementById('landmarkVisibilityOverlay');
    if (typeof(element) != 'undefined' && element != null) {
        element.classList.remove('hideItem');
        element.innerHTML = '<p><input type="file" name="scene" id="file")"><button type="submit" onclick=loadFile()>Upload file</button></p>'
        element.id = 'landmarkVisibilityOverlay';
    } else {
        let containerDiv = document.createElement('div');
        containerDiv.innerHTML = '<p><input type="file" name="scene" id="file"><button type="submit" onclick=loadFile()>Upload file</button></p>'
        containerDiv.id = 'landmarkVisibilityOverlay';
    
        canvas.appendChild(containerDiv);
    }
}
window.showFileUpload = showFileUpload;

