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
}

function getBuildingSettings() {
    let widthOfBuilding = parseInt(document.getElementById('settingsWidth').value);
    let heightOfBuilding = parseInt(document.getElementById('settingsHeight').value);
    let depthOfBuilding = parseInt(document.getElementById('settingsDepth').value);
    let textureOfBuilding = document.getElementById('textures').value;

    return({widthOfBuilding, heightOfBuilding, depthOfBuilding, textureOfBuilding});    
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


