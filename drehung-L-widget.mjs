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
  labelText.textContent = "θ:";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = "360";
  slider.step = "5";
  slider.value = "45";
  slider.style.width = "320px";

  const valueText = document.createElement("span");
  valueText.textContent = "45°";
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
    "-3.3 -3.3 6.6 6.6"
  );

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "540");

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
    width = 0.018,
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
  // Koordinatensystem
  // --------------------------------------------------

  const gridGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  for (let x = -3; x <= 3; x++) {

    const vertical = createLine(
      x,
      -3,
      x,
      3,
      "#d0d0d0",
      0.012
    );

    gridGroup.appendChild(vertical);

    if (x !== 0) {
      gridGroup.appendChild(
        createText(
          x,
          -0.18,
          String(x),
          0.14
        )
      );
    }
  }


  for (let y = -3; y <= 3; y++) {

    const horizontal = createLine(
      -3,
      y,
      3,
      y,
      "#d0d0d0",
      0.012
    );

    gridGroup.appendChild(horizontal);

    if (y !== 0) {
      gridGroup.appendChild(
        createText(
          -0.18,
          y,
          String(y),
          0.14
        )
      );
    }
  }

  // x-Achse
  gridGroup.appendChild(
    createLine(
      -3,
      0,
      3,
      0,
      "currentColor",
      0.025
    )
  );

  // y-Achse
  gridGroup.appendChild(
    createLine(
      0,
      -3,
      0,
      3,
      "currentColor",
      0.025
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
    "0.035"
  );

  original.setAttribute(
    "stroke-dasharray",
    "0.10 0.07"
  );

  svg.appendChild(original);

  // --------------------------------------------------
  // Dynamische rotierte Form
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

  const rotatedLegend =
    document.createElement("span");

  rotatedLegend.innerHTML =
    '<span style="display:inline-block;width:25px;border-top:2px solid #4F81BD;margin-right:6px;vertical-align:middle;"></span>Rotiert';

  legend.appendChild(originalLegend);
  legend.appendChild(rotatedLegend);

  container.appendChild(legend);

  // --------------------------------------------------
  // Ausgabe der Rotationsmatrix
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

    const theta =
      Number(slider.value);

    valueText.textContent =
      `${theta}°`;

    const thetaRad =
      theta * Math.PI / 180;

    const c =
      Math.cos(thetaRad);

    const s =
      Math.sin(thetaRad);

    // transformierte Punkte

    const rotatedL =
      L.map(
        point => {

          const x = point[0];
          const y = point[1];

          return [
            c * x - s * y,
            s * x + c * y
          ];
        }
      );

    // --------------------------------------------------
    // Rotierte L-Form
    // --------------------------------------------------

    const polygon =
      document.createElementNS(
        svgNS,
        "polygon"
      );

    polygon.setAttribute(
      "points",
      pointsToString(rotatedL)
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
      "0.04"
    );

    dynamicGroup.appendChild(polygon);

    // --------------------------------------------------
    // Winkelbogen
    // --------------------------------------------------

    const radius = 0.65;

    let pathData = "";

    const steps =
      Math.max(
        2,
        Math.round(theta / 3)
      );

    for (
      let i = 0;
      i <= steps;
      i++
    ) {

      const angle =
        thetaRad *
        i /
        steps;

      const x =
        radius *
        Math.cos(angle);

      const y =
        radius *
        Math.sin(angle);

      pathData +=
        `${i === 0 ? "M" : "L"} ${x} ${-y} `;
    }

    const arc =
      document.createElementNS(
        svgNS,
        "path"
      );

    arc.setAttribute(
      "d",
      pathData
    );

    arc.setAttribute(
      "fill",
      "none"
    );

    arc.setAttribute(
      "stroke",
      "#4F81BD"
    );

    arc.setAttribute(
      "stroke-width",
      "0.035"
    );

    dynamicGroup.appendChild(arc);

    // --------------------------------------------------
    // Winkelbeschriftung
    // --------------------------------------------------

    const thetaMiddle =
      thetaRad / 2;

    const angleText =
      createText(
        0.9 * Math.cos(thetaMiddle),
        0.9 * Math.sin(thetaMiddle),
        `θ = ${theta}°`,
        0.17
      );

    dynamicGroup.appendChild(angleText);

    // --------------------------------------------------
    // Titel
    // --------------------------------------------------

    const title =
      createText(
        0,
        3.0,
        `Drehung der L-Form um θ = ${theta}°`,
        0.22
      );

    dynamicGroup.appendChild(title);

    // --------------------------------------------------
    // Rotationsmatrix anzeigen
    // --------------------------------------------------

    information.textContent =
`Rotationsmatrix:

R = [ ${c.toFixed(3)}   ${(-s).toFixed(3)} ]
    [ ${s.toFixed(3)}    ${c.toFixed(3)} ]`;
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