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

// ================== MASTER TIMELINE — Single Continuous Experience ==================

const masterTL = gsap.timeline({
  scrollTrigger: {
    trigger: "main",
    start: "top top",
    end: "+=20000",  // Much longer scroll distance to ensure all animations complete
    scrub: 1,
    pin: false,  // We'll handle pinning manually
    markers: true,
  }
});

// Get references to all scenes
const beachScene = document.querySelector('#scene-beach');
const trashScene = document.querySelector('#scene-trash');
const turtleScene = document.querySelector('#scene-turtle');
const crabScene = document.querySelector('#scene-crab');
const jellyfishScene = document.querySelector('#scene-jellyfish');
const sharkScene = document.querySelector('#scene-shark');
const fishesScene = document.querySelector('#scene-fishes');
const coralScene = document.querySelector('#scene-coral');
const blankScene = document.querySelector('#scene-trash8');
const finaleScene = document.querySelector('#scene-finale');

// Make all scenes fixed positioned so we can control them
const allScenes = [beachScene, trashScene, turtleScene, crabScene, jellyfishScene, sharkScene, fishesScene, coralScene, blankScene, finaleScene];

allScenes.forEach((scene, index) => {
  scene.style.position = 'fixed';
  scene.style.top = '0';
  scene.style.left = '0';
  scene.style.zIndex = (allScenes.length - index).toString();
  scene.style.width = '100vw';
  scene.style.height = '100.2vh'; // guard against subpixel seams
});

// Create a second soda bottle for viewport fixing
const fixedSodaBottle = document.createElement('img');
fixedSodaBottle.src = 'img/elements/soda1.png';
fixedSodaBottle.className = 'soda1-fixed';
fixedSodaBottle.style.position = 'fixed';
fixedSodaBottle.style.zIndex = '10';
fixedSodaBottle.style.width = 'auto';
fixedSodaBottle.style.height = 'auto';
fixedSodaBottle.style.imageRendering = 'pixelated';
fixedSodaBottle.style.opacity = '0'; // Start hidden
document.body.appendChild(fixedSodaBottle);

// Position scenes below viewport initially - stack them directly on top of each other
gsap.set(trashScene, { y: "100vh" });
gsap.set(turtleScene, { y: "100vh" });
gsap.set(crabScene, { y: "100vh" });
gsap.set(jellyfishScene, { y: "100vh" });
gsap.set(sharkScene, { y: "100vh" });
gsap.set(fishesScene, { y: "100vh" });
gsap.set(coralScene, { y: "100vh" });
gsap.set(blankScene, { y: "100vh" });
gsap.set(finaleScene, { y: "100vh" });

// Randomize bubble images for all scenes
function randomizeBubbles() {
  const bubbles = document.querySelectorAll('.bubble');
  const bubbleImages = ['bubble1.png', 'bubble2.png', 'bubble3.png'];
  
  bubbles.forEach(bubble => {
    const randomImage = bubbleImages[Math.floor(Math.random() * bubbleImages.length)];
    bubble.src = `img/elements/${randomImage}`;
  });
}

// Initialize bubble randomization
randomizeBubbles();

masterTL
  // === BEACH SCENE ANIMATIONS ===
  // Title sequence
  .to(beachScene.querySelector("#title-beneath"), { y: 0, ease: "power1.out", duration: 0.4 })
  .to(beachScene.querySelector("#title-the"), { y: 0, ease: "none", duration: 0.4 })
  .to(beachScene.querySelector("#title-surface"), { y: 0, ease: "none", duration: 0.4 })
  .to(beachScene.querySelectorAll(".title-word"), { scale: 10, opacity: 0, duration: 0.6, ease: "power2.in" })

  // Girl and soda entering
  .fromTo(
    beachScene.querySelector(".element-girl"),
    { left: "-100%" },
    {
      left: "0%",
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        const girl = beachScene.querySelector(".element-girl");
        const soda = beachScene.querySelector(".soda1");
        if (!girl || !soda) return;

        const r = girl.getBoundingClientRect();
        soda.style.top  = r.top + r.height * 0.32 + "px";
        soda.style.left = r.left + r.width  * 0.59 + "px";
      },
    }
  )

  // === TRANSITION TO FIXED BOTTLE ===
  // After girl animation completes, hide animated bottle and show fixed bottle
  .to(beachScene.querySelector(".soda1"), {
    duration: 0.1,
    ease: "none",
    onComplete: () => {
      const animatedSoda = beachScene.querySelector(".soda1");
      if (!animatedSoda) return;
      
      // Get current position of animated bottle
      const rect = animatedSoda.getBoundingClientRect();
      
      // Position fixed bottle at same location but a bit lower
      fixedSodaBottle.style.top = (rect.top + 70) + 'px'; // Move down by 70px
      fixedSodaBottle.style.left = rect.left + 'px';
      fixedSodaBottle.style.width = rect.width + 'px';
      fixedSodaBottle.style.height = rect.height + 'px';
      
      // Hide animated bottle and show fixed bottle
      animatedSoda.style.opacity = '0';
      fixedSodaBottle.style.opacity = '1';
    },
    onReverseComplete: () => {
      // When scrolling backwards, switch back to animated bottle
      const animatedSoda = beachScene.querySelector(".soda1");
      if (!animatedSoda) return;
      
      // Hide fixed bottle and show animated bottle
      fixedSodaBottle.style.opacity = '0';
      animatedSoda.style.opacity = '1';
    }
  })

  // === TRANSITION TO TRASH SCENE ===
  // Move beach scene up and trash scene into view simultaneously
  .to(beachScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(trashScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda1.png'; })

  // === TRASH SCENE ANIMATIONS ===
  .fromTo(
    trashScene.querySelector(".overlay-trash"),
    {
      yPercent: 100,       // start just below viewport relative to its own size
      scale: 0.85,         // slightly smaller
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,         // end exactly at CSS-final position
      scale: 1,
      opacity: 1,
      duration: 0.5,       // tweak to taste
      ease: "power1.out"
    },
    "-=0.2"              // start slightly before scene transition ends
  )
  
  // Popup text enters from the right at the same time
  .fromTo(
    trashScene.querySelector(".popup"),
    {
      x: 200,          // slide in from the right in pixels for reliability
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<" // start at the same time as the previous tween
  )
  
  // Popup stays visible for reading
  .to({}, { duration: 0.6 })
  
  // Popup animates out before next scene
  .to(trashScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })
  
  // === TRANSITION TO TURTLE SCENE ===
  // Move trash scene up and turtle scene into view
  .to(trashScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(turtleScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda3.png'; })

  // === TURTLE SCENE ANIMATIONS ===
  .fromTo(
    turtleScene.querySelector(".overlay-turtle"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    turtleScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(turtleScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO CRAB SCENE ===
  .to(turtleScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(crabScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda4.png'; })

  // === CRAB SCENE ANIMATIONS ===
  .fromTo(
    crabScene.querySelector(".overlay-crab"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    crabScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(crabScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO JELLYFISH SCENE ===
  .to(crabScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(jellyfishScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda5.png'; })

  // === JELLYFISH SCENE ANIMATIONS ===
  .fromTo(
    jellyfishScene.querySelector(".overlay-jellyfish"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    jellyfishScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(jellyfishScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO SHARK SCENE ===
  .to(jellyfishScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(sharkScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda6.png'; })

  // === SHARK SCENE ANIMATIONS ===
  .fromTo(
    sharkScene.querySelector(".overlay-shark"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    sharkScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
    ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(sharkScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO FISHES SCENE ===
  .to(sharkScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(fishesScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda7.png'; })

  // === FISHES SCENE ANIMATIONS ===
  .fromTo(
    fishesScene.querySelector(".overlay-fishes"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
    opacity: 1,
      duration: 0.5,
      ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    fishesScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(fishesScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO CORAL SCENE ===
  .to(fishesScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(coralScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { fixedSodaBottle.src = 'img/elements/soda8.png'; })

  // === CORAL SCENE ANIMATIONS ===
  .fromTo(
    coralScene.querySelector(".overlay-coral"),
    {
      yPercent: 100,
      scale: 0.85,
      opacity: 0.75,
      immediateRender: false
    },
    {
      yPercent: 0,
      scale: 1,
      opacity: 1,
      duration: 0.5,
    ease: "power1.out"
    },
    "-=0.2"
  )
  
  .fromTo(
    coralScene.querySelector(".popup"),
    {
      x: 200,
      opacity: 0,
      immediateRender: false
    },
    {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    },
    "<"
  )
  
  .to({}, { duration: 0.6 })
  
  .to(coralScene.querySelector(".popup"), {
    x: 200,
    opacity: 0,
    duration: 0.4,
    ease: "power2.in"
  })

  // === TRANSITION TO BLANK SCENE ===
  // Increase overlap and use linear easing to avoid any visual gap
  .to(coralScene, { y: "-100.2vh", duration: 0.3, ease: "none" }, "-=0.12")
  .to(blankScene, { y: "0vh", duration: 0.3, ease: "none" }, "-=0.34")
  .set(fixedSodaBottle, { opacity: 0 })

  // === BLANK SCENE ANIMATIONS ===
  // Animate simple hard-coded lines (.blank-text p)
  .fromTo(blankScene.querySelector('.blank-text .line1'),
    { opacity: 0, scale: 0.98, transformOrigin: '50% 50%', immediateRender: false },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power1.out' }
  )
  .to({}, { duration: 0.5 })
  .to(blankScene.querySelector('.blank-text .line1'),
    { opacity: 0, scale: 0.98, duration: 0.8, ease: 'power1.in' }
  )
  .fromTo(blankScene.querySelector('.blank-text .line2'),
    { opacity: 0, scale: 0.98, transformOrigin: '50% 50%', immediateRender: false },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power1.out' }
  )
  .to({}, { duration: 0.5 })
  .to(blankScene.querySelector('.blank-text .line2'),
    { opacity: 0, scale: 0.98, duration: 0.8, ease: 'power1.in' }
  )
  .fromTo(blankScene.querySelector('.blank-text .line3'),
    { opacity: 0, scale: 0.98, transformOrigin: '50% 50%', immediateRender: false },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power1.out' }
  )
  .to({}, { duration: 0.5 })
  .to(blankScene.querySelector('.blank-text .line3'),
    { opacity: 0, scale: 0.98, duration: 0.8, ease: 'power1.in' }
  )
  .fromTo(blankScene.querySelector('.blank-text .line4'),
    { opacity: 0, scale: 0.98, transformOrigin: '50% 50%', immediateRender: false },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power1.out' }
  )
  .to({}, { duration: 0.5 })
  .to(blankScene.querySelector('.blank-text .line4'),
    { opacity: 0, scale: 0.98, duration: 0.8, ease: 'power1.in' }
  )
  .fromTo(blankScene.querySelector('.blank-text .line5'),
    { opacity: 0, scale: 0.98, transformOrigin: '50% 50%', immediateRender: false },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power1.out' }
  )
  .to({}, { duration: 0.5 })
  .to(blankScene.querySelector('.blank-text .line5'),
    { opacity: 0, scale: 0.98, duration: 0.8, ease: 'power1.in' }
  )
  
  // === TRANSITION TO FINALE SCENE (background only) ===
  .to(blankScene, { y: "-100vh", duration: 0.3, ease: "power2.inOut" }, "-=0.1")
  .to(finaleScene, { y: "0vh", duration: 0.3, ease: "power2.inOut" }, "-=0.3")
  .call(() => { /* keep soda hidden in finale unless desired */ })

  // Continue timeline to allow scrolling to continue
  .to({}, { duration: 1.0 })

// ================== Keep ScrollTrigger responsive ==================
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
