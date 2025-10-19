function drawScaled(img, canvas, ctx, sharedScale) {
  const baseW = 320;
  const baseH = 180;
  const { scale, drawW, drawH, offsetX, offsetY } = sharedScale;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

function computeScale() {
  const baseW = 320;
  const baseH = 180;
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const scale = Math.max(winW / baseW, winH / baseH);
  const drawW = baseW * scale;
  const drawH = baseH * scale;
  const offsetX = (winW - drawW) / 2;
  const offsetY = (winH - drawH) / 2;
  return { scale, drawW, drawH, offsetX, offsetY };
}

function initScenes() {
  const canvases = document.querySelectorAll(".scene-canvas");
  const sharedScale = computeScale();
  const entries = [];

  canvases.forEach((canvas) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = canvas.dataset.src;
    img.onload = () => drawScaled(img, canvas, ctx, sharedScale);
    entries.push({ img, canvas, ctx });
  });

  window.addEventListener("resize", () => {
    const newScale = computeScale();
    entries.forEach(({ img, canvas, ctx }) =>
      drawScaled(img, canvas, ctx, newScale)
    );
  });
}

window.addEventListener("load", initScenes);

// ====================== LENIS + GSAP ==========================

// smooth scrolling via Lenis
const lenis = new Lenis({
  smooth: true, // enable smoothing
  lerp: 0.08, // inertia (0.05–0.1 = smooth, 0.15–0.2 = snappier)
  wheelMultiplier: 1.0, // adjust scroll speed if needed
});

// use Lenis' internal raf for smooth motion
function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update(); // keep GSAP ScrollTrigger synced
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ====================== GSAP ONLY ==========================

gsap.registerPlugin(ScrollTrigger);

const beachtl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene-beach",
    start: "top top",
    end: "+=3000", // scroll distance for the sequence
    scrub: true,
    pin: true,
    markers: true,
  },
});

// move upward from bottom
beachtl
  .to("#title-beneath", { y: 0, ease: "none" })
  .to({}, { duration: 0.3 }) // short pause
  .to("#title-the", { y: 0, ease: "none" })
  .to({}, { duration: 0.3 }) // another pause
  .to("#title-surface", { y: 0, ease: "none" })
  .to({}, { duration: 4.5 }); // final pause

// optional: keep ScrollTrigger in sync when resizing
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
