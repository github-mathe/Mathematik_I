
function render({ el }) {

  const container = document.createElement("div");
  container.style.maxWidth = "1000px";
  container.style.width = "100%";

  // --------------------------------------------------
  // Rahmen fuer Video und Bedienelemente
  // --------------------------------------------------

  const videoBox = document.createElement("div");

  videoBox.style.position = "relative";
  videoBox.style.width = "100%";
  videoBox.style.aspectRatio = "16 / 9";
  videoBox.style.background = "#000";
  videoBox.style.overflow = "hidden";

  // --------------------------------------------------
  // Video
  // --------------------------------------------------

  const video = document.createElement("video");

  const basePath =
    window.location.hostname.endsWith("github.io")
      ? "/Mathematik_I"
      : "";

  video.src =
    basePath +
    "/Videos/Matrix-Matrix_Produkt.mp4";

  video.preload = "metadata";
  video.autoplay = false;
  video.loop = false;
  video.muted = false;
  video.playsInline = true;
  video.controls = false;

  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  video.style.display = "block";

  videoBox.appendChild(video);

  // --------------------------------------------------
  // Steuerungsleiste im Videobild
  // --------------------------------------------------

  const controls = document.createElement("div");

  controls.style.position = "absolute";
  controls.style.left = "0";
  controls.style.right = "0";
  controls.style.bottom = "0";
  controls.style.display = "flex";
  controls.style.alignItems = "center";
  controls.style.gap = "8px";
  controls.style.padding = "8px 10px";
  controls.style.background = "rgba(0, 0, 0, 0.72)";
  controls.style.transition = "opacity 0.3s ease";
  controls.style.opacity = "1";

  // --------------------------------------------------
  // Hilfsfunktion fuer Buttons
  // --------------------------------------------------

  function createButton(text, title) {

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.title = title;

    button.style.border = "none";
    button.style.background = "transparent";
    button.style.color = "white";
    button.style.fontSize = "15px";
    button.style.fontWeight = "600";
    button.style.padding = "6px 8px";
    button.style.cursor = "pointer";

    return button;
  }

  // --------------------------------------------------
  // Buttons
  // --------------------------------------------------

  const backButton =
    createButton("↶ 10 s", "10 Sekunden zurück");

  const playButton =
    createButton("▶ Start", "Video starten");

  const forwardButton =
    createButton("10 s ↷", "10 Sekunden vorspulen");

  const fullscreenButton =
    createButton("⛶", "Vollbild");

  // --------------------------------------------------
  // Zeitleiste
  // --------------------------------------------------

  const progress = document.createElement("input");

  progress.type = "range";
  progress.min = "0";
  progress.max = "100";
  progress.step = "0.01";
  progress.value = "0";

  progress.style.flex = "1";
  progress.style.minWidth = "80px";
  progress.style.cursor = "pointer";
  progress.style.accentColor = "#4F81BD";

  // --------------------------------------------------
  // Zeitanzeige
  // --------------------------------------------------

  const timeText = document.createElement("span");

  timeText.textContent = "0:00 / 0:00";
  timeText.style.color = "white";
  timeText.style.fontSize = "13px";
  timeText.style.whiteSpace = "nowrap";

  // --------------------------------------------------
  // Steuerung zusammensetzen
  // --------------------------------------------------

  controls.appendChild(backButton);
  controls.appendChild(playButton);
  controls.appendChild(forwardButton);
  controls.appendChild(progress);
  controls.appendChild(timeText);
  controls.appendChild(fullscreenButton);

  videoBox.appendChild(controls);
  container.appendChild(videoBox);

  // --------------------------------------------------
  // Beschriftung
  // --------------------------------------------------

  const caption = document.createElement("div");

  caption.textContent = "Matrix-Matrix-Multiplikation";
  caption.style.textAlign = "center";
  caption.style.fontStyle = "italic";
  caption.style.marginTop = "6px";

  container.appendChild(caption);

  // --------------------------------------------------
  // Steuerungsleiste automatisch ein-/ausblenden
  // --------------------------------------------------

  let controlsTimer = null;

  function keepControlsVisible() {

    if (controlsTimer !== null) {
      clearTimeout(controlsTimer);
      controlsTimer = null;
    }

    controls.style.opacity = "1";
    controls.style.pointerEvents = "auto";
    videoBox.style.cursor = "default";
  }

  function showControls() {

    keepControlsVisible();

    // Nur waehrend der Wiedergabe ausblenden

    if (!video.paused) {

      controlsTimer = setTimeout(() => {

        controls.style.opacity = "0";
        controls.style.pointerEvents = "none";
        videoBox.style.cursor = "none";

      }, 2000);
    }
  }

  videoBox.addEventListener("mousemove", showControls);
  videoBox.addEventListener("mouseenter", showControls);
  videoBox.addEventListener("pointerdown", showControls);

  videoBox.addEventListener("mouseleave", () => {

    if (!video.paused) {

      if (controlsTimer !== null) {
        clearTimeout(controlsTimer);
        controlsTimer = null;
      }

      controls.style.opacity = "0";
      controls.style.pointerEvents = "none";
      videoBox.style.cursor = "none";
    }
  });

  // --------------------------------------------------
  // Zeit formatieren
  // --------------------------------------------------

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60);

    return minutes + ":" + String(rest).padStart(2, "0");
  }

  // --------------------------------------------------
  // Anzeige aktualisieren
  // --------------------------------------------------

  function updateTime() {

    if (!Number.isFinite(video.duration) ||
        video.duration <= 0) {
      return;
    }

    progress.value = String(
      100 * video.currentTime / video.duration
    );

    timeText.textContent =
      formatTime(video.currentTime) +
      " / " +
      formatTime(video.duration);
  }

  // --------------------------------------------------
  // Metadaten geladen
  // --------------------------------------------------

  video.addEventListener("loadedmetadata", () => {

    // Originales Seitenverhaeltnis uebernehmen

    if (video.videoWidth > 0 &&
        video.videoHeight > 0) {

      videoBox.style.aspectRatio =
        video.videoWidth + " / " + video.videoHeight;
    }

    // Kein automatischer Start

    video.pause();
    video.currentTime = 0;

    updateTime();
    keepControlsVisible();
  });

  // --------------------------------------------------
  // Start / Pause
  // --------------------------------------------------

  playButton.addEventListener("click", async () => {

    if (video.paused) {

      try {
        await video.play();
      } catch (error) {
        console.error(
          "Video konnte nicht gestartet werden:",
          error
        );
      }

    } else {
      video.pause();
    }
  });

  video.addEventListener("play", () => {

    playButton.textContent = "⏸ Pause";
    playButton.title = "Video pausieren";
    showControls();
  });

  video.addEventListener("pause", () => {

    playButton.textContent = "▶ Start";
    playButton.title = "Video starten";
    keepControlsVisible();
  });

  // --------------------------------------------------
  // 10 Sekunden zurueck
  // --------------------------------------------------

  backButton.addEventListener("click", () => {

    video.currentTime = Math.max(
      0,
      video.currentTime - 10
    );

    showControls();
  });

  // --------------------------------------------------
  // 10 Sekunden vor
  // --------------------------------------------------

  forwardButton.addEventListener("click", () => {

    if (!Number.isFinite(video.duration)) {
      return;
    }

    video.currentTime = Math.min(
      video.duration,
      video.currentTime + 10
    );

    showControls();
  });

  // --------------------------------------------------
  // Zeitleiste verschieben
  // --------------------------------------------------

  progress.addEventListener("input", () => {

    if (!Number.isFinite(video.duration)) {
      return;
    }

    video.currentTime =
      video.duration * Number(progress.value) / 100;

    showControls();
  });

  video.addEventListener("timeupdate", updateTime);

  // --------------------------------------------------
  // Video beendet
  // --------------------------------------------------

  video.addEventListener("ended", () => {

    playButton.textContent = "▶ Start";
    playButton.title = "Video starten";
    keepControlsVisible();
  });

  // --------------------------------------------------
  // Vollbildmodus
  // --------------------------------------------------

  fullscreenButton.addEventListener("click", async () => {

    try {

      if (!document.fullscreenElement) {

        if (videoBox.requestFullscreen) {

          await videoBox.requestFullscreen();

        } else if (videoBox.webkitRequestFullscreen) {

          videoBox.webkitRequestFullscreen();

        } else if (video.webkitEnterFullscreen) {

          // Safari / iOS Fallback

          video.webkitEnterFullscreen();
        }

      } else {

        if (document.exitFullscreen) {

          await document.exitFullscreen();

        } else if (document.webkitExitFullscreen) {

          document.webkitExitFullscreen();
        }
      }

    } catch (error) {

      console.error(
        "Vollbildmodus konnte nicht gestartet werden:",
        error
      );
    }

    showControls();
  });

  // --------------------------------------------------
  // Vollbild-Button aktualisieren
  // --------------------------------------------------

  function updateFullscreenButton() {

    if (document.fullscreenElement === videoBox) {

      fullscreenButton.title = "Vollbild verlassen";

    } else {

      fullscreenButton.title = "Vollbild";
    }

    showControls();
  }

  document.addEventListener(
    "fullscreenchange",
    updateFullscreenButton
  );

  document.addEventListener(
    "webkitfullscreenchange",
    updateFullscreenButton
  );

  // --------------------------------------------------
  // Fehler anzeigen
  // --------------------------------------------------

  video.addEventListener("error", () => {

    timeText.textContent =
      "Video konnte nicht geladen werden";

    keepControlsVisible();
  });

  // --------------------------------------------------
  // Widget einsetzen
  // --------------------------------------------------

  el.appendChild(container);

  // Kein automatischer Start

  video.pause();
}

export default { render };
