import Node from "./node";

export default class NodesController {
  private matrix: Node[][][];
  private nodeSet: any;
  private nodeSetCollection: any = {};

  async getNodes(startX: number, startY: number, endX: number, endY: number) {
    if(!this.nodeSet) {
      [this.nodeSet, this.matrix] = await this.startNodes();
    }
    console.log(this.matrix.filter((each:Node[][]) => each.length > 0));
    return new Promise<Node[]>((resolve) => {
      const startXFloor = Math.floor(startX), startYFloor = Math.floor(startY), endXFloor = Math.floor(endX), endYFloor = Math.floor(endY);
      if(!this.nodeSetCollection[`${startXFloor}${startYFloor}${endXFloor}${endYFloor}`]) {
        let filteredNodes: Node[] = [];
        for(let row = startYFloor + 3000 ; row < endYFloor + 3000 ; row++) {
          for(let col = startXFloor + 3000 ; col < endXFloor + 3000 ; col++) {
            if(this.matrix[row][col].length > 0) {
              filteredNodes = filteredNodes.concat(this.matrix[row][col]);
            }
          }
        }
        this.nodeSetCollection[`${startXFloor}${startYFloor}${endXFloor}${endYFloor}`] = filteredNodes;
      }
      resolve(this.nodeSetCollection[`${startXFloor}${startYFloor}${endXFloor}${endYFloor}`])
    });
  }

  private async startNodes() {
    return new Promise<[any, Node[][][]]>((resolve) => {
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://raw.githubusercontent.com/GRGServer/SAMP/master/scriptfiles/GPS.dat",
        true
      );
      request.send(null);
      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          var type = request.getResponseHeader("Content-Type");
          const nodeSet:any = {}, matrix:Node[][][] = Array(6000).fill(Array(6000).fill([]));
          if (type.indexOf("text") !== 1) {
            const lines: string[] = request.responseText.split('\r\n');
            lines.shift();
            lines.forEach(line => {
              const lineData = line.split(' ');
              if (lineData.shift() === "0") {
                const [x, y, z, _ignore, id] = lineData;
                nodeSet[id] = new Node(+id, +x, +y, +z, []);
                console.log(Math.floor(nodeSet[id].y) + 3000);
                matrix[3000 - Math.floor(nodeSet[id].y)][Math.floor(nodeSet[id].x) + 3000].push(nodeSet[id]);
              } else if(lineData.length === 3) {
                const [from, to, _direction] = lineData;
                nodeSet[from].next.push(nodeSet[to]);
              }
            });
          }
          resolve([nodeSet, matrix]);
        }
      };
    });
  }
}
