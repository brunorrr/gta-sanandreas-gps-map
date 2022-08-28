import Node from "../nodes/node";
import NodeUtilsGRG from "../utils/node-utils-grg";
import { NodeUtils } from "../utils/node-utils.interface";
import NodesController from "../nodes/nodes.controller";

export default class Map {

  private zoomFocus: [number, number] = [8,8];
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
    this.createZoomEvent();
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
    debugger;
    this.nodesController.getNodes(
      this.nodeUtils.convertLongitudeToSamp(this.mapLimits.startX, this.ctx.canvas.width),
      this.nodeUtils.convertLatitudeToSamp(this.mapLimits.startY, this.ctx.canvas.height),
      this.nodeUtils.convertLongitudeToSamp(this.mapLimits.endX, this.ctx.canvas.width),
      this.nodeUtils.convertLatitudeToSamp(this.mapLimits.endY, this.ctx.canvas.height))
    .then((nodes: Node[]) => {
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

  private createZoomEvent(): void {
    addEventListener('mousemove', (e: MouseEvent) => {
      const posLeft = Math.min(Math.max(e.clientX - this.ctx.canvas.getBoundingClientRect().left, 0), this.ctx.canvas.width) / this.ctx.canvas.width;
      const posTop = Math.min(Math.max(e.clientY - this.ctx.canvas.getBoundingClientRect().top, 0), this.ctx.canvas.height) / this.ctx.canvas.height;
      this.zoomFocus = [
        this.getRelativePos(posLeft, this.mapLimits.startX, this.mapLimits.endX, this.ctx.canvas.width),
        this.getRelativePos(posTop, this.mapLimits.startY, this.mapLimits.endY, this.ctx.canvas.height)
      ];
    });
    addEventListener('wheel', (e: WheelEvent) => {
      if(e.deltaY !== 0) {
        e.stopPropagation();
        this.setZoom(e.deltaY > 0);
      }
    });
  }

  private setZoom(increase: boolean) {
    const rate = 200 * (increase ? 1 : -1);

    this.mapLimits.startX += this.zoomFocus[0] * rate;
    this.mapLimits.startY += this.zoomFocus[1] * rate;
    this.mapLimits.endX -= ((1 - this.zoomFocus[0]) * rate);
    this.mapLimits.endY -= ((1 - this.zoomFocus[1]) * rate);
    this.checkMapLimitsInBound();
    this.drawBackground();
  }

  private checkMapLimitsInBound() {
    this.mapLimits.startX = Math.min(this.mapLimits.startX, 0);
    this.mapLimits.startY = Math.min(this.mapLimits.startY, 0);
    this.mapLimits.endX = Math.max(this.mapLimits.endX, this.ctx.canvas.width + Math.abs(this.mapLimits.startX));
    this.mapLimits.endY = Math.max(this.mapLimits.endY, this.ctx.canvas.height + Math.abs(this.mapLimits.startY));
  }

  private getRelativePos(pos: number, relativeStart: number, relativeEnd: number, boardSize: number) {
    const backgroundSize = relativeEnd - relativeStart;
    const proportion = boardSize / backgroundSize;
    return (pos * proportion) + Math.abs(relativeStart) / backgroundSize
  }
}