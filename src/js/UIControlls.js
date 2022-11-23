// import { setTimeOfDay } from "./index";

function toggleElement(element){
    element.classList.toggle("hideItem")
}

function showHome(){
    document.getElementById('editButton').classList.remove('menuItemSelected');
    document.getElementById('homeButton').classList.add('menuItemSelected');
    let container = document.getElementById('inputs');
    for( const child of container.children){
        child.classList.add("hideItem")
    }
    document.getElementById('home').classList.toggle('hideItem');
}

function showEdit(){
    document.getElementById('homeButton').classList.remove('menuItemSelected');
    document.getElementById('editButton').classList.add('menuItemSelected');
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


