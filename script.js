const stations = ["Rajiv Chowk","Kashmere Gate","AIIMS","Saket", "Lajpat Nagar", "Central Secretariat"];

const metroMap = {
  "Rajiv Chowk-Kashmere Gate": { route: ["Rajiv Chowk", "Kashmere Gate"], fare: 30, time: 12 },
  "Rajiv Chowk-AIIMS": { route: ["Rajiv Chowk", "Central Secretariat", "AIIMS"], fare: 40, time: 18 },
  "AIIMS-Saket": { route: ["AIIMS", "Saket"], fare: 20, time: 10 }
};

const sourceSelect = document.getElementById("Source");
const destinationSelect = document.getElementById("Destination");

stations.forEach(station => {
  const opt1 = document.createElement("option");
  opt1.value = opt1.textContent = station;
  const opt2 = opt1.cloneNode(true);
  sourceSelect.appendChild(opt1);
  destinationSelect.appendChild(opt2);
});

function findRoute() {
  const source = sourceSelect.value;
  const destination = destinationSelect.value;
  const resultDiv = document.getElementById("result");
  const svgRouteDiv = document.getElementById("svgRoute");

  svgRouteDiv.innerHTML = ""; // Clear previous SVG

  if (!source) {
    resultDiv.textContent = "Source not selected";
    return;
  } else if (!destination) {
    resultDiv.textContent = "Destination not selected";
    return;
  } else if (source === destination) {
    resultDiv.textContent = "Source and Destination are the same.";
    return;
  }

  const key = `${source}-${destination}`;
  const reverseKey = `${destination}-${source}`;
  const routeData = metroMap[key] || metroMap[reverseKey];

  if (!routeData) {
    resultDiv.textContent = "No route found for this pair. Try a different one.";
    return;
  }

  // Display route text
  resultDiv.innerHTML = `
    <strong style="color: red;">
    Route: ${routeData.route.join(" → ")} <br>
    Estimated Fare: ₹${routeData.fare} <br>
    Time: ${routeData.time} min
    </strong>
  `;

  // Draw SVG route
  const path = routeData.route;
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", path.length * 130);
  svg.setAttribute("height", "100");

  path.forEach((station, index) => {
    const x = 80 + index * 120;

    // Circle (station)
    const circle = document.createElementNS(svgNS, "circle");
    //circle.setAttribute("fill", "#ffcc00"); // yellow line, or red, etc.
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", 40);
    circle.setAttribute("r", 15);
    circle.setAttribute("fill", "#ff1000");
    svg.appendChild(circle);

    // Station name text
    const label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", x);
    label.setAttribute("y", 75);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "12");
    label.textContent = station;
    svg.appendChild(label);

    // Line to next station
    if (index < path.length - 1) {
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", x + 15);
      line.setAttribute("y1", 40);
      line.setAttribute("x2", x + 105);
      line.setAttribute("y2", 40);
      line.setAttribute("stroke", "#333");
      line.setAttribute("stroke-width", 2);
      svg.appendChild(line);
    }
  });

  svgRouteDiv.appendChild(svg);
}
