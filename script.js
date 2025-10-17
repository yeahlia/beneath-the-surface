let resizeTimeout;

function resizeSections() {
  document.querySelectorAll('.bg').forEach(section => {
    section.style.height = `${window.innerHeight}px`;
  });
}

// run once on load
resizeSections();

// during resize, wait until user stops resizing before applying heights
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeSections, 150);
});

