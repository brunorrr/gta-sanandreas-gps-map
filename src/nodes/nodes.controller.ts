import Node from "./node";

function processNodes(data: string) {
  const nodeSet: any = {};

  const lines: string[] = data.split('\r\n');
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
  return nodeSet;
}

export default function getNodes(callback: Function) {
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://raw.githubusercontent.com/GRGServer/SAMP/master/scriptfiles/GPS.dat",
    true
  );
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState === 4 && request.status === 200) {
      var type = request.getResponseHeader("Content-Type");
      if (type.indexOf("text") !== 1) {
        callback(processNodes(request.responseText));
      }
    }
  };
}


