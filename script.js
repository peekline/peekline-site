const PEEKLINE_SCROLL_SPEED = 12;
const PEEKLINE_FADE_SOFTNESS = 10;

function setupPeeklineTextAnimation() {
  const scrollViewport = document.querySelector(".peekline-notch-scroll");
  const track = document.querySelector(".peekline-notch-track");
  const timer = document.querySelector(".peekline-notch-timer");

  if (!scrollViewport || !track) {
    return;
  }

  const originalLines = Array.from(track.querySelectorAll(".peekline-line"));
  if (originalLines.length === 0) {
    return;
  }

  const originalMarkup = originalLines.map((line) => line.outerHTML).join("");
  track.innerHTML = "";

  for (let copyIndex = 0; copyIndex < 3; copyIndex += 1) {
    const loop = document.createElement("div");
    loop.className = "peekline-loop";
    loop.innerHTML = originalMarkup;

    if (copyIndex > 0) {
      for (const clone of loop.querySelectorAll(".peekline-line")) {
        clone.setAttribute("aria-hidden", "true");
      }
    }

    track.appendChild(loop);
  }

  const loops = Array.from(track.querySelectorAll(".peekline-loop"));

  let loopHeight = 0;
  let offset = 0;
  let lastTime = 0;
  let elapsedSeconds = 0;
  let timerAccumulator = 0;

  const formatTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const measure = () => {
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const fadeClear = 0;
    const fadeSolid = PEEKLINE_FADE_SOFTNESS;

    scrollViewport.style.webkitMaskImage = `linear-gradient(180deg, transparent 0, transparent ${fadeClear}px, white ${fadeSolid}px, white 100%)`;
    scrollViewport.style.maskImage = `linear-gradient(180deg, transparent 0, transparent ${fadeClear}px, white ${fadeSolid}px, white 100%)`;

    if (loops.length >= 2) {
      loopHeight = loops[1].offsetTop - loops[0].offsetTop;
    } else {
      loopHeight = 0;
    }

    if (loopHeight > 0) {
      offset = loopHeight;
      track.style.transform = `translate3d(0, -${offset}px, 0)`;
    }
  };

  const animate = (time) => {
    if (!lastTime) {
      lastTime = time;
    }

    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (loopHeight > 0) {
      offset += PEEKLINE_SCROLL_SPEED * delta;
      if (offset >= loopHeight * 2) {
        offset -= loopHeight;
      }
      track.style.transform = `translate3d(0, -${offset}px, 0)`;
    }

    if (timer) {
      timerAccumulator += delta;
      if (timerAccumulator >= 1) {
        const wholeSeconds = Math.floor(timerAccumulator);
        elapsedSeconds += wholeSeconds;
        timerAccumulator -= wholeSeconds;
        timer.textContent = formatTimer(elapsedSeconds);
      }
    }

    window.requestAnimationFrame(animate);
  };

  measure();
  window.addEventListener("resize", measure);
  window.requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", setupPeeklineTextAnimation);
