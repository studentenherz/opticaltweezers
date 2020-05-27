var tag = document.createElement('script');
const presentation = document.getElementById('presentation');

tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '2wPmHlop_Ik'
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