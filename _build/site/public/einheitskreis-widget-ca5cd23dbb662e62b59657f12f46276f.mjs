function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

function fmt(x) {
  const eps = 1e-10;
  if (Math.abs(x) < eps) x = 0;
  return Number(x).toFixed(3);
}

function radString(thetaDeg) {
  const thetaRad = thetaDeg * Math.PI / 180;
  return thetaRad.toFixed(3);
}

function buildArcPath(cx, cy, r, thetaDeg) {
  const points = [];
  const steps = Math.max(2, Math.floor(thetaDeg / 4) + 2);

  for (let i = 0; i <= steps; i++) {
    const t = (thetaDeg * i) / steps;
    const rad = t * Math.PI / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy - r * Math.sin(rad);
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }

  return points.join(" ");
}

function initUnitCircleWidget(container) {
  if (container.dataset.unitCircleInitialized === "true") return;
  container.dataset.unitCircleInitialized = "true";

  container.innerHTML = `
    <style>
      .ucw-wrapper {
        border: 1px solid #d9d9d9;
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .ucw-controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .ucw-controls label {
        font-weight: 600;
      }

      .ucw-slider {
        flex: 1 1 260px;
      }

      .ucw-button {
        border: 1px solid #c8c8c8;
        background: #f7f7f7;
        border-radius: 8px;
        padding: 0.45rem 0.8rem;
        cursor: pointer;
        font-size: 0.95rem;
      }

      .ucw-button:hover {
        background: #eeeeee;
      }

      .ucw-main {
        display: grid;
        grid-template-columns: minmax(320px, 420px) minmax(220px, 1fr);
        gap: 1.2rem;
        align-items: start;
      }

      @media (max-width: 850px) {
        .ucw-main {
          grid-template-columns: 1fr;
        }
      }

      .ucw-figure {
        width: 100%;
      }

      .ucw-svg {
        width: 100%;
        height: auto;
        display: block;
      }

      .ucw-info {
        border: 1px solid #e1e1e1;
        border-radius: 10px;
        padding: 0.9rem 1rem;
        background: #fafafa;
      }

      .ucw-info h4 {
        margin: 0 0 0.7rem 0;
        font-size: 1rem;
      }

      .ucw-info p {
        margin: 0.35rem 0;
      }

      .ucw-formula {
        margin-top: 0.9rem;
        padding-top: 0.7rem;
        border-top: 1px solid #e1e1e1;
        font-size: 0.95rem;
      }

      .ucw-small {
        color: #555;
        font-size: 0.93rem;
      }
    </style>

    <div class="ucw-wrapper">
      <div class="ucw-controls">
        <label for="ucw-angle-slider">Winkel \\(\\theta\\): <span class="ucw-angle-text">45°</span></label>
        <input id="ucw-angle-slider" class="ucw-slider" type="range" min="0" max="360" step="1" value="45">
        <button class="ucw-button" type="button">▶ Start</button>
      </div>

      <div class="ucw-main">
        <div class="ucw-figure">
          <svg class="ucw-svg" viewBox="0 0 380 380" aria-label="Einheitskreis">
            <!-- Achsen -->
            <line x1="20" y1="190" x2="360" y2="190" stroke="#333" stroke-width="1.2"/>
            <line x1="190" y1="360" x2="190" y2="20" stroke="#333" stroke-width="1.2"/>

            <!-- Pfeilspitzen -->
            <polygon points="360,190 350,185 350,195" fill="#333"></polygon>
            <polygon points="190,20 185,30 195,30" fill="#333"></polygon>

            <!-- Kreis -->
            <circle cx="190" cy="190" r="130" fill="none" stroke="#999" stroke-width="1.6"/>

            <!-- Ticks -->
            <line x1="320" y1="184" x2="320" y2="196" stroke="#333" stroke-width="1"/>
            <line x1="60" y1="184" x2="60" y2="196" stroke="#333" stroke-width="1"/>
            <line x1="184" y1="60" x2="196" y2="60" stroke="#333" stroke-width="1"/>
            <line x1="184" y1="320" x2="196" y2="320" stroke="#333" stroke-width="1"/>

            <!-- Beschriftungen -->
            <text x="344" y="182" font-size="16">x</text>
            <text x="200" y="34" font-size="16">y</text>
            <text x="314" y="210" font-size="14">1</text>
            <text x="52" y="210" font-size="14">-1</text>
            <text x="202" y="65" font-size="14">1</text>
            <text x="198" y="326" font-size="14">-1</text>
            <text x="196" y="208" font-size="14">0</text>

            <!-- Winkelbogen -->
            <path class="ucw-arc" d="" fill="none" stroke="#f4a261" stroke-width="3"/>

            <!-- Radius -->
            <line class="ucw-radius" x1="190" y1="190" x2="281.9" y2="98.1" stroke="#2f5aa8" stroke-width="3"/>

            <!-- Projektionen -->
            <line class="ucw-proj-x" x1="190" y1="190" x2="281.9" y2="190" stroke="#2f5aa8" stroke-width="2.5"/>
            <line class="ucw-proj-y" x1="281.9" y1="190" x2="281.9" y2="98.1" stroke="#c94f49" stroke-width="2.5"/>

            <!-- Hilfslinien gestrichelt -->
            <line class="ucw-guide-x" x1="281.9" y1="98.1" x2="281.9" y2="190" stroke="#2f5aa8" stroke-width="1.3" stroke-dasharray="5 4"/>
            <line class="ucw-guide-y" x1="281.9" y1="98.1" x2="190" y2="98.1" stroke="#c94f49" stroke-width="1.3" stroke-dasharray="5 4"/>

            <!-- Punkt -->
            <circle class="ucw-point" cx="281.9" cy="98.1" r="5.5" fill="#111"/>

            <!-- Winkeltext -->
            <text class="ucw-angle-label" x="230" y="170" font-size="15" fill="#d97706">θ</text>

            <!-- Koordinatentext -->
            <text class="ucw-point-label" x="290" y="92" font-size="14" fill="#111"></text>

            <!-- cos/sin Labels -->
            <text class="ucw-cos-label" x="235" y="184" font-size="14" fill="#2f5aa8"></text>
            <text class="ucw-sin-label" x="289" y="145" font-size="14" fill="#c94f49"></text>
          </svg>
        </div>

        <div class="ucw-info">
          <h4>Aktuelle Werte</h4>
          <p><strong>Winkel:</strong> <span class="ucw-info-theta-deg">45°</span></p>
          <p><strong>Winkel in Radiant:</strong> <span class="ucw-info-theta-rad">0.785</span></p>
          <p><strong>Punkt auf dem Einheitskreis:</strong><br><span class="ucw-info-point">(0.707, 0.707)</span></p>
          <p><strong>\\(\\cos(\\theta)\\):</strong> <span class="ucw-info-cos">0.707</span></p>
          <p><strong>\\(\\sin(\\theta)\\):</strong> <span class="ucw-info-sin">0.707</span></p>

          <div class="ucw-formula">
            <p><strong>Zusammenhang:</strong></p>
            <p class="ucw-small">Für den Einheitskreis gilt:</p>
            <p>\\[
              P=(\\cos(\\theta),\\sin(\\theta))
            \\]</p>
            <p class="ucw-small">
              Die x-Koordinate ist also der Kosinuswert und die y-Koordinate der Sinuswert.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector(".ucw-slider");
  const button = container.querySelector(".ucw-button");
  const angleText = container.querySelector(".ucw-angle-text");

  const svg = container.querySelector(".ucw-svg");
  const arc = svg.querySelector(".ucw-arc");
  const radiusLine = svg.querySelector(".ucw-radius");
  const projX = svg.querySelector(".ucw-proj-x");
  const projY = svg.querySelector(".ucw-proj-y");
  const guideX = svg.querySelector(".ucw-guide-x");
  const guideY = svg.querySelector(".ucw-guide-y");
  const point = svg.querySelector(".ucw-point");
  const pointLabel = svg.querySelector(".ucw-point-label");
  const angleLabel = svg.querySelector(".ucw-angle-label");
  const cosLabel = svg.querySelector(".ucw-cos-label");
  const sinLabel = svg.querySelector(".ucw-sin-label");

  const infoThetaDeg = container.querySelector(".ucw-info-theta-deg");
  const infoThetaRad = container.querySelector(".ucw-info-theta-rad");
  const infoPoint = container.querySelector(".ucw-info-point");
  const infoCos = container.querySelector(".ucw-info-cos");
  const infoSin = container.querySelector(".ucw-info-sin");

  const cx = 190;
  const cy = 190;
  const R = 130;
  const arcR = 42;

  let playing = false;
  let timer = null;

  function update(thetaDeg) {
    const thetaRad = thetaDeg * Math.PI / 180;
    const x = Math.cos(thetaRad);
    const y = Math.sin(thetaRad);

    const px = cx + R * x;
    const py = cy - R * y;

    radiusLine.setAttribute("x1", cx);
    radiusLine.setAttribute("y1", cy);
    radiusLine.setAttribute("x2", px);
    radiusLine.setAttribute("y2", py);

    projX.setAttribute("x1", cx);
    projX.setAttribute("y1", cy);
    projX.setAttribute("x2", px);
    projX.setAttribute("y2", cy);

    projY.setAttribute("x1", px);
    projY.setAttribute("y1", cy);
    projY.setAttribute("x2", px);
    projY.setAttribute("y2", py);

    guideX.setAttribute("x1", px);
    guideX.setAttribute("y1", py);
    guideX.setAttribute("x2", px);
    guideX.setAttribute("y2", cy);

    guideY.setAttribute("x1", px);
    guideY.setAttribute("y1", py);
    guideY.setAttribute("x2", cx);
    guideY.setAttribute("y2", py);

    point.setAttribute("cx", px);
    point.setAttribute("cy", py);

    arc.setAttribute("d", buildArcPath(cx, cy, arcR, thetaDeg));

    const midRad = thetaRad / 2;
    const lx = cx + (arcR + 16) * Math.cos(midRad);
    const ly = cy - (arcR + 16) * Math.sin(midRad);
    angleLabel.setAttribute("x", lx);
    angleLabel.setAttribute("y", ly);

    pointLabel.setAttribute("x", px + 8);
    pointLabel.setAttribute("y", py - 8);
    pointLabel.textContent = `P(${fmt(x)}, ${fmt(y)})`;

    cosLabel.setAttribute("x", (cx + px) / 2 - 15);
    cosLabel.setAttribute("y", cy - 8);
    cosLabel.textContent = `cos(θ)`;

    sinLabel.setAttribute("x", px + 8);
    sinLabel.setAttribute("y", (cy + py) / 2);
    sinLabel.textContent = `sin(θ)`;

    angleText.textContent = `${thetaDeg}°`;
    infoThetaDeg.textContent = `${thetaDeg}°`;
    infoThetaRad.textContent = radString(thetaDeg);
    infoPoint.textContent = `(${fmt(x)}, ${fmt(y)})`;
    infoCos.textContent = fmt(x);
    infoSin.textContent = fmt(y);
  }

  function start() {
    if (playing) return;
    playing = true;
    button.textContent = "⏸ Pause";

    timer = setInterval(() => {
      let value = Number(slider.value);
      value = (value + 1) % 361;
      slider.value = value;
      update(value);
    }, 40);
  }

  function stop() {
    playing = false;
    button.textContent = "▶ Start";
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  slider.addEventListener("input", () => {
    update(Number(slider.value));
  });

  button.addEventListener("click", () => {
    if (playing) {
      stop();
    } else {
      start();
    }
  });

  update(Number(slider.value));

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(() => {});
  }
}

document.querySelectorAll("[data-unit-circle-widget]").forEach(initUnitCircleWidget);