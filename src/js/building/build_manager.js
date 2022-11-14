import { Vector3 } from "three";
import { World } from "../world.js";
export class BuildManager {
    scene;
    world;
    index;
    map;

    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.index = 1;
        this.map = new Map();
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
            this.scene.add(building.cube);

            //Maps building to index, and marks all tiles with the given index
            this.map.set(this.index, building);
            this.occupyTile(positionX, positionY, width, depth, this.index)
            this.index++;
        } else {
            console.log("Cannot place building here")
        }
    }

    removeBuilding(buildingID){
        const toBeRemoved = this.map.get(buildingID)
        if(toBeRemoved != null) {
            this.scene.remove(toBeRemoved.cube);
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


}