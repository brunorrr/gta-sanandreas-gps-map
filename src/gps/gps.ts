import Node from "../nodes/node";

export interface GPS {
  getShortestPathBetweenNodes(origin: Node, destin: Node): Node[];
}