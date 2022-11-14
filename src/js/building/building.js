import * as THREE from 'three';
export class Building {
    cube;
    planeOffset = 0.2;
    heightOffset;
    width;
    depth;
    constructor(width, height, depth, material) {
        this.width = width;
        this.depth = depth;
        this.heightOffset = height / 2;
        let geometry = new THREE.BoxGeometry((width - this.planeOffset)*10, height*10, (depth - this.planeOffset)*10);
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
    }
}