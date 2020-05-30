function makeDraggable(evt){
  var svg =  evt.target;
  var selectedElement = false;
  var offset = [null, null, null];

  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  function startDrag(evt){
    if(evt.target.classList.contains('draggable')){
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      offset.x -= selectedElement.getAttributeNS(null, "cx");
      offset.y -= selectedElement.getAttributeNS(null, "cy");
    }
  }

  function drag(evt){
    if(selectedElement){
      evt.preventDefault();
      var r = getMousePosition(evt);
      selectedElement.setAttributeNS(null, "cx", r.x - offset.x);
      selectedElement.setAttributeNS(null, "cy", r.y - offset.y);
    }
  }

  function endDrag(evt){
    selectedElement = null;
  }

  function getMousePosition(evt){ // on svg (x, y) -> on screen (ax + e, dy + f)
    var CTM = svg.getScreenCTM();
    return {
      x: (evt.clientX - CTM.e)/CTM.a,
      y: (evt.clientY - CTM.f)/CTM.d,
    }
  }





}
