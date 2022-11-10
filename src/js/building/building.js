class Building {
    cube;
    planeOffset = 0.2;
    heightOffset;
    width;
    depth;
    constructor(width, height, depth, material) {
        this.width = width;
        this.depth = depth;
        this.heightOffset = height / 2;
        let geometry = new THREE.BoxGeometry(width - this.planeOffset, height, depth - this.planeOffset);
        this.cube = new THREE.Mesh(geometry, material);
    }
}