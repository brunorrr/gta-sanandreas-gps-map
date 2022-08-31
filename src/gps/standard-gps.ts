import Node from "../nodes/node";
import { GPS } from "./gps";

class NodeWithDistance {
  node: Node;
  distanceToOrigin: number;
  distanceToDestin: number;
  previous: Node
}

export class StandandGPS implements GPS {
  getShortestPathBetweenNodes(origin: Node, destin: Node): Node[] {
    if(origin === destin) {
      return [];
    }
    const straightPath: number = Math.sqrt(Math.pow(origin.x - destin.x, 2) + Math.pow(origin.y - destin.y, 2));
    let openSet: any = {};
    openSet[origin.id] = [{
      node: origin,
      distanceOrigin: 0,
      distanceDestin: straightPath
    }];
    let walkedPath: any = {};
    
    while(openSet.length > 0) {
      const currNode: any = Object.values(openSet).reduce((a:any, c:any) => c.distanceDestin + c.distanceOrigin < a.distanceDestin + a.distanceOrigin ? c : a);

      if(currNode.node === destin) {
        break;
      }

      delete openSet[currNode.node.id];
      currNode.node.next.forEach((eachNeighbor: Node) => {
        const distToDestin = this.getDistanceBetweenNodes(eachNeighbor, destin),
          distToOrigin = this.getDistanceBetweenNodes(eachNeighbor, origin);
        if(distToDestin + distToOrigin < currNode.node.distanceToOrigin + currNode.node.distanceToDestin) {
          walkedPath[eachNeighbor.id] = currNode;
          
        }
      })
    }
  }

  getDistanceBetweenNodes(nodeA: Node, nodeB: Node): number {
    return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
  }
}