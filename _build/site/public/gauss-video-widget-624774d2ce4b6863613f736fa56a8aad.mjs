function render({ el }) {

  const container = document.createElement("div");
  container.style.maxWidth = "700px";
  container.style.width = "100%";

  // --------------------------------------------------
  // Video
  // --------------------------------------------------

  const video = document.createElement("video");

  video.src = "./Videos/Gauss_Verfahren_Folie_54.mp4";

  video.controls = true;
  video.preload = "metadata";

  // ausdrücklich kein automatischer Start
  video.autoplay = false;

  video.style.width = "100%";
  video.style.display = "block";

  container.appendChild(video);

  // --------------------------------------------------
  // Eigene Steuerung
  // --------------------------------------------------

  const controls = document.createElement("div");

  controls.style.display = "flex";
  controls.style.gap = "10px";
  controls.style.alignItems = "center";
  controls.style.marginTop = "8px";
  controls.style.flexWrap = "wrap";

  // 10 Sekunden zurück
  const backButton = document.createElement("button");

  backButton.type = "button";
  backButton.textContent = "⏪ 10 s";

  backButton.style.padding = "6px 12px";
  backButton.style.cursor = "pointer";

  // Start / Pause
  const playButton = document.createElement("button");

  playButton.type = "button";
  playButton.textContent = "▶ Start";

  playButton.style.padding = "6px 12px";
  playButton.style.cursor = "pointer";

  // 10 Sekunden vor
  const forwardButton = document.createElement("button");

  forwardButton.type = "button";
  forwardButton.textContent = "10 s ⏩";

  forwardButton.style.padding = "6px 12px";
  forwardButton.style.cursor = "pointer";

  controls.appendChild(backButton);
  controls.appendChild(playButton);
  controls.appendChild(forwardButton);

  container.appendChild(controls);

  // --------------------------------------------------
  // Beschriftung
  // --------------------------------------------------

  const caption = document.createElement("div");

  caption.textContent = "Durchführung des Gauß-Verfahrens";

  caption.style.marginTop = "8px";
  caption.style.fontStyle = "italic";
  caption.style.textAlign = "center";

  container.appendChild(caption);

  // --------------------------------------------------
  // Funktionen
  // --------------------------------------------------

  playButton.addEventListener(
    "click",
    () => {

      if (video.paused) {

        video.play();

      } else {

        video.pause();
      }
    }
  );

  video.addEventListener(
    "play",
    () => {

      playButton.textContent = "⏸ Pause";
    }
  );

  video.addEventListener(
    "pause",
    () => {

      playButton.textContent = "▶ Start";
    }
  );

  backButton.addEventListener(
    "click",
    () => {

      video.currentTime =
        Math.max(
          0,
          video.currentTime - 10
        );
    }
  );

  forwardButton.addEventListener(
    "click",
    () => {

      const newTime =
        video.currentTime + 10;

      if (
        Number.isFinite(video.duration)
      ) {

        video.currentTime =
          Math.min(
            video.duration,
            newTime
          );

      } else {

        video.currentTime =
          newTime;
      }
    }
  );

  // --------------------------------------------------
  // Widget einsetzen
  // --------------------------------------------------

  el.appendChild(container);
}

export default { render };