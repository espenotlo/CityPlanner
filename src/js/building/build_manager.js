class BuildManager {
    scene;
    world;

    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
    }


    checkValidPosition(building, positionX, positionY, width, depth) {
        for (let x = positionX; x < (positionX + width); x++){
            for (let y = positionY; y < (positionY + depth); y++){
                if(!world.isEmptyLot(x,y))
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
            let positionZ = building.heightOffset;
            let positionXOffset = positionX + (width - 1) / 2;
            let positionYOffset = positionY + (depth - 1) / 2;
            building.cube.position.set(positionXOffset, positionZ, positionYOffset);
            scene.add(building.cube);
        } else {
            console.log("Cannot place building here")
        }
    }


}