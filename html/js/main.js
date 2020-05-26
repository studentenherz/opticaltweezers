const slides = document.querySelectorAll('.slide');

const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const slidesNav = document.querySelector('.slidesNav');

let index = -1; // current slide index

slides.forEach((slide, i) => {
  var node = document.createElement('span');
  var tooltipNode = document.createElement('div');
  tooltipNode.classList.add('tooltip');
  var tooltipText = document.createTextNode(slide.querySelector('.short-title').innerHTML);
  tooltipNode.appendChild(tooltipText);
  node.appendChild(tooltipNode);
  slidesNav.appendChild(node);
});

const setActiveSlide = (x) => {
  index = x;
  slides.forEach((slide, i) => {
    if(i == index){
      toggleShow(i, '.title');
      slide.scrollIntoView({behavior: "smooth"});
    }
  });
  
  slidesNav.querySelectorAll('span').forEach((dot, j) => {
    if(j == index) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

slidesNav.querySelectorAll('span').forEach((dot, i) => {
  dot.addEventListener('click', () => {setActiveSlide(i)});
});

const toggleShow = (curr, elmClass) => {
  slides.forEach((slide, i) => {
    // console.log(slide);
    if(curr == i) slide.querySelector(elmClass).classList.add('show');
    else slide.querySelector(elmClass).classList.remove('show');
  });
};

nextBtn.addEventListener('click', () => {
  if(index >= slides.length - 1){
    index = slides.length - 1;
    return;
  }
  
  index++;
  setActiveSlide(index);
});

prevBtn.addEventListener('click', () => {
  if(index <= 0){
    index = 0;
    return;
  }
  index--;
  setActiveSlide(index); 
});

const deltaScroll = 500;
let lastTime = 0;

window.addEventListener('wheel', (e) => {
  const delta = e.deltaY;
  const currTime = new Date().getTime();
  if(currTime - lastTime < deltaScroll){
    e.preventDefault;
    return;
  }

  if(delta > 1){
    const clickEvent = new Event('click');
    nextBtn.dispatchEvent(clickEvent);
  }
  else if(delta < -1){
    const clickEvent = new Event('click');
    prevBtn.dispatchEvent(clickEvent);
  }
  lastTime = currTime;
});

const init = ()=>{
  const clickEvent = new Event('click');
  nextBtn.dispatchEvent(clickEvent);
}

init();