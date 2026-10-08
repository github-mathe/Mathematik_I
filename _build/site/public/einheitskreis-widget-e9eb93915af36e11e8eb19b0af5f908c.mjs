function render({ model, el }) {

  const container = document.createElement("div");
  container.style.maxWidth = "700px";
  container.style.width = "100%";

  // --------------------------------------------------
  // Standardwinkel des Einheitskreises
  // --------------------------------------------------

  const angles = [
    {
      deg: 0,
      theta: "0",
      cos: "1",
      sin: "0"
    },
    {
      deg: 30,
      theta: "π/6",
      cos: "√3/2",
      sin: "1/2"
    },
    {
      deg: 45,
      theta: "π/4",
      cos: "√2/2",
      sin: "√2/2"
    },
    {
      deg: 60,
      theta: "π/3",
      cos: "1/2",
      sin: "√3/2"
    },
    {
      deg: 90,
      theta: "π/2",
      cos: "0",
      sin: "1"
    },
    {
      deg: 120,
      theta: "2π/3",
      cos: "-1/2",
      sin: "√3/2"
    },
    {
      deg: 135,
      theta: "3π/4",
      cos: "-√2/2",
      sin: "√2/2"
    },
    {
      deg: 150,
      theta: "5π/6",
      cos: "-√3/2",
      sin: "1/2"
    },
    {
      deg: 180,
      theta: "π",
      cos: "-1",
      sin: "0"
    },
    {
      deg: 210,
      theta: "7π/6",
      cos: "-√3/2",
      sin: "-1/2"
    },
    {
      deg: 225,
      theta: "5π/4",
      cos: "-√2/2",
      sin: "-√2/2"
    },
    {
      deg: 240,
      theta: "4π/3",
      cos: "-1/2",
      sin: "-√3/2"
    },
    {
      deg: 270,
      theta: "3π/2",
      cos: "0",
      sin: "-1"
    },
    {
      deg: 300,
      theta: "5π/3",
      cos: "1/2",
      sin: "-√3/2"
    },
    {
      deg: 315,
      theta: "7π/4",
      cos: "√2/2",
      sin: "-√2/2"
    },
    {
      deg: 330,
      theta: "11π/6",
      cos: "√3/2",
      sin: "-1/2"
    },
    {
      deg: 360,
      theta: "2π",
      cos: "1",
      sin: "0"
    }
  ];

  // --------------------------------------------------
  // Slider
  // --------------------------------------------------

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "10px";
  controls.style.marginBottom = "6px";

  const label = document.createElement("strong");
  label.textContent = "θ:";

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = String(angles.length - 1);
  slider.step = "1";

  // Start bei pi/4
  slider.value = "2";

  slider.style.width = "320px";

  const valueText = document.createElement("span");
  valueText.textContent = "π/4";
  valueText.style.minWidth = "65px";

  controls.appendChild(label);
  controls.appendChild(slider);
  controls.appendChild(valueText);

  container.appendChild(controls);

  // --------------------------------------------------
  // SVG
  // --------------------------------------------------

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");

  svg.setAttribute(
    "viewBox",
    "-1.45 -1.45 2.9 2.9"
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
    width = 0.01,
    dash = null
  ) {

    const line =
      document.createElementNS(
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
    size = 0.08,
    anchor = "middle",
    color = "currentColor"
  ) {

    const element =
      document.createElementNS(
        svgNS,
        "text"
      );

    element.setAttribute("x", x);
    element.setAttribute("y", -y);
    element.setAttribute("font-size", size);
    element.setAttribute("text-anchor", anchor);
    element.setAttribute(
      "dominant-baseline",
      "middle"
    );
    element.setAttribute("fill", color);

    element.textContent = text;

    return element;
  }

  // --------------------------------------------------
  // Gitter
  // --------------------------------------------------

  const gridValues = [
    -1,
    -0.5,
    0.5,
    1
  ];

  for (const value of gridValues) {

    svg.appendChild(
      createLine(
        value,
        -1.25,
        value,
        1.25,
        "#d0d0d0",
        0.005
      )
    );

    svg.appendChild(
      createLine(
        -1.25,
        value,
        1.25,
        value,
        "#d0d0d0",
        0.005
      )
    );
  }

  // --------------------------------------------------
  // Achsen
  // --------------------------------------------------

  svg.appendChild(
    createLine(
      -1.3,
      0,
      1.3,
      0,
      "currentColor",
      0.012
    )
  );

  svg.appendChild(
    createLine(
      0,
      -1.3,
      0,
      1.3,
      "currentColor",
      0.012
    )
  );

  svg.appendChild(
    createText(
      1.34,
      -0.07,
      "x",
      0.09
    )
  );

  svg.appendChild(
    createText(
      0.07,
      1.34,
      "y",
      0.09
    )
  );

  svg.appendChild(
    createText(
      1,
      -0.08,
      "1",
      0.07
    )
  );

  svg.appendChild(
    createText(
      -1,
      -0.08,
      "-1",
      0.07
    )
  );

  svg.appendChild(
    createText(
      -0.08,
      1,
      "1",
      0.07
    )
  );

  svg.appendChild(
    createText(
      -0.10,
      -1,
      "-1",
      0.07
    )
  );

  // --------------------------------------------------
  // Einheitskreis
  // --------------------------------------------------

  const circle =
    document.createElementNS(
      svgNS,
      "circle"
    );

  circle.setAttribute("cx", 0);
  circle.setAttribute("cy", 0);
  circle.setAttribute("r", 1);

  circle.setAttribute("fill", "none");
  circle.setAttribute(
    "stroke",
    "#666666"
  );

  circle.setAttribute(
    "stroke-width",
    "0.015"
  );

  svg.appendChild(circle);

  // --------------------------------------------------
  // Dynamische Elemente
  // --------------------------------------------------

  const dynamicGroup =
    document.createElementNS(
      svgNS,
      "g"
    );

  svg.appendChild(dynamicGroup);

  // --------------------------------------------------
  // Angaben unterhalb der Grafik
  // --------------------------------------------------

  const information =
    document.createElement("div");

  information.style.marginTop = "4px";
  information.style.fontSize = "16px";
  information.style.lineHeight = "1.8";

  container.appendChild(information);

  // --------------------------------------------------
  // Aktualisierung
  // --------------------------------------------------

  function update() {

    dynamicGroup.replaceChildren();

    const index =
      Number(slider.value);

    const data =
      angles[index];

    const thetaRad =
      data.deg *
      Math.PI / 180;

    let c =
      Math.cos(thetaRad);

    let s =
      Math.sin(thetaRad);

    if (Math.abs(c) < 1e-10) {
      c = 0;
    }

    if (Math.abs(s) < 1e-10) {
      s = 0;
    }

    valueText.textContent =
      data.theta;

    // --------------------------------------------------
    // Kosinus
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createLine(
        0,
        0,
        c,
        0,
        "#4F81BD",
        0.025
      )
    );

    // --------------------------------------------------
    // Sinus
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createLine(
        c,
        0,
        c,
        s,
        "#C0504D",
        0.025
      )
    );

    // --------------------------------------------------
    // horizontale Hilfslinie
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createLine(
        0,
        s,
        c,
        s,
        "#C0504D",
        0.01,
        "0.04 0.03"
      )
    );

    // --------------------------------------------------
    // Radius
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createLine(
        0,
        0,
        c,
        s,
        "#555555",
        0.02
      )
    );

    // --------------------------------------------------
    // Punkt P
    // --------------------------------------------------

    const point =
      document.createElementNS(
        svgNS,
        "circle"
      );

    point.setAttribute("cx", c);
    point.setAttribute("cy", -s);
    point.setAttribute("r", 0.035);
    point.setAttribute(
      "fill",
      "#222222"
    );

    dynamicGroup.appendChild(point);

    // --------------------------------------------------
    // Winkelbogen
    // --------------------------------------------------

    const arcRadius = 0.30;

    let pathData = "";

    const steps =
      Math.max(
        2,
        Math.ceil(data.deg / 3)
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
        arcRadius *
        Math.cos(angle);

      const y =
        arcRadius *
        Math.sin(angle);

      if (i === 0) {

        pathData =
          "M " +
          x +
          " " +
          (-y);

      } else {

        pathData +=
          " L " +
          x +
          " " +
          (-y);
      }
    }

    const arc =
      document.createElementNS(
        svgNS,
        "path"
      );

    arc.setAttribute("d", pathData);
    arc.setAttribute("fill", "none");

    arc.setAttribute(
      "stroke",
      "#F39C12"
    );

    arc.setAttribute(
      "stroke-width",
      "0.025"
    );

    dynamicGroup.appendChild(arc);

    // --------------------------------------------------
    // Winkelbeschriftung
    // --------------------------------------------------

    const middle =
      thetaRad / 2;

    dynamicGroup.appendChild(
      createText(
        0.43 * Math.cos(middle),
        0.43 * Math.sin(middle),
        "θ = " + data.theta,
        0.075,
        "middle",
        "#D97706"
      )
    );

    // --------------------------------------------------
    // Punkt P
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createText(
        c + 0.07,
        s + 0.07,
        "P",
        0.085
      )
    );

    // --------------------------------------------------
    // Kosinus-Beschriftung
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createText(
        c / 2,
        -0.09,
        "cos(θ)",
        0.07,
        "middle",
        "#4F81BD"
      )
    );

    // --------------------------------------------------
    // Sinus-Beschriftung
    // --------------------------------------------------

    dynamicGroup.appendChild(
      createText(
        c + 0.08,
        s / 2,
        "sin(θ)",
        0.07,
        "start",
        "#C0504D"
      )
    );

    // --------------------------------------------------
    // Exakte Angaben
    // --------------------------------------------------

    information.innerHTML =
      "<strong>Winkel:</strong> θ = " +
      data.theta +
      "<br>" +

      "<strong>Punkt auf dem Einheitskreis:</strong> " +
      "P = (" +
      data.cos +
      ", " +
      data.sin +
      ")" +
      "<br>" +

      "<strong style='color:#4F81BD'>" +
      "cos(θ) = " +
      data.cos +
      "</strong>" +
      "<br>" +

      "<strong style='color:#C0504D'>" +
      "sin(θ) = " +
      data.sin +
      "</strong>";
  }

  // --------------------------------------------------
  // Slider
  // --------------------------------------------------

  slider.addEventListener(
    "input",
    update
  );

  // --------------------------------------------------
  // Widget einsetzen
  // --------------------------------------------------

  el.appendChild(container);

  update();
}

export default { render };