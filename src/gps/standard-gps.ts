import Node from "../nodes/node";
import { GPS } from "./gps";

class NodeWithDistance {
  node: Node;
  oDist: number;
  dDist: number;
  previous: NodeWithDistance | undefined
}

export class StandandGPS implements GPS {
  getShortestPathBetweenNodes(origin: Node, destin: Node): Node[] {
    if(origin === destin) {
      return [];
    }
    let openList: NodeWithDistance[] = [{
      node: origin,
      oDist: 0,
      dDist: this.getDistanceBetweenNodes(origin, destin),
      previous: undefined
    }];
    const closedMap: any = {};

    while(openList.length > 0) {
      const current = openList.shift();
      if(current.node === destin) {
        return this.findPath(current);
      }

      closedMap[current.node.id] = current;
      const neighbors = this.getAvailableNeighbors(current, openList, closedMap, origin, destin);
      neighbors.forEach((eachNeighbor: NodeWithDistance) => openList = this.binaryInsert(eachNeighbor, openList));
    }
  }

  private getDistanceBetweenNodes(nodeA: Node, nodeB: Node): number {
    return Math.sqrt(Math.pow(nodeA.x - nodeB.x, 2) + Math.pow(nodeA.y - nodeB.y, 2));
  }

  private getAvailableNeighbors(node: NodeWithDistance, openList: NodeWithDistance[], closedMap: any, origin: Node, destin: Node): NodeWithDistance[] {
    return node.node.next.filter((eachNode: Node) => {
      return !this.binarySearch(eachNode, openList) &&
        !closedMap[eachNode.id];
    }).map((nextNode: Node) => <NodeWithDistance>({
      node: nextNode,
      oDist: this.getDistanceBetweenNodes(nextNode, origin),
      dDist: this.getDistanceBetweenNodes(nextNode, destin),
      previous: node
    }));
  }

  private binarySearch(node: Node, list: NodeWithDistance[]) {
    let start=0, end= list.length-1;
    
    while (start<=end){
 
        const mid=Math.floor((start + end)/2);
  
        if (list[mid].node ===node) {
          return true;
        }
 
        else if (list[mid].node < node)
             start = mid + 1;
        else
             end = mid - 1;
    }
  
    return false;
  }

  private binaryInsert(node: NodeWithDistance, list: NodeWithDistance[]) {
    for(let i = 1 ; i < list.length ; i++) {
      if(list[i].dDist + list[i].oDist >= node.dDist + node.oDist) {
        list.splice(i, 0, node);
        return list;
      }
    }
    list.push(node);
    return list;
  }

  private findPath(node: NodeWithDistance): Node[] {
    const path = [];
    while(node.previous !== undefined) {
      path.unshift(node.node);
      node = node.previous;
    }
    return path;
  }
}