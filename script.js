const PEEKLINE_SCROLL_SPEED = 14;
const PEEKLINE_FADE_SOFTNESS = 10;

function setupPeeklineTextAnimation() {
  const scrollViewport = document.querySelector(".peekline-notch-scroll");
  const track = document.querySelector(".peekline-notch-track");

  if (!scrollViewport || !track) {
    return;
  }

  const originalLines = Array.from(track.querySelectorAll(".peekline-line"));
  if (originalLines.length === 0) {
    return;
  }

  for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
    for (const line of originalLines) {
      const clone = line.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
  }

  let loopHeight = 0;
  let offset = 0;
  let lastTime = 0;

  const measure = () => {
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const fadeClear = 0;
    const fadeSolid = PEEKLINE_FADE_SOFTNESS;

    scrollViewport.style.webkitMaskImage = `linear-gradient(180deg, transparent 0, transparent ${fadeClear}px, white ${fadeSolid}px, white 100%)`;
    scrollViewport.style.maskImage = `linear-gradient(180deg, transparent 0, transparent ${fadeClear}px, white ${fadeSolid}px, white 100%)`;

    loopHeight = originalLines.reduce((sum, line) => sum + line.getBoundingClientRect().height, 0);
    loopHeight += gap * Math.max(0, originalLines.length - 1);
    if (loopHeight > 0) {
      offset = loopHeight;
      track.style.transform = `translateY(-${offset}px)`;
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
      track.style.transform = `translateY(-${offset}px)`;
    }

    window.requestAnimationFrame(animate);
  };

  measure();
  window.addEventListener("resize", measure);
  window.requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", setupPeeklineTextAnimation);
