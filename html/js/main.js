const slides = document.querySelectorAll(".slide");

const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const slidesNav = document.querySelector(".slidesNav");

let index = -1; // current slide index

slides.forEach((slide, i) => {
  var node = document.createElement("span");
  var tooltipNode = document.createElement("div");
  tooltipNode.classList.add("tooltip");
  var tooltipText = document.createTextNode(
    slide.querySelector(".short-title").innerHTML
  );
  tooltipNode.appendChild(tooltipText);
  node.appendChild(tooltipNode);
  slidesNav.appendChild(node);
});

window.setActiveSlide = function (x) {
  index = x;
  slides.forEach((slide, i) => {
    if (i == index) {
      toggleShow(i, ".title");
      if (window.chrome != undefined) slide.scrollIntoView();
      else slide.scrollIntoView({ behavior: "smooth" });
    }
  });

  slidesNav.querySelectorAll("span").forEach((dot, j) => {
    if (j == index) dot.classList.add("active");
    else dot.classList.remove("active");
  });
};

window.getDescription = function () {
  if (slides[index].querySelector(".description"))
    return slides[index].querySelector(".description").innerHTML;
  return null;
};

slidesNav.querySelectorAll("span").forEach((dot, i) => {
  dot.addEventListener("click", () => {
    setActiveSlide(i);
  });
});

const toggleShow = (curr, elmClass) => {
  slides.forEach((slide, i) => {
    // console.log(slide);
    if (curr == i) slide.querySelector(elmClass).classList.add("show");
    else slide.querySelector(elmClass).classList.remove("show");
  });
};

nextBtn.addEventListener("click", () => {
  index = (index + slides.length + 1) % slides.length;
  setActiveSlide(index);
});

prevBtn.addEventListener("click", () => {
  index = (index + slides.length - 1) % slides.length;
  setActiveSlide(index);
});

const deltaScroll = 500;
let lastTime = 0;

window.addEventListener("wheel", (e) => {
  const delta = e.deltaY;
  const currTime = new Date().getTime();
  if (currTime - lastTime < deltaScroll) {
    e.preventDefault;
    return;
  }

  if (delta > 0) {
    const clickEvent = new Event("click");
    nextBtn.dispatchEvent(clickEvent);
  } else if (delta < 0) {
    const clickEvent = new Event("click");
    prevBtn.dispatchEvent(clickEvent);
  }
  lastTime = currTime;
});

const init = () => {
  const clickEvent = new Event("click");
  nextBtn.dispatchEvent(clickEvent);
};

init();
