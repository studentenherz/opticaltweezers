function makeDraggable(evt){
  var svg =  evt.target;
  var selectedElement = false;
  var offset = [null, null, null];
  var ray1 = svg.querySelector('#ray1');
  var ray2 = svg.querySelector('#ray2');
  var refInt1 = svg.querySelector('#refInt1');
  var refInt2 = svg.querySelector('#refInt2');
  var ref1 = svg.querySelector('#ref1');
  var ref2 = svg.querySelector('#ref2');

  const particleRadius = 10;
  const particleN = 1.60;
  const l1 = {
    x1: 40,
    x2: 60,
    y1: 100,
    y2: 0
  };
  const l2 = {
    x1: 60,
    x2: 40,
    y1: 100,
    y2: 0
  };


  ray1.setAttributeNS(null, 'x1', l1.x1);
  ray1.setAttributeNS(null, 'x2', l1.x2);
  ray1.setAttributeNS(null, 'y1', l1.y1);
  ray1.setAttributeNS(null, 'y2', l1.y2);  
  
  ray2.setAttributeNS(null, 'x1', l2.x1);  
  ray2.setAttributeNS(null, 'x2', l2.x2);  
  ray2.setAttributeNS(null, 'y1', l2.y1);  
  ray2.setAttributeNS(null, 'y2', l2.y2);  
  
  svg.querySelector('#circle').setAttributeNS(null, 'r', particleRadius);

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

      paint(l1, ray1, refInt1, ref1);
      paint(l2, ray2, refInt2, ref2);

    }
  }

  function paint(l , ray, refInt, ref){
    // console.log(l, ray, refInt, ref);
    var cx = parseFloat(selectedElement.getAttributeNS(null, "cx"));
    var cy = parseFloat(selectedElement.getAttributeNS(null, "cy"));
    var inter = intersectionLineCircle(cx, cy, particleRadius, l.x1, l.y1, l.x2, l.y2);

    if(!inter) {
      refInt.setAttributeNS(null, "visibility", "hidden");
      ref.setAttributeNS(null, "visibility", "hidden");
      ray.setAttributeNS(null, 'x2', l.x2);  
      ray.setAttributeNS(null, 'y2', l.y2); 
      return;
    };

    ray.setAttributeNS(null, 'x2', inter[1].x);  
    ray.setAttributeNS(null, 'y2', inter[1].y);

    var n1 = {
      x: cx - inter[1].x,
      y: cy - inter[1].y
    }

    var i = {
      x: l.x2 - l.x1,
      y: l.y2 - l.y1
    };

    var refDir = refractionCircle(1, particleN, n1, i);

    var inter1 = intersectionLineCircle(cx, cy, particleRadius, inter[1].x, inter[1].y, inter[1].x + 20 * refDir.x, inter[1].y + 20 * refDir.y)

    refInt.setAttributeNS(null, "visibility", "visible");
    refInt.setAttributeNS(null, 'x1', inter1[0].x);
    refInt.setAttributeNS(null, 'y1', inter1[0].y);
    refInt.setAttributeNS(null, 'x2', inter1[1].x);
    refInt.setAttributeNS(null, 'y2', inter1[1].y);

    // console.log(inter, inter1);

    var n2 = {
      x: inter1[0].x - cx,
      y: inter1[0].y - cy
    }

    var refDir2 = refractionCircle(particleN, 1, n2, refDir);

    ref.setAttributeNS(null, "visibility", "visible");
    ref.setAttributeNS(null, 'x1', inter1[0].x);
    ref.setAttributeNS(null, 'y1', inter1[0].y);
    ref.setAttributeNS(null, 'x2', inter1[0].x + 100 * refDir2.x);
    ref.setAttributeNS(null, 'y2', inter1[0].y + 100 * refDir2.y);

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


  // Intersection between a line and a circle
  // https://mathworld.wolfram.com/Circle-LineIntersection.html

  function intersectionLineCircle(cx, cy, r, x1, y1, x2, y2){

    // console.log([cx, cy, r, x1, y1, x2, y2]);
    x1 -= cx; x2 -= cx;
    y1 -= cy; y2 -= cy;
    // console.log([cx, cy, r, x1, y1, x2, y2]);

    var dx = x2 - x1;
    var dy = y2 - y1;
    var dr = Math.sqrt(dx*dx + dy*dy);
    var D = x1*y2 - x2*y1;

    var Delta = r*r *dr*dr - D*D;

    if(Delta > 0) return [{
      x: cx + (D*dy - Math.sign(dy)*dx*Math.sqrt(Delta))/(dr*dr),
      y: cy + (-D*dx - Math.abs(dy)*Math.sqrt(Delta))/(dr*dr)
    },
    {
      x: cx + (D*dy + Math.sign(dy)*dx*Math.sqrt(Delta))/(dr*dr),
      y: cy + (-D*dx + Math.abs(dy)*Math.sqrt(Delta))/(dr*dr)
    }];
    
    return null;
  }

  // Some vector calculations

  function dot(a, b){
    return a.x * b.x + a.y*b.y;
  }

  function unitaryVector(v){
    var norm = Math.sqrt(dot(v, v));
    return {
      x: v.x / norm,
      y: v.y / norm
    };
  }

  // Refraction 

  function refractionCircle(n1, n2, n, i){
    var mu = n1/n2;
    n = unitaryVector(n);
    i = unitaryVector(i);
    ni = dot(n,i);
    var a1 = Math.sqrt(1 - mu*mu*(1 - ni*ni))
    return {
      x: a1 * n.x + mu * i.x - mu * ni * n.x,
      y: a1 * n.y + mu * i.y - mu * ni * n.y,
    }
  }

}
