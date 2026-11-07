// Video widget for a MyST/Jupyter Book AnyWidget directive.
// Keep RangMatrix.mp4 next to the published Rang page, or adjust video.src.
export default {
  render({ el }) {
    const video = document.createElement("video");
    video.src = "./RangMatrix.mp4";
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.style.width = "100%";
    video.style.maxWidth = "1100px";
    video.style.height = "auto";
    video.style.display = "block";
    video.style.margin = "0 auto";
    video.setAttribute("aria-label", "Der Rang einer Matrix – Erklärvideo");
    el.appendChild(video);
    return () => { video.pause(); video.remove(); };
  }
};
