export default class Node {
    id: number;
    x: number;
    y: number;
    z: number;
    next: Node[];

    constructor(id: number, x: number, y: number, z: number, next: Node[]) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.next = next;
    }
}