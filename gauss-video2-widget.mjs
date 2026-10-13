function render({ el }) {

  const container = document.createElement("div");
  container.style.maxWidth = "700px";
  container.style.width = "100%";

  // --------------------------------------------------
  // Rahmen für Video und Bedienelemente
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
    "/Videos/Gauss_Elimination_ohne_Loesung.mp4";

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

  controls.style.background =
    "rgba(0, 0, 0, 0.72)";

  // --------------------------------------------------
  // Hilfsfunktion für Buttons
  // --------------------------------------------------

  function createButton(text, title) {

    const button =
      document.createElement("button");

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
    createButton(
      "↶ 10 s",
      "10 Sekunden zurück"
    );

  const playButton =
    createButton(
      "▶ Start",
      "Video starten"
    );

  const forwardButton =
    createButton(
      "10 s ↷",
      "10 Sekunden vorspulen"
    );

  // --------------------------------------------------
  // Zeitleiste
  // --------------------------------------------------

  const progress =
    document.createElement("input");

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

  const timeText =
    document.createElement("span");

  timeText.textContent = "0:00 / 0:00";

  timeText.style.color = "white";
  timeText.style.fontSize = "13px";
  timeText.style.whiteSpace = "nowrap";

  controls.appendChild(backButton);
  controls.appendChild(playButton);
  controls.appendChild(forwardButton);
  controls.appendChild(progress);
  controls.appendChild(timeText);

  videoBox.appendChild(controls);

  container.appendChild(videoBox);

  // --------------------------------------------------
  // Beschriftung
  // --------------------------------------------------

  const caption =
    document.createElement("div");

  caption.textContent =
    "Lineares Gleichungssystem ohne Lösung";

  caption.style.textAlign = "center";
  caption.style.fontStyle = "italic";
  caption.style.marginTop = "6px";

  container.appendChild(caption);

  // --------------------------------------------------
  // Zeit formatieren
  // --------------------------------------------------

  function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const minutes =
      Math.floor(seconds / 60);

    const rest =
      Math.floor(seconds % 60);

    return (
      minutes +
      ":" +
      String(rest).padStart(2, "0")
    );
  }

  // --------------------------------------------------
  // Zeitanzeige aktualisieren
  // --------------------------------------------------

  function updateTime() {

    if (!Number.isFinite(video.duration)) {
      return;
    }

    progress.value =
      String(
        100 *
        video.currentTime /
        video.duration
      );

    timeText.textContent =
      formatTime(video.currentTime) +
      " / " +
      formatTime(video.duration);
  }

  // --------------------------------------------------
  // Metadaten geladen
  // --------------------------------------------------

  video.addEventListener(
    "loadedmetadata",
    () => {

      if (
        video.videoWidth > 0 &&
        video.videoHeight > 0
      ) {

        videoBox.style.aspectRatio =
          video.videoWidth +
          " / " +
          video.videoHeight;
      }

      video.pause();
      video.currentTime = 0;

      updateTime();
    }
  );

  // --------------------------------------------------
  // Start / Pause
  // --------------------------------------------------

  playButton.addEventListener(
    "click",
    async () => {

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
    }
  );

  video.addEventListener(
    "play",
    () => {

      playButton.textContent =
        "⏸ Pause";

      playButton.title =
        "Video pausieren";
    }
  );

  video.addEventListener(
    "pause",
    () => {

      playButton.textContent =
        "▶ Start";

      playButton.title =
        "Video starten";
    }
  );

  // --------------------------------------------------
  // 10 Sekunden zurück
  // --------------------------------------------------

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

  // --------------------------------------------------
  // 10 Sekunden vor
  // --------------------------------------------------

  forwardButton.addEventListener(
    "click",
    () => {

      if (!Number.isFinite(video.duration)) {
        return;
      }

      video.currentTime =
        Math.min(
          video.duration,
          video.currentTime + 10
        );
    }
  );

  // --------------------------------------------------
  // Zeitleiste
  // --------------------------------------------------

  progress.addEventListener(
    "input",
    () => {

      if (!Number.isFinite(video.duration)) {
        return;
      }

      video.currentTime =
        video.duration *
        Number(progress.value) /
        100;
    }
  );

  video.addEventListener(
    "timeupdate",
    updateTime
  );

  // --------------------------------------------------
  // Video beendet
  // --------------------------------------------------

  video.addEventListener(
    "ended",
    () => {

      playButton.textContent =
        "▶ Start";
    }
  );

  // --------------------------------------------------
  // Fehler
  // --------------------------------------------------

  video.addEventListener(
    "error",
    () => {

      timeText.textContent =
        "Video konnte nicht geladen werden";
    }
  );

  // --------------------------------------------------
  // Widget einsetzen
  // --------------------------------------------------

  el.appendChild(container);

  video.pause();
}

export default { render };