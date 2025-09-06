// A single, reusable function to handle hover effects for any element.
function setupHoverEffect(elementId, hoverSrc, originalSrc) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener("mouseover", () => {
      element.src = hoverSrc;
    });
    element.addEventListener("mouseout", () => {
      element.src = originalSrc;
    });
  }
}

// A function to handle the image source based on screen size.
function handleResponsiveImage(elementId, mobileSrc, desktopSrc) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const updateSrc = () => {
    if (window.innerWidth < 768) {
      element.src = mobileSrc;
    } else {
      element.src = desktopSrc;
    }
  };

  updateSrc(); 
  window.addEventListener("resize", updateSrc); 
}


setupHoverEffect(
  "sampler-closed",
  "/src/assets/Images/Sampler.webp",
  "/src/assets/Images/Cls-plate.webp"
);
setupHoverEffect(
  "ribplate-closed",
  "/src/assets/Images/Rib-Plate.webp",
  "/src/assets/Images/Cls-plate.webp"
);



