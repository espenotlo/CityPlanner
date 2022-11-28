import { Vector3, Raycaster } from "three";
import { World } from "../world.js";
export class BuildManager {
    scene;
    world;
    index;
    map;
    buildings;

    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.index = 1;
        this.map = new Map();
        this.buildings = [];
    }


    checkValidPosition(building, positionX, positionY, width, depth) {
        for (let x = positionX; x < (positionX + width); x++){
            for (let y = positionY; y < (positionY + depth); y++){
                if(!this.world.isEmptyLot(x,y))
                {
                    return false;
                }
            }
        }
        return true;
    }

    addBuilding(building, positionX, positionY) {
        let width = building.width;
        let depth = building.depth;

        if (this.checkValidPosition(building, positionX, positionY, width, depth)) {

            //Defines world position for object in scene
            let positionZ = building.heightOffset * 10;
            let positionXOffset = (positionX + (width - 1) / 2) * 10 + this.world.posOffset;
            let positionYOffset = (positionY + (depth - 1) / 2) * 10 + this.world.posOffset;
            building.cube.position.set(positionXOffset, positionZ, positionYOffset);
            building.cube.name = this.index;
            this.scene.add(building.cube);

            //Maps building to index, and marks all tiles with the given index
            this.map.set(this.index, building);
            this.occupyTile(positionX, positionY, width, depth, this.index)
            this.index++;
            this.buildings.push(building);
        } else {
            console.log("Cannot place building here")
        }
    }

    removeBuilding(buildingID){
        const toBeRemoved = this.map.get(buildingID)
        if(toBeRemoved != null) {
            this.world.removeBuilding(buildingID);
            this.scene.remove(toBeRemoved.cube);
            console.log(toBeRemoved);
            this.buildings.splice(this.buildings.findIndex(obj => {
                return obj === toBeRemoved;
            },1));
        } else {
            console.log("Building with ID " + buildingID + " doesn't exist!")
        }
    }


    occupyTile(positionX, positionY, width, depth, index) {
        for (let x = positionX; x < (positionX + width); x++){
            for (let y = positionY; y < (positionY + depth); y++){
                this.world.setBuildingAt(index,x,y)
            }
        }
    }

    getLandmark() {
        for (let i = 0; i < this.buildings.length; i++) {
            if (this.buildings[i].isLandmark) {
                return this.buildings[i];
            }
        }
        return null;
    }

    // Returns the degree of visibility (0-1) from given building to the landmark.
    getVisibilityToLandmark(building) {
        let landmark = this.getLandmark();

        let x = building.cube.position.x;
        let y = building.cube.position.y;
        let z = building.cube.position.z;

        let buildmeshes = [];
        this.buildings.forEach(function(building) {
            buildmeshes.push(building.cube);
        });

        let hits = 0.0;
        let total = 0.0;
        let raycaster = new Raycaster();
        let intersects;
        let origin = new Vector3();
        let direction = new Vector3();

        // For every position of the building - cast a ray towards the target. 
        for (let y1 = y - (building.heightOffset * 10); y1 <= y + (building.heightOffset * 10); y1+= 2) {
            for (let x1 = x - (building.width * 5); x1 <= x + (building.width * 5); x1+= building.depth * 5) {
                for (let z1 = z - (building.depth * 5); z1 <= z + (building.depth * 5); z1+= building.depth * 5) {
                    origin.set(x1,y1,z1);
                    let targetHeight = (landmark.cube.position.y + landmark.heightOffset) * (y1 / (y+building.heightOffset))

                    raycaster.set(origin, direction.subVectors(new Vector3(landmark.cube.position.x, targetHeight, landmark.cube.position.z), origin).normalize());
            
                    intersects = raycaster.intersectObjects(buildmeshes, false);
            
                    if (intersects.length > 0) {
                        if (intersects[0].object.position === landmark.cube.position) {
                            hits++;
                        }
                    }
                    total++;
                }
            }
        }
        return hits / total;
    }
}