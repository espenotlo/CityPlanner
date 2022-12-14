import { Vector3, Raycaster, Mesh, BufferGeometry, BufferAttribute, MeshPhongMaterial, OneMinusDstAlphaFactor } from "three";
import { World } from "../world.js";
import { Building } from "./building.js";
export class BuildManager {
    scene;
    world;
    index;
    map;
    buildings;
    landmarkMarker;
    defaultMarkerPos;
    switchDirection;

    constructor(scene, world) {
        this.scene = scene;
        this.world = world;
        this.index = 1;
        this.map = new Map();
        this.buildings = [];
        this.landmarkMarker = this.getMarker();
        this.switchDirection = false;
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
            if (building.isLandmark) {
                this.landmarkMarker.position.set(positionXOffset, positionZ * 2 + 10, positionYOffset);
                this.defaultMarkerPos = new Vector3(positionXOffset, positionZ * 2 + 10, positionYOffset);
                this.scene.add(this.landmarkMarker);
            }

            //Maps building to index, and marks all tiles with the given index
            this.map.set(this.index, building);
            this.occupyTile(positionX, positionY, width, depth, this.index)
            this.index++;
            this.buildings.push(building);
        } else {
            console.log("Cannot place building here")
        }
    }

    addBuildingFromMesh(mesh, isLandmark) {
        let x = [];
        let y = [];
        let z = [];
        let array = mesh.geometry.attributes.position.array;
        for (let i = 0; i < array.length; i++) {
            //console.log(array[i]);
            if (i%3 == 1) {
                y.push(array[i]);
            } else if (i%3 == 2) {
                x.push(array[i]);
            } else {
                z.push(array[i]);
            }
        }
        let width = Math.ceil((Math.max(...x) - Math.min(...x)) / 10);
        let height = Math.ceil((Math.max(...y) - Math.min(...y)) / 10);
        let depth = Math.ceil((Math.max(...z) - Math.min(...z)) / 10);
        
        const building = new Building(width, height, depth, mesh.material, isLandmark);

        let buildingx = ((mesh.position.x - this.world.posOffset) / 10) - (width - 1) / 2;
        let buildingy = ((mesh.position.z - this.world.posOffset) / 10) - (depth - 1) / 2;
        this.addBuilding(building, buildingx, buildingy);
    }

    removeBuilding(buildingID){
        const toBeRemoved = this.map.get(buildingID)
        if(toBeRemoved != null) {
            if (toBeRemoved.isLandmark) this.scene.remove(this.landmarkMarker);
            this.world.removeBuilding(buildingID);
            this.scene.remove(toBeRemoved.cube);
            this.buildings.splice(this.buildings.findIndex(obj => {
                return obj === toBeRemoved;
            },1));
        } else {
            console.log("Building with ID " + buildingID + " doesn't exist!")
        }
    }

    clearBuildings() {
        for (let i = 1; i < this.index; i++) this.removeBuilding(i);
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

    getMarker() {
        const geometry = new BufferGeometry();
        const vertices = new Float32Array([
             1.0,  1.0,  0.3, //front
            -1.0,  1.0,  0.3,
             0.0, -1.0,  0.0,

             -1.0,  1.0, -0.3, // back
              1.0,  1.0, -0.3,
              0.0, -1.0,  0.0,

              1.0,  1.0, -0.3, // right
              1.0,  1.0,  0.3,
              0.0, -1.0,  0.0,

             -1.0,  1.0,  0.3, // left
             -1.0,  1.0, -0.3,
              0.0, -1.0,  0.0,

             -1.0,  1.0, -0.3, //top-left
             -1.0,  1.0,  0.3,
              1.0,  1.0,  0.3,

              1.0,  1.0,  0.3, //top-right
              1.0,  1.0, -0.3,
             -1.0,  1.0, -0.3,
        ]);
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        const material = new MeshPhongMaterial( {color: 0x20ff20, shininess: 50, emissive: 0x008800} );
        const mesh = new Mesh(geometry, material);
        mesh.name = "marker";
        mesh.scale.addScalar(1.5);
        return mesh;
    }

    animateMarker() {
        let increment = 0.05;
        let pos = this.landmarkMarker.position;
        if (pos.y >= this.defaultMarkerPos.y + 3 || pos.y <= this.defaultMarkerPos.y - 3) this.switchDirection = !this.switchDirection;
        if (this.switchDirection) increment = -increment;
        pos.set(pos.x, pos.y + increment, pos.z);
    }

    // Returns the degree of visibility (0-1) from given building to the landmark.
    getVisibilityToLandmark(building) {
        let landmark = this.getLandmark();
        if (building === landmark) return 1;

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
                        } else if (intersects[0].object === building.cube && intersects.length > 1 && intersects[1].object.position === landmark.cube.position) {
                            hits++;
                        }
                    }
                    total++;
                }
            }
        }
        return hits / total;
    }

    // Calculates the sky exposure for a given building.
    getSkyExposure(building) {
        let buildmeshes = [];
        this.buildings.forEach(function(building) {
            buildmeshes.push(building.cube);
        });
        
        let totalRays = 0;
        let skyHits = 0;
        let raycaster = new Raycaster();
        raycaster.far = 30;                 // Maximum distance of rays.
        let intersects;
        let origin = building.position;
        let direction = new Vector3();
        for (let r = 0; r < 2 * Math.PI; r += Math.PI / 10) {
            direction.x = Math.sin(r);
            direction.z = Math.cos(r);
            for (let v = Math.PI / 10; v < Math.PI / 2; v += Math.PI / 10) {
                direction.x *= Math.cos(v);
                direction.z *= Math.cos(v);
                direction.y = Math.sin(v);
                raycaster.set(origin, direction.normalize());
                intersects = raycaster.intersectObjects(buildmeshes, false);

                if (intersects.length === 0) {
                    skyHits++;
                }
                totalRays++;
            }
        }
        return skyHits / totalRays;
    }
}