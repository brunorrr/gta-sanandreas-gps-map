import Node from "../nodes/node";
import getNodes from "../nodes/nodes.controller";
import NodeUtils from "../utils/node.utils";

export default class Map {

  private nodeUtils: NodeUtils;
  private zoom:number =  1;
  private backgroundImage: HTMLImageElement;

  constructor(
    private ctx: CanvasRenderingContext2D,
    ) {
    this.nodeUtils = new NodeUtils();
    this.drawBackground();
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
    debugger;
    this.ctx.drawImage(this.backgroundImage, 0, 0, this.ctx.canvas.width * this.zoom, this.ctx.canvas.height * this.zoom);
    this.drawNodes();
  }

  private drawNodes() {
    getNodes((nodesMap: any) => {
      Object.entries(nodesMap).forEach(([_key, node]: [string, Node]) => {
        this.ctx.fillStyle = this.nodeUtils.getColorFromAltitude(node.z);
        this.ctx.beginPath();
        this.ctx.arc(
          this.nodeUtils.convertLongitudeFromSamp(node.x, this.ctx.canvas.width),
          this.nodeUtils.convertLatitudeFromSamp(node.y, this.ctx.canvas.height),
          2, 0, 2 * Math.PI);
        this.ctx.fill();
        this.drawEdges(node);
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
    addEventListener('wheel', (e: WheelEvent) => {
      if(e.deltaY !== 0) {
        if(e.deltaY > 0) {
          this.zoom -= e.deltaY * 0.0001;
          this.zoom = Math.max(this.zoom, 1);
        }
        else {
          this.zoom += Math.abs(e.deltaY) * 0.0001;
          this.zoom = Math.min(this.zoom, 20);
        }
        this.setZoom();
      }
    });
  }

  private setZoom() {
    this.drawBackground();
  }
}