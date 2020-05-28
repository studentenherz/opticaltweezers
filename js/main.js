var tag = document.createElement('script');
const presentation = document.getElementById('presentation');
var description = document.querySelector('#description');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '2wPmHlop_Ik',
    playerVars: { 'rel':0}
  });

  setInterval(scrollIntoViewWithVideo, 500);
}

const timeMarks = {
  312 : 1
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