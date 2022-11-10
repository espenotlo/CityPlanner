export class Building {
    constructor(width, height, depth, material) {
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let cube = new THREE.Mesh(geometry, material);
    }


}