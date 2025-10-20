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
  img.onload = () => {
    drawScaled(img, canvas, ctx, sharedScale);
    ScrollTrigger.refresh(); // ✅ refresh only after the image is drawn
  };
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
  wheelMultiplier: 0.5, // adjust scroll speed if needed
});

// use Lenis' internal raf for smooth motion
function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update(); // keep GSAP ScrollTrigger synced
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


gsap.registerPlugin(ScrollTrigger);

// ================== SCENE 1 — Beach ==================

const beachTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene-beach",
    start: "top top",
    end: "+=3000",     // shorter range = quicker handoff to next scene
    scrub: 1,
    pin: true,
    pinSpacing: true,  // keep space for smooth transition
    anticipatePin: 1,
    markers: true,
  }
});

beachTL
  // --- Title sequence ---
  .to("#title-beneath", { y: 0, ease: "power1.out", duration: 0.6 })
  .to("#title-the",     { y: 0, ease: "none",        duration: 0.6 })
  .to("#title-surface", { y: 0, ease: "none",        duration: 0.6 })
  .to(".title-word",    { scale: 10, opacity: 0, duration: 1.0, ease: "power2.in" })

  // --- Girl and soda entering together ---
  .fromTo(
    ".element-girl",
    { left: "-100%" },
    {
      left: "0%",
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        const girl = document.querySelector(".element-girl");
        const soda = document.querySelector(".soda1");
        if (!girl || !soda) return;

        const r = girl.getBoundingClientRect();
        // Adjust these multipliers until the soda perfectly lines up with her hand
        soda.style.top  = r.top + r.height * 0.32 + "px";
        soda.style.left = r.left + r.width  * 0.59 + "px";
      },
    }
  );

// ================== SCENE 2 — Trash ==================

const trashTL = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene-trash",
    start: "top top",       // start right as beach unpins
    end: "+=2500",          // adjust scroll distance as needed
    scrub: 1,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    markers: true,
  }
});

trashTL
  .from(".overlay-trash", {
    y: 150,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  })
  .to("#scene-trash .popup", {
    opacity: 1,
    x: 0,
    duration: 0.8,
    ease: "power1.out"
  });

// ================== Keep ScrollTrigger responsive ==================
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
