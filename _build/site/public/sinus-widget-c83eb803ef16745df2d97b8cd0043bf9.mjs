function render({ el }) {
  const container = document.createElement("div");
  container.style.maxWidth = "900px";
  container.style.width = "100%";

  const controls = document.createElement("div");
  controls.style.marginBottom = "15px";

  function createSlider(labelText, min, max, step, value, digits) {
    const row = document.createElement("div");
    row.style.marginBottom = "10px";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "10px";

    const label = document.createElement("span");
    label.textContent = labelText;
    label.style.fontWeight = "600";
    label.style.width = "20px";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.style.width = "320px";

    const valueText = document.createElement("span");
    valueText.textContent = Number(value).toFixed(digits);
    valueText.style.minWidth = "50px";

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(valueText);

    controls.appendChild(row);

    return { slider, valueText, digits };
  }

  const aControl = createSlider(
    "a:",
    -3,
    3,
    0.1,
    1,
    1
  );

  const bControl = createSlider(
    "b:",
    0.25,
    3,
    0.05,
    1,
    2
  );

  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 900 500");
  svg.setAttribute("width", "100%");
  svg.style.display = "block";

  const margin = {
    left: 70,
    right: 25,
    top: 65,
    bottom: 60
  };

  const width = 900;
  const height = 500;

  const plotWidth =
    width - margin.left - margin.right;

  const plotHeight =
    height - margin.top - margin.bottom;

  const xMin = -2 * Math.PI;
  const xMax = 2 * Math.PI;

  const yMin = -3.5;
  const yMax = 3.5;

  function sx(x) {
    return (
      margin.left +
      ((x - xMin) / (xMax - xMin)) * plotWidth
    );
  }

  function sy(y) {
    return (
      margin.top +
      ((yMax - y) / (yMax - yMin)) * plotHeight
    );
  }

  function makeLine(x1, y1, x2, y2, stroke, width) {
    const line = document.createElementNS(svgNS, "line");

    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);

    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", width);

    return line;
  }

  function makeText(x, y, text, anchor = "middle") {
    const t = document.createElementNS(svgNS, "text");

    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("text-anchor", anchor);
    t.setAttribute("fill", "currentColor");
    t.setAttribute("font-size", "16");

    t.textContent = text;

    return t;
  }

  const staticGroup =
    document.createElementNS(svgNS, "g");

  // horizontale Gitterlinien
  for (let y = -3; y <= 3; y++) {
    staticGroup.appendChild(
      makeLine(
        sx(xMin),
        sy(y),
        sx(xMax),
        sy(y),
        y === 0 ? "currentColor" : "#d0d0d0",
        y === 0 ? 1.2 : 0.7
      )
    );
  }

  // y-Achse
  staticGroup.appendChild(
    makeLine(
      sx(0),
      sy(yMin),
      sx(0),
      sy(yMax),
      "currentColor",
      1.2
    )
  );

  const xTicks = [
    [-2 * Math.PI, "−2π"],
    [-Math.PI, "−π"],
    [0, "0"],
    [Math.PI, "π"],
    [2 * Math.PI, "2π"]
  ];

  for (const [x, label] of xTicks) {
    staticGroup.appendChild(
      makeLine(
        sx(x),
        sy(yMin),
        sx(x),
        sy(yMax),
        x === 0 ? "currentColor" : "#d0d0d0",
        x === 0 ? 1.2 : 0.7
      )
    );

    staticGroup.appendChild(
      makeText(
        sx(x),
        height - 30,
        label
      )
    );
  }

  // Achsenbeschriftungen
  staticGroup.appendChild(
    makeText(
      margin.left + plotWidth / 2,
      height - 5,
      "x"
    )
  );

  const yLabel =
    makeText(
      20,
      margin.top + plotHeight / 2,
      "f(x)"
    );

  yLabel.setAttribute(
    "transform",
    `rotate(-90 20 ${margin.top + plotHeight / 2})`
  );

  staticGroup.appendChild(yLabel);

  svg.appendChild(staticGroup);

  // Sinuskurve
  const curve =
    document.createElementNS(svgNS, "path");

  curve.setAttribute("fill", "none");
  curve.setAttribute("stroke", "#4F81BD");
  curve.setAttribute("stroke-width", "2");

  svg.appendChild(curve);

  // Titel
  const title =
    makeText(
      width / 2,
      30,
      ""
    );

  title.setAttribute("font-size", "20");

  svg.appendChild(title);

  // Zusatzinformationen
  const info =
    makeText(
      margin.left + 12,
      margin.top + 25,
      "",
      "start"
    );

  info.setAttribute("font-size", "15");

  svg.appendChild(info);

  function update() {
    const a = Number(aControl.slider.value);
    const b = Number(bControl.slider.value);

    aControl.valueText.textContent =
      a.toFixed(aControl.digits);

    bControl.valueText.textContent =
      b.toFixed(bControl.digits);

    const points = [];

    const n = 1000;

    for (let i = 0; i < n; i++) {
      const x =
        xMin +
        (i / (n - 1)) * (xMax - xMin);

      const y =
        a * Math.sin(b * x);

      points.push(
        `${i === 0 ? "M" : "L"} ${sx(x)} ${sy(y)}`
      );
    }

    curve.setAttribute(
      "d",
      points.join(" ")
    );

    title.textContent =
      `f(x) = ${a.toFixed(1)} sin(${b.toFixed(2)}x)`;

    const amplitude = Math.abs(a);

    const periode =
      (2 * Math.PI) / Math.abs(b);

    info.textContent =
      `Amplitude = ${amplitude.toFixed(2)}    ` +
      `Periodenlänge T = ${periode.toFixed(2)}`;
  }

  aControl.slider.addEventListener(
    "input",
    update
  );

  bControl.slider.addEventListener(
    "input",
    update
  );

  container.appendChild(controls);
  container.appendChild(svg);

  el.appendChild(container);

  update();
}

export default { render };