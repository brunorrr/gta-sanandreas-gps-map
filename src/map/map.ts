import Node from "../nodes/node";
import NodeUtilsGRG from "../utils/node-utils-grg";
import { NodeUtils } from "../utils/node-utils.interface";
import NodesController from "../nodes/nodes.controller";
import { StandandGPS } from "../gps/standard-gps";
import { GPS } from "../gps/gps";

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
    this.resetCanvas();
  }

  highlightNode(id: number) {
    this.resetCanvas(() => {
      this.nodesController.getNodes().then((nodeSet: any) => {
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#03fc56';
        this.ctx.lineWidth = 5;
        this.ctx.arc(
          this.nodeUtils.convertLongitudeFromSamp(nodeSet[id].x, this.ctx.canvas.width),
          this.nodeUtils.convertLongitudeFromSamp(nodeSet[id].x, this.ctx.canvas.width),
          30, 0, 2 * Math.PI);
        this.ctx.stroke();
      });
    });
  }

  findRoute(idOrigin: number, idDestin: number) {
    this.resetCanvas(() => {
      this.nodesController.getNodes().then((nodeSet: any) => {
        const GPS = new StandandGPS();
        const path = GPS.getShortestPathBetweenNodes(nodeSet[idOrigin], nodeSet[idDestin]);
        this.drawCustomNodes(path, 'red');
      })
    });
  }

  private resetCanvas(callback: Function = undefined) {
    this.downloadBackground(() => {
      this.drawNodes();
      if(callback) {
        callback();
      }
    });
  }

  private downloadBackground(callback: Function = undefined) {
    const image = new Image();
    image.src = '../assets/map.jpg';
    image.onload = () => {
      this.backgroundImage = image;
      this.drawBackground();
      if(callback) {
        callback();
      }
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
  }

  private drawNodes() {
    this.nodesController.getNodes().then((nodes: Node[]) => {
      nodes.forEach((eachNode: Node) => {
        this.ctx.fillStyle = this.nodeUtils.getColorFromAltitude(eachNode.z);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(
          this.nodeUtils.convertLongitudeFromSamp(eachNode.x, this.ctx.canvas.width),
          this.nodeUtils.convertLatitudeFromSamp(eachNode.y, this.ctx.canvas.height),
          2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.drawEdges(eachNode, this.ctx.fillStyle);
      });
    });
  }

  private drawCustomNodes(nodes: Node[], color: string) {
    nodes.forEach((eachNode: Node) => {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(
        this.nodeUtils.convertLongitudeFromSamp(eachNode.x, this.ctx.canvas.width),
        this.nodeUtils.convertLatitudeFromSamp(eachNode.y, this.ctx.canvas.height),
        2, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  private drawEdges(node: Node, color: string) {
    this.ctx.strokeStyle = color;

    node.next.forEach(eachEdge => {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
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