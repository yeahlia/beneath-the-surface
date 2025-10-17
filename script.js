let resizeTimeout;

function resizeSections() {
  document.querySelectorAll(".bg").forEach((section) => {
    section.style.height = `${window.innerHeight}px`;
  });
}

// run once on load
resizeSections();

// during resize, wait until user stops resizing before applying heights
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeSections, 150);
});

// === SODA BOTTLE SCROLL PHASES ===
const bottlePhases = document.querySelectorAll(".bottle-phase");
const sections = document.querySelectorAll(".bg");

function updateBottlePhase() {
  const scrollY = window.scrollY;
  const sectionHeight = window.innerHeight;
  const totalSections = sections.length;

  // determine which section number you're roughly in
  const currentSection = Math.min(
    Math.floor(scrollY / sectionHeight) + 1,
    totalSections
  );

  // bottle fades out before bg10
  if (currentSection >= 9) {
    bottlePhases.forEach((img) => img.classList.remove("active"));
    return;
  }

  // mapping:
  // bg1 & bg2 -> soda1
  // bg3 -> soda3
  // bg4 -> soda4
  // ...
  // bg9 -> soda9
  let phaseIndex = 0;
  if (currentSection <= 2) {
    phaseIndex = 0; // soda1
  } else {
    phaseIndex = currentSection - 2; // soda3–soda9 sequence
  }

  // apply active class for crossfade
  bottlePhases.forEach((img, i) => {
    img.classList.toggle("active", i === phaseIndex);
  });
}

// run once and on scroll
window.addEventListener("scroll", updateBottlePhase);
window.addEventListener("load", updateBottlePhase);

