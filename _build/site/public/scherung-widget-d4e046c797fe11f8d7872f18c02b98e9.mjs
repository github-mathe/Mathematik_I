function render({ el }) {

  const container = document.createElement("div");
  container.style.maxWidth = "700px";
  container.style.width = "100%";

  // --------------------------------------------------
  // Slider
  // --------------------------------------------------

  const controls = document.createElement("div");
  controls.style.marginBottom = "15px";

  const label = document.createElement("label");
  label.style.display = "flex";
  label.style.alignItems = "center";
  label.style.gap = "10px";

  const labelText = document.createElement("strong");
  labelText.textContent = "h:";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "-2.0";
  slider.max = "2.0";
  slider.step = "0.1";
  slider.value = "0.5";
  slider.style.width = "320px";

  const valueText = document.createElement("span");
  valueText.textContent = "0.5";
  valueText.style.minWidth = "55px";

  label.appendChild(labelText);
  label.appendChild(slider);
  label.appendChild(valueText);

  controls.appendChild(label);
  container.appendChild(controls);

  // --------------------------------------------------
  // SVG-Zeichenfläche
  // --------------------------------------------------

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute(
    "viewBox",
    "-5.3 -3.3 10.6 4.6"
  );

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "520");

  svg.style.display = "block";

  container.appendChild(svg);

  // --------------------------------------------------
  // Hilfsfunktionen
  // --------------------------------------------------

  function createLine(
    x1,
    y1,
    x2,
    y2,
    stroke = "black",
    width = 0.025,
    dash = null
  ) {

    const line = document.createElementNS(
      svgNS,
      "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", -y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", -y2);

    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", width);

    if (dash !== null) {
      line.setAttribute(
        "stroke-dasharray",
        dash
      );
    }

    return line;
  }


  function createText(
    x,
    y,
    text,
    size = 0.18,
    anchor = "middle"
  ) {

    const element =
      document.createElementNS(
        svgNS,
        "text"
      );

    element.setAttribute("x", x);
    element.setAttribute("y", -y);

    element.setAttribute(
      "font-size",
      size
    );

    element.setAttribute(
      "text-anchor",
      anchor
    );

    element.setAttribute(
      "dominant-baseline",
      "middle"
    );

    element.setAttribute(
      "fill",
      "currentColor"
    );

    element.textContent = text;

    return element;
  }


  function pointsToString(points) {

    return points
      .map(
        point =>
          `${point[0]},${-point[1]}`
      )
      .join(" ");
  }

  // --------------------------------------------------
  // Koordinatensystem
  // --------------------------------------------------

  const gridGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  for (let x = -5; x <= 5; x++) {

    const vertical = createLine(
      x,
      -1,
      x,
      3,
      "#d0d0d0",
      0.015
    );

    gridGroup.appendChild(vertical);

    if (x !== 0) {
      gridGroup.appendChild(
        createText(
          x,
          -0.23,
          String(x),
          0.15
        )
      );
    }
  }


  for (let y = -1; y <= 3; y++) {

    const horizontal = createLine(
      -5,
      y,
      5,
      y,
      "#d0d0d0",
      0.015
    );

    gridGroup.appendChild(horizontal);

    if (y !== 0) {
      gridGroup.appendChild(
        createText(
          -0.23,
          y,
          String(y),
          0.15
        )
      );
    }
  }

  // x-Achse
  gridGroup.appendChild(
    createLine(
      -5,
      0,
      5,
      0,
      "currentColor",
      0.03
    )
  );

  // y-Achse
  gridGroup.appendChild(
    createLine(
      0,
      -1,
      0,
      3,
      "currentColor",
      0.03
    )
  );

  svg.appendChild(gridGroup);

  // --------------------------------------------------
  // Punkte der ursprünglichen L-Form
  // --------------------------------------------------

  const L = [
    [0.0, 0.0],
    [0.0, 2.0],
    [0.4, 2.0],
    [0.4, 0.4],
    [1.4, 0.4],
    [1.4, 0.0],
    [0.0, 0.0]
  ];

  // --------------------------------------------------
  // Originale L-Form
  // --------------------------------------------------

  const original =
    document.createElementNS(
      svgNS,
      "polyline"
    );

  original.setAttribute(
    "points",
    pointsToString(L)
  );

  original.setAttribute(
    "fill",
    "none"
  );

  original.setAttribute(
    "stroke",
    "#666666"
  );

  original.setAttribute(
    "stroke-width",
    "0.05"
  );

  original.setAttribute(
    "stroke-dasharray",
    "0.12 0.09"
  );

  svg.appendChild(original);

  // --------------------------------------------------
  // Dynamische gescherte Form
  // --------------------------------------------------

  const dynamicGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  svg.appendChild(dynamicGroup);

  // --------------------------------------------------
  // Legende
  // --------------------------------------------------

  const legend =
    document.createElement("div");

  legend.style.display = "flex";
  legend.style.gap = "25px";
  legend.style.marginTop = "8px";
  legend.style.marginBottom = "12px";

  const originalLegend =
    document.createElement("span");

  originalLegend.innerHTML =
    '<span style="display:inline-block;width:25px;border-top:2px dotted #666666;margin-right:6px;vertical-align:middle;"></span>Original';

  const shearedLegend =
    document.createElement("span");

  shearedLegend.innerHTML =
    '<span style="display:inline-block;width:25px;border-top:2px solid #4F81BD;margin-right:6px;vertical-align:middle;"></span>Geschert';

  legend.appendChild(originalLegend);
  legend.appendChild(shearedLegend);

  container.appendChild(legend);

  // --------------------------------------------------
  // Ausgabe der Scherungsmatrix
  // --------------------------------------------------

  const information =
    document.createElement("div");

  information.style.marginTop = "12px";
  information.style.fontFamily = "monospace";
  information.style.whiteSpace = "pre";
  information.style.fontSize = "15px";

  container.appendChild(information);

  // --------------------------------------------------
  // Aktualisierung
  // --------------------------------------------------

  function update() {

    dynamicGroup.replaceChildren();

    const h =
      Number(slider.value);

    valueText.textContent =
      h.toFixed(1);

    // Scherungsmatrix:
    // [1 h]
    // [0 1]

    const shearedL =
      L.map(
        point => {

          const x = point[0];
          const y = point[1];

          return [
            x + h * y,
            y
          ];
        }
      );

    // --------------------------------------------------
    // Gescherte L-Form
    // --------------------------------------------------

    const polygon =
      document.createElementNS(
        svgNS,
        "polygon"
      );

    polygon.setAttribute(
      "points",
      pointsToString(shearedL)
    );

    polygon.setAttribute(
      "fill",
      "#4F81BD"
    );

    polygon.setAttribute(
      "fill-opacity",
      "0.18"
    );

    polygon.setAttribute(
      "stroke",
      "#4F81BD"
    );

    polygon.setAttribute(
      "stroke-width",
      "0.05"
    );

    dynamicGroup.appendChild(polygon);

    // --------------------------------------------------
    // Titel
    // --------------------------------------------------

    const title =
      createText(
        0,
        2.75,
        `Scherung der L-Form mit h = ${h.toFixed(1)}`,
        0.24
      );

    dynamicGroup.appendChild(title);

    // --------------------------------------------------
    // Scherungsmatrix anzeigen
    // --------------------------------------------------

    information.textContent =
`Scherungsmatrix:

H = [ 1.0   ${h.toFixed(1)} ]
    [ 0.0   1.0 ]`;
  }

  slider.addEventListener(
    "input",
    update
  );

  // --------------------------------------------------
  // Widget einfügen und sofort starten
  // --------------------------------------------------

  el.appendChild(container);

  update();
}

export default { render };