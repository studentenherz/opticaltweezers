var tag = document.createElement('script');
const presentation = document.getElementById('presentation');

tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '2wPmHlop_Ik',
    events: {
      'onStateChange': onPlayerStateChange
    }
  });

  setInterval(scrollIntoViewWithVideo, 500);
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
}

function stopVideo() {
  player.stopVideo();
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