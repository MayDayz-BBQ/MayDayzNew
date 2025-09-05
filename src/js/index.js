function appear(newSrc) {
  document.getElementById("sampler-closed").src = newSrc;
}

function close() {
  document.getElementById("sampler-closed").src =
    "/src/assets/Images/Cls-plate.webp";
}

function ribappear(newSrc) {
  document.getElementById("ribplate-closed").src = newSrc;
}

function ribclose() {
  document.getElementById("ribplate-closed").src =
    "/src/assets/Images/cls-plate.webp";
}

const samplerImage = document.getElementById("sampler-closed");

const originalSrc = "/src/assets/Images/Cls-plate.webp";

const hoverSrc = "/src/assets/Images/Sampler.webp";

samplerImage.addEventListener("mouseover", function () {
  this.src = hoverSrc;
});

samplerImage.addEventListener("mouseout", function () {
  this.src = originalSrc;
});

const ribImage = document.getElementById("ribplate-closed");

const ogRib = "/src/assets/Images/Rib-Platwe";

function handleRibplateImage() {
  const ribplate = document.getElementById("ribplate-closed");
  if (window.innerWidth < 768) {
    ribplate.src = "/src/assets/Images/Rib-Plate.webp";
  } else {
    ribplate.src = "/src/assets/Images/Rib-Plate.webp";
  }
}

handleRibplateImage();

window.addEventListener("resize", handleRibplateImage);

function handleSamplerImage() {
  const ribplate = document.getElementById("sampler-closed");
  if (window.innerWidth < 768) {
    ribplate.src = "/src/assets/Images/Sampler.webp";
  } else {
    ribplate.src = "/src/assets/Images/Sampler.webp";
  }
}

handleSamplerImage();

window.addEventListener("resize", handleRibplateImage);

function serveLogo()
{
  if (window.outerWidth() < 768)
  {
    document.getElementById("logo-animation-main").src = "/SRC/ASSETS/IMAGES/Maydayz-LOGO-TailGate-GS.webp"
  }
}