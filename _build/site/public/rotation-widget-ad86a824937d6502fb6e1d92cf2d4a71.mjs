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
  slider.step = "1";
  slider.value = "45";

  slider.style.width = "320px";

  const valueText = document.createElement("span");
  valueText.textContent = "45°";
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
    "-1.45 -1.45 2.9 2.9"
  );

  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "500");

  svg.style.border = "1px solid #dddddd";
  svg.style.background = "white";

  container.appendChild(svg);

  // --------------------------------------------------
  // Hilfsfunktionen
  // --------------------------------------------------

  function createLine(x1, y1, x2, y2, width = 0.008) {

    const line = document.createElementNS(
      svgNS,
      "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", -y1);

    line.setAttribute("x2", x2);
    line.setAttribute("y2", -y2);

    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", width);

    return line;
  }


  function createText(x, y, text, size = 0.09) {

    const element = document.createElementNS(
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
      "middle"
    );

    element.setAttribute(
      "dominant-baseline",
      "middle"
    );

    element.setAttribute(
      "fill",
      "black"
    );

    element.textContent = text;

    return element;
  }


  function createArrow(
    x1,
    y1,
    x2,
    y2,
    color
  ) {

    const group = document.createElementNS(
      svgNS,
      "g"
    );

    const line = document.createElementNS(
      svgNS,
      "line"
    );

    line.setAttribute("x1", x1);
    line.setAttribute("y1", -y1);

    line.setAttribute("x2", x2);
    line.setAttribute("y2", -y2);

    line.setAttribute(
      "stroke",
      color
    );

    line.setAttribute(
      "stroke-width",
      "0.025"
    );

    group.appendChild(line);

    // Pfeilspitze

    const angle = Math.atan2(
      y2 - y1,
      x2 - x1
    );

    const size = 0.10;

    const p1x =
      x2 -
      size *
      Math.cos(angle - Math.PI / 6);

    const p1y =
      y2 -
      size *
      Math.sin(angle - Math.PI / 6);

    const p2x =
      x2 -
      size *
      Math.cos(angle + Math.PI / 6);

    const p2y =
      y2 -
      size *
      Math.sin(angle + Math.PI / 6);

    const polygon =
      document.createElementNS(
        svgNS,
        "polygon"
      );

    polygon.setAttribute(
      "points",
      `
      ${x2},${-y2}
      ${p1x},${-p1y}
      ${p2x},${-p2y}
      `
    );

    polygon.setAttribute(
      "fill",
      color
    );

    group.appendChild(polygon);

    return group;
  }

  // --------------------------------------------------
  // statisches Koordinatensystem
  // --------------------------------------------------

  svg.appendChild(
    createLine(
      -1.35,
      0,
      1.35,
      0
    )
  );

  svg.appendChild(
    createLine(
      0,
      -1.35,
      0,
      1.35
    )
  );

  // Gitter

  const gridValues = [
    -1,
    -0.5,
    0.5,
    1
  ];

  gridValues.forEach(value => {

    const vertical = createLine(
      value,
      -1.3,
      value,
      1.3,
      0.004
    );

    vertical.setAttribute(
      "stroke",
      "#cccccc"
    );

    svg.appendChild(vertical);


    const horizontal = createLine(
      -1.3,
      value,
      1.3,
      value,
      0.004
    );

    horizontal.setAttribute(
      "stroke",
      "#cccccc"
    );

    svg.appendChild(horizontal);

  });

  // --------------------------------------------------
  // dynamische Gruppe
  // --------------------------------------------------

  const dynamicGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  svg.appendChild(dynamicGroup);

  // --------------------------------------------------
  // Text unterhalb
  // --------------------------------------------------

  const information =
    document.createElement("div");

  information.style.marginTop = "15px";
  information.style.fontFamily = "monospace";
  information.style.whiteSpace = "pre";

  container.appendChild(information);

  // --------------------------------------------------
  // Aktualisierung
  // --------------------------------------------------

  function update() {

    dynamicGroup.replaceChildren();

    const theta =
      Number(slider.value);

    const thetaRad =
      theta * Math.PI / 180;

    valueText.textContent =
      `${theta}°`;

    // Ausgangsvektor

    const vx = 1;
    const vy = 0;

    // Rotation

    const vxNeu =
      Math.cos(thetaRad);

    const vyNeu =
      Math.sin(thetaRad);

    // Ausgangsvektor

    dynamicGroup.appendChild(
      createArrow(
        0,
        0,
        vx,
        vy,
        "#555555"
      )
    );

    // rotierter Vektor

    dynamicGroup.appendChild(
      createArrow(
        0,
        0,
        vxNeu,
        vyNeu,
        "#4F81BD"
      )
    );

    // Beschriftung v

    dynamicGroup.appendChild(
      createText(
        1.12,
        -0.08,
        "v",
        0.11
      )
    );

    // Beschriftung v'

    dynamicGroup.appendChild(
      createText(
        1.12 * vxNeu,
        1.12 * vyNeu,
        "v′",
        0.11
      )
    );

    // --------------------------------------------------
    // Winkelbogen
    // --------------------------------------------------

    const radius = 0.35;

    let pathData = "";

    const steps = Math.max(
      2,
      Math.round(theta / 2)
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
      "0.018"
    );

    dynamicGroup.appendChild(arc);

    // Winkeltext

    const thetaMiddle =
      thetaRad / 2;

    dynamicGroup.appendChild(
      createText(
        0.52 *
          Math.cos(thetaMiddle),

        0.52 *
          Math.sin(thetaMiddle),

        `θ = ${theta}°`,

        0.085
      )
    );

    // --------------------------------------------------
    // Rotationsmatrix
    // --------------------------------------------------

    const c =
      Math.cos(thetaRad);

    const s =
      Math.sin(thetaRad);

    information.textContent =
`Rotationsmatrix:

R = [ ${c.toFixed(3)}   ${(-s).toFixed(3)} ]
    [ ${s.toFixed(3)}    ${c.toFixed(3)} ]

Transformierter Vektor:

v′ = ( ${vxNeu.toFixed(3)}, ${vyNeu.toFixed(3)} )`;

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