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
  labelText.textContent = "s:";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0.2";
  slider.max = "3.0";
  slider.step = "0.1";
  slider.value = "1.5";
  slider.style.width = "320px";

  const valueText = document.createElement("span");
  valueText.textContent = "1.5";
  valueText.style.minWidth = "50px";

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
    "-0.6 -5.2 5.8 5.8"
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
    width = 0.015,
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
    size = 0.16,
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
  // Koordinatensystem und Gitter
  // --------------------------------------------------

  const gridGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  for (let x = 0; x <= 5; x++) {

    gridGroup.appendChild(
      createLine(
        x,
        -0.5,
        x,
        5,
        "#d0d0d0",
        0.008
      )
    );

    gridGroup.appendChild(
      createText(
        x,
        -0.28,
        String(x),
        0.13
      )
    );
  }


  for (let y = 0; y <= 5; y++) {

    gridGroup.appendChild(
      createLine(
        -0.5,
        y,
        5,
        y,
        "#d0d0d0",
        0.008
      )
    );

    if (y !== 0) {
      gridGroup.appendChild(
        createText(
          -0.18,
          y,
          String(y),
          0.13
        )
      );
    }
  }

  // x-Achse
  gridGroup.appendChild(
    createLine(
      -0.5,
      0,
      5,
      0,
      "currentColor",
      0.018
    )
  );

  // y-Achse
  gridGroup.appendChild(
    createLine(
      0,
      -0.5,
      0,
      5,
      "currentColor",
      0.018
    )
  );

  svg.appendChild(gridGroup);

  // --------------------------------------------------
  // Originale L-Form
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
    "0.025"
  );

  original.setAttribute(
    "stroke-dasharray",
    "0.08 0.06"
  );

  svg.appendChild(original);

  // --------------------------------------------------
  // Dynamische skalierte Form
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

  const scaledLegend =
    document.createElement("span");

  scaledLegend.innerHTML =
    '<span style="display:inline-block;width:25px;border-top:2px solid #4F81BD;margin-right:6px;vertical-align:middle;"></span>Skaliert';

  legend.appendChild(originalLegend);
  legend.appendChild(scaledLegend);

  container.appendChild(legend);

  // --------------------------------------------------
  // Ausgabe der Skalierungsmatrix
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

    const s =
      Number(slider.value);

    valueText.textContent =
      s.toFixed(1);

    const scaledL =
      L.map(
        point => [
          s * point[0],
          s * point[1]
        ]
      );

    // gefüllte skalierte Form

    const polygon =
      document.createElementNS(
        svgNS,
        "polygon"
      );

    polygon.setAttribute(
      "points",
      pointsToString(scaledL)
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
      "0.03"
    );

    dynamicGroup.appendChild(polygon);

    // Titel

    const title =
      createText(
        2.4,
        4.7,
        `Skalierung der L-Form mit s = ${s.toFixed(1)}`,
        0.20
      );

    dynamicGroup.appendChild(title);

    // Skalierungsmatrix

    information.textContent =
`Skalierungsmatrix:

S = [ ${s.toFixed(1)}   0.0 ]
    [ 0.0   ${s.toFixed(1)} ]`;
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