import { GPS } from "../gps/gps";
import { StandandGPS } from "../gps/standard-gps";
import Node from "./node";

export default class NodesController {
  private nodeSet: any;

  async getNodes() {
    if(!this.nodeSet) {
      this.nodeSet = await this.startNodes();
    }
    return Object.values(this.nodeSet);
  }

  private async startNodes() {
    return new Promise<[any, Node[][][]]>((resolve) => {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://raw.githubusercontent.com/brunorrr/gta-sanandreas-gps-map/main/data-gps/GPS.dat",
        true
      );
      request.send(null);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var type = request.getResponseHeader("Content-Type");
          const nodeSet:any = {};
          if (type.indexOf("text") !== 1) {
            const lines: string[] = request.responseText.split('\n');
            lines.shift();
            lines.forEach(line => {
              const lineData = line.split(' ');
              if (lineData.shift() === "0") {
                const [x, y, z, _ignore, id] = lineData;
                nodeSet[id] = new Node(+id, +x, +y, +z, []);
              } else if(lineData.length === 3) {
                const [from, to, _direction] = lineData;
                nodeSet[from].next.push(nodeSet[to]);
              }
            });
          }
          const gps: GPS = new StandandGPS();
          console.log(gps.getShortestPathBetweenNodes(nodeSet[51], nodeSet[257]));
          resolve(nodeSet);
        }
      };
    });
  }
}
