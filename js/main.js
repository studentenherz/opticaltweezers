var tag = document.createElement('script');
const presentation = document.getElementById('presentation');
var description = document.querySelector('#description');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '97-y-AzuC8I',
    playerVars: { 'rel':0}
  });

  setInterval(scrollIntoViewWithVideo, 500);
}

const timeMarks = {
  13 : 1,
  41 : 2,
  123: 3,
  238: 4,
  253: 5,
  309: 6,
  376: 7,
  403: 8,
  458: 0
}

function scrollIntoViewWithVideo () {
  var currTime = parseInt(player.getCurrentTime());
  // console.log(currTime);
  if(timeMarks[currTime]){
    presentation.contentWindow.setActiveSlide(timeMarks[currTime]);
  }
}

function setDescription() {
  description.innerHTML = presentation.contentWindow.getDescription();
}

setInterval(setDescription, 500);