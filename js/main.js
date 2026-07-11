lucide.createIcons();

const b = document.getElementById('mb');
const m = document.getElementById('mm');
b && (b.onclick = () => m.classList.toggle('hidden'));

// Video overlay darkens on scroll
const overlay = document.getElementById('scrollOverlay');
if (overlay) {
  const updateOverlay = () => {
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;
    const p = Math.min(scrollY / viewH, 1);
    overlay.style.opacity = 0.4 + (0.52 * p);
  };
  window.addEventListener('scroll', updateOverlay, { passive: true });
  updateOverlay();
}
