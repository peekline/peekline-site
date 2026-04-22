const PEEKLINE_SCROLL_PX_PER_SECOND = 18;
const PEEKLINE_FADE_EXTRA_PX = 12;

function setupPeeklineScroll() {
  const marquee = document.querySelector(".peekline-notch-marquee");
  const controls = document.querySelector(".peekline-notch-controls");
  const track = document.querySelector(".peekline-notch-track");

  if (!marquee || !controls || !track) {
    return;
  }

  const updateFadeBoundary = () => {
    const controlsStyle = window.getComputedStyle(controls);
    const controlsHeight = controls.getBoundingClientRect().height;
    const controlsBottomGap = parseFloat(controlsStyle.marginBottom) || 0;
    const clearPx = Math.round(controlsHeight + controlsBottomGap);
    const solidPx = clearPx + PEEKLINE_FADE_EXTRA_PX;

    track.style.setProperty("--peekline-fade-clear", `${clearPx}px`);
    track.style.setProperty("--peekline-fade-solid", `${solidPx}px`);
  };

  let loopHeight = 0;
  let offset = 0;
  let lastTime = 0;

  const measureLoop = () => {
    const lines = Array.from(track.querySelectorAll(".peekline-line"));
    if (lines.length < 2) {
      loopHeight = 0;
      return;
    }

    const half = lines.length / 2;
    const firstLoop = lines.slice(0, half);
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const contentHeight = firstLoop.reduce((sum, line) => sum + line.getBoundingClientRect().height, 0);
    loopHeight = contentHeight + gap * Math.max(0, firstLoop.length - 1);
  };

  const animate = (time) => {
    if (!lastTime) {
      lastTime = time;
    }

    const dt = (time - lastTime) / 1000;
    lastTime = time;

    if (loopHeight > 0) {
      offset += PEEKLINE_SCROLL_PX_PER_SECOND * dt;
      if (offset >= loopHeight) {
        offset -= loopHeight;
      }
      track.style.transform = `translateY(-${offset}px)`;
    }

    window.requestAnimationFrame(animate);
  };

  const measure = () => {
    updateFadeBoundary();
    measureLoop();
  };

  measure();
  window.addEventListener("resize", measure);
  window.requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", setupPeeklineScroll);
