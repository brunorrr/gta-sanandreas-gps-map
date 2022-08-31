import Node from "../nodes/node";
import NodeUtilsGRG from "../utils/node-utils-grg";
import { NodeUtils } from "../utils/node-utils.interface";
import NodesController from "../nodes/nodes.controller";

export default class Map {

  private mapLimits: {startX: number, startY: number, endX: number, endY: number};
  private backgroundImage: HTMLImageElement;
  private nodeUtils: NodeUtils;
  private nodesController: NodesController;

  constructor(
      private ctx: CanvasRenderingContext2D) {
    (<any> global).ctx = this;
    this.nodeUtils = new NodeUtilsGRG();
    this.nodesController = new NodesController();
    this.downloadBackground();
  }

  private downloadBackground() {
    const image = new Image();
    image.src = '../assets/map.jpg';
    image.onload = () => {
      this.backgroundImage = image;
      this.drawBackground();
    };
  }

  private drawBackground() {
    if(!this.mapLimits) {
      this.mapLimits = {
        startX: 0,
        startY: 0,
        endX: this.ctx.canvas.width,
        endY: this.ctx.canvas.height
      };
    }
    this.ctx.drawImage(
      this.backgroundImage,
      this.mapLimits.startX,
      this.mapLimits.startY,
      this.mapLimits.endX,
      this.mapLimits.endY
    );
    this.drawNodes();
  }

  private drawNodes() {
    this.nodesController.getNodes().then((nodes: Node[]) => {
      nodes.forEach((eachNode: Node) => {
        this.ctx.fillStyle = this.nodeUtils.getColorFromAltitude(eachNode.z);
        this.ctx.beginPath();
        this.ctx.arc(
          this.nodeUtils.convertLongitudeFromSamp(eachNode.x, this.ctx.canvas.width),
          this.nodeUtils.convertLatitudeFromSamp(eachNode.y, this.ctx.canvas.height),
          2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.drawEdges(eachNode);
      });
    });
  }

  private drawEdges(node: Node) {
    this.ctx.strokeStyle = this.nodeUtils.getColorFromAltitude(node.z);

    node.next.forEach(eachEdge => {
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.nodeUtils.convertLongitudeFromSamp(node.x, this.ctx.canvas.width),
        this.nodeUtils.convertLatitudeFromSamp(node.y, this.ctx.canvas.height));
      this.ctx.lineTo(
        this.nodeUtils.convertLongitudeFromSamp(eachEdge.x, this.ctx.canvas.width),
        this.nodeUtils.convertLatitudeFromSamp(eachEdge.y, this.ctx.canvas.height));
      this.ctx.stroke();
    });
  }

}