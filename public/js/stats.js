document.addEventListener("DOMContentLoaded", () => {
  const animateCountUp = (el) => {
    const target = parseFloat(el.dataset.target);
    const duration = 500; // 1.5 seconds
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const currentValue = progress * target;

      if (target % 1 !== 0) {
        el.textContent = currentValue.toFixed(1);
      } else {
        el.textContent = Math.floor(currentValue);
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach(animateCountUp);

          const bars = entry.target.querySelectorAll(".bar");
          bars.forEach((bar) => {
            bar.style.width = bar.dataset.width;
          });

          //   observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  const statsTab = document.querySelector("#stats");
  if (statsTab) {
    observer.observe(statsTab);
  }
});
