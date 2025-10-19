// ===== RESIZE HANDLER =====
let resizeTimeout;

function resizeSections() {
  document.querySelectorAll(".bg").forEach((section) => {
    section.style.height = `${window.innerHeight}px`;
  });
}
resizeSections();

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeSections, 150);
});

// ====== GSAP INTRO ANIMATION ======
gsap.registerPlugin(ScrollTrigger);

const introTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".intro",
    start: "top top",
    end: "+=300%",
    scrub: true,
    pin: true,
  },
});

introTL
  .to(".w1", { opacity: 1, duration: 1 })
  .to(".w1", { opacity: 0, duration: 1 }, "+=0.5")
  .to(".w2", { opacity: 1, duration: 1 })
  .to(".w2", { opacity: 0, duration: 1 }, "+=0.5")
  .to(".w3", { opacity: 1, duration: 1 })
  .to(".w3", { scale: 8, opacity: 0, duration: 2 }, "+=0.5")
  .to(".intro-overlay", { opacity: 0, duration: 2 }, "<");

// ====== SCROLLAMA (your existing logic) ======
const scroller = scrollama();
const bottlePhases = document.querySelectorAll(".bottle-phase");
const sections = document.querySelectorAll(".bg");
const popups = document.querySelectorAll(".popup");

function setBottlePhase(sectionIndex) {
  if (sectionIndex >= 9) {
    bottlePhases.forEach((img) => img.classList.remove("active"));
    return;
  }
  let phaseIndex = sectionIndex <= 1 ? 0 : sectionIndex - 1;
  bottlePhases.forEach((img, i) =>
    img.classList.toggle("active", i === phaseIndex)
  );
}

function showPopup(sectionIndex) {
  popups.forEach((popup, i) => {
    popup.classList.toggle("visible", i === sectionIndex);
  });
}

scroller
  .setup({
    step: ".bg",
    offset: 0.5,
    debug: false,
  })
  .onStepEnter((response) => {
    const { index } = response;
    setBottlePhase(index);
    showPopup(index);
  })
  .onStepExit((response) => {
    const { index, direction } = response;
    if (direction === "up") popups[index].classList.remove("visible");
  });
