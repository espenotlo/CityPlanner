class World {
  
  //Creates a world represented by a grid structure. row size and column size defined by parameter 'size'.
  constructor(size) {
    this.size = size;
    this.columns = [];
    for (let y = 0; y < size; y++) {
      if ((y+1)%4 === 0) {
        this.columns.push(Array(size).fill(-1));
      } else {
        let row = Array(size);
        for (let x = 0; x < size; x++) {
          if ((x+1)%4 === 0) {
            // Road = -1
            row[x] = -1;
          } else if ([4,5,6].includes(y) && [4,5,6].includes(x)) {
            // Park = -2
            row[x] = -2;
          } else {
            // Empty lot = null
            row[x] = null;
          }
        }
        this.columns.push(row);
      }
    }
  }
  // Returns true if the given coordinates are within the bounds of the world.
  isOutOfBounds = function(x,y) {
    return x >= this.size || y >= this.size || x < 0 || y < 0;
  }
  // Returns true if a road exists at the given coordinates.
  isRoad = function(x,y) {
    if (this.isOutOfBounds(x,y)) return false;
    return this.columns[y][x] === -1;
  }
  // Returns true if the park is at the given coordinates.
  isPark = function(x,y) {
    if (this.isOutOfBounds(x,y)) return false;
    return this.columns[y][x] === -2;
  }
  // Returns true if the given coordinates point to a construction lot.
  isLot = function(x,y) {
    if (this.isOutOfBounds(x,y) || this.isRoad(x,y) || this.isPark(x,y)) return false;
    return true;
  }
  // Returns true if the given coordinates point to an empty construction lot.
  isEmptyLot = function(x,y) {
    if (!this.isLot(x,y)) return false;
    return this.columns[y][x] === null;
  }
  // Returns true if a building exsists at the given coordinates.
  isBuilding = function(x,y) {
    if (!this.isLot(x,y)) return false;
    return this.columns[y][x] !== null;
  }
  // Returns the mesh of the building at the given coordinates, or null if no building exists there.
  getBuildingAt = function(x,y) {
    if (!this.isBuilding(x,y)) return null;
    return this.columns[y][x];
  }
  // Places a building mesh at the given coordinates, if they are valid. 
  // Returns true on success, or false on failure.
  setBuildingAt = function(building,x,y) {
    if (this.isEmptyLot(x,y)) {
      this.columns[y][x] = building;
      return true;
    } else {
      return false;
    }
  }
  // Returns an array containing the meshes of all the cells in the world (IE. the ground meshes).
  getCellMeshes = function() {
    const lotMaterial = new THREE.MeshLambertMaterial({color: 0x404060});
    const roadMaterial = new THREE.MeshLambertMaterial({color: 0x202020});
    const parkMaterial = new THREE.MeshLambertMaterial({color: 0x207020});
    let cellGeometry = new THREE.PlaneGeometry(1,1);
    let worldMeshes = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cellMaterial;
        if (this.isLot(x,y)) {
          cellMaterial = lotMaterial;
        } else if (this.isRoad(x,y)) {
          cellMaterial = roadMaterial;
        } else {
          cellMaterial = parkMaterial;
        }
        let mesh = new THREE.Mesh(cellGeometry, cellMaterial);
        mesh.position.x = x;
        mesh.position.y = 0;
        mesh.position.z = y;
        mesh.rotateX(-1.5708);
        worldMeshes.push(mesh);
      }
    }
    return worldMeshes;
  }
  // Returns an array containing the meshes of all buildings in the world.
  getBuildingMeshes = function() {
    let buildingMeshes = [];
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isBuilding(x,y)) {
          buildingMeshes.push(this.columns[y][x]);
        }
      }
    }
    return buildingMeshes;
  }
}