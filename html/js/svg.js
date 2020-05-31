function makeDraggable(evt){
  var svg =  evt.target;
  var selectedElement = false;
  var offset = [null, null, null];

  var radiusSlider = document.querySelector('#radiusSlider');
  var intensitySlider = document.querySelector('#intensitySlider');

  var nRays = 1 + parseInt(intensitySlider.value/2) * 2,
        widthLens = 40,
        focalLength = 50,
        dxRays = (widthLens/nRays),
        fMult = 5;
  var particleRadius = radiusSlider.value;
  var particleN = 1.60;
  var circ, force, maxY;

  radiusSlider.oninput = function(){
    particleRadius = radiusSlider.value;
    circ.setAttribute('r', particleRadius);
    drag()
  };

  intensitySlider.oninput = function(){
    nRays = 1 + parseInt(intensitySlider.value/2) * 2;
    dxRays = (widthLens/nRays)
    setUpLights();
    drag();
  };

  var fixToAxis = false;

  let l = [], rays =[], refInts = [], refs = [], paraRays = [];
  var focalPlane = svg.querySelector('#focal-plane');
  focalPlane.setAttribute('x1', -1000);
  focalPlane.setAttribute('x2', 1000);
  focalPlane.setAttribute('y1', 100 - focalLength);
  focalPlane.setAttribute('y2', 100 - focalLength);
  

  // Turn the lights on

  function setUpLights(){
    // Rays directions and positions
    l = [];

    for(let i=0; i<nRays; i++){
      l.push({
        x1: (50 - dxRays * (i - parseInt(nRays/2))),
        // x1: (50 - dxRays * (i - parseInt(nRays/2)) * (1 + 100/focalLength)),
        x2: (50 + dxRays * (i - parseInt(nRays/2)) * (200/focalLength -1)),
        y1: 100,
        // y1: 200,
        y2: -100
      });
    }

    // Rays lines

    rays = [];
    raysOnSvg = document.querySelectorAll('.laser');
    if(raysOnSvg.length){
      for(let i=0; i<raysOnSvg.length; i++)
        svg.removeChild(raysOnSvg[i]);
    }

    for(let i=0; i<nRays; i++){
      rays.push(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
      rays[i].setAttribute('x1', l[i].x1);
      rays[i].setAttribute('x2', l[i].x2);
      rays[i].setAttribute('y1', l[i].y1);
      rays[i].setAttribute('y2', l[i].y2);
      rays[i].setAttribute('class', 'laser ray');
      svg.appendChild(rays[i]);
    }

    // parallel rays 
  
    for(let i=0; i<nRays; i++){
      paraRays.push(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
      paraRays[i].setAttribute('x1', l[i].x1);
      paraRays[i].setAttribute('x2', l[i].x1);
      paraRays[i].setAttribute('y1', 200);
      paraRays[i].setAttribute('y2', 100);
      paraRays[i].setAttribute('class', 'laser');
      svg.appendChild(paraRays[i]);
    }
    
    
    // Rays inside the ball
    
    for(let i=0; i<nRays; i++){
      refInts.push(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
      refInts[i].setAttribute('visibility', 'hidden');
      refInts[i].setAttribute('class', 'laser');
      svg.appendChild(refInts[i]);
    }

    // Refracted rays

    for(let i=0; i<nRays; i++){
      refs.push(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
      refs[i].setAttribute('visibility', 'hidden');
      refs[i].setAttribute('class', 'laser');
      svg.appendChild(refs[i]);
    }

    tmp = svg.querySelector('#circle');
    var cx = 50, cy = 100 - focalLength;
    if(tmp){
      cx = tmp.getAttributeNS(null, 'cx');
      cy = tmp.getAttributeNS(null, 'cy');
      svg.removeChild(tmp);
    }
    // console.log(cx, cy);

    // The circle
    circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circ.setAttribute('id', 'circle');
    circ.setAttribute('class', 'draggable');
    circ.setAttribute('r', particleRadius);
    circ.setAttribute('cx', cx);
    circ.setAttribute('cy', cy);
    svg.appendChild(circ);

    if(svg.querySelector('#force')){
      svg.removeChild(svg.querySelector('#force'));
    }

    // The force
    force = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    force.setAttribute('id', 'force');
    force.setAttribute('visibility', 'hidden');
    force.setAttribute('marker-end', 'url(#arrow)');
    svg.appendChild(force);  
    
    if(svg.querySelector('#lens')){
      svg.removeChild(svg.querySelector('#lens'));
    }

    // The lens (that is just for the sake af being there)
    var lens = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lens.setAttribute('id', 'lens');

    // Some tewaking here maybe
    var lensY = 100, lensCY = -5, lensCX = 15;
    maxY = (lensY + 3 *(lensY + lensCY))/4; // max of bezier curve

    lens.setAttribute('d', `M ${(45 - widthLens/2)} ${lensY} c ${lensCX} ${lensCY}, ${(10 + widthLens - lensCX)} ${lensCY}, ${(10 + widthLens)} 0 c ${-lensCX} ${-lensCY}, ${(-10 - widthLens + lensCX)} ${-lensCY}, ${(-10 - widthLens)} 0 `);
    svg.appendChild(lens);

  }
  
  // for(let i=0; i<nRays; i++)
  // rays.push(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
  
  setUpLights()


  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  function keyDownHandler(evt){
    evt.preventDefault();
    // console.log(evt.code);
    if(evt.code == 'Space') fixToAxis = true;
    else if(evt.code == 'ArrowLeft' || evt.code == 'ArrowUp'){
      const clickEvent = new Event('click');
      prevBtn.dispatchEvent(clickEvent);
    }
    else if(evt.code == 'ArrowRight' || evt.code == 'ArrowDown'){
      const clickEvent = new Event('click');
      nextBtn.dispatchEvent(clickEvent);
    }
  }

  function keyUpHandler(evt){
    evt.preventDefault();
    fixToAxis = false;
  }

  function startDrag(evt){
    if(evt.target.classList.contains('draggable')){
      selectedElement = evt.target;
      offset = getMousePosition(evt);
      offset.x -= selectedElement.getAttributeNS(null,(selectedElement == circ ? "cx" : "x1"));
      offset.y -= selectedElement.getAttributeNS(null, (selectedElement == circ ? "cy" : "y1"));
    }
  }
  
  function drag(evt){

    if(selectedElement == circ){
      evt.preventDefault();
      var r = getMousePosition(evt);
      var cx = (fixToAxis ? 50 : r.x - offset.x);
      var cy = Math.min(r.y - offset.y, maxY - particleRadius);
      selectedElement.setAttributeNS(null, "cx", cx);
      selectedElement.setAttributeNS(null, "cy", cy);
      
    }
    else if(selectedElement == focalPlane){
      // console.log('trying to move focal plane?')
      evt.preventDefault();
      var r = getMousePosition(evt);
      var y = r.y - offset.y;
      selectedElement.setAttributeNS(null, "y1", y);
      selectedElement.setAttributeNS(null, "y2", y);
      focalLength = 100 - y;
      setUpLights();
    }

    for(let i =0; i<nRays; i++)
        paint(l[i], rays[i], refInts[i], refs[i]);

    var f = mult(calcForce(), fMult);
    if(dot(f, f) == 0){
      force.setAttributeNS(null, 'visibility', 'hidden');
    }
    else{
      var cx = parseFloat(circ.getAttributeNS(null, "cx"));
      var cy = parseFloat(circ.getAttributeNS(null, "cy"));
      force.setAttributeNS(null, 'visibility', 'visible');
      force.setAttributeNS(null, "x1", cx);
      force.setAttributeNS(null, "y1", cy);
      force.setAttributeNS(null, "x2", cx + f.x);
      force.setAttributeNS(null, "y2", cy + f.y);
    }
  }
  
  function endDrag(evt){
    selectedElement = null;
  }

  function paint(l , ray, refInt, ref){
    
    var cx = parseFloat(circ.getAttributeNS(null, "cx"));
    var cy = parseFloat(circ.getAttributeNS(null, "cy"));
    var inter = intersectionLineCircle(cx, cy, particleRadius, l.x1, l.y1, l.x2, l.y2);

    if(!inter) {
      refInt.setAttributeNS(null, "visibility", "hidden");
      ref.setAttributeNS(null, "visibility", "hidden");
      ray.setAttributeNS(null, 'x2', l.x2);  
      ray.setAttributeNS(null, 'y2', l.y2); 
      ref.setAttributeNS(null, 'x2', l.x2);  
      ref.setAttributeNS(null, 'y2', l.y2); 
      ref.setAttributeNS(null, 'x1', l.x1);  
      ref.setAttributeNS(null, 'y1', l.y1); 
      return;
    };

    // Interaction

    ray.setAttributeNS(null, 'x2', inter[1].x);  
    ray.setAttributeNS(null, 'y2', inter[1].y);

    // first refraction

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

    // second refraction

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

  // Force calculation
  function calcForce(){
    var p0 = {x: 0, y: 0};
    var p = {x: 0, y: 0};

    // console.log(p0, p);

    for(let i = 0; i<nRays; i++){
      p0 = sum(p0, unitaryVector({x: parseFloat(rays[i].getAttributeNS(null, 'x2')) - parseFloat(rays[i].getAttributeNS(null, 'x1')), y: parseFloat(rays[i].getAttributeNS(null, 'y2')) - parseFloat(rays[i].getAttributeNS(null, 'y1'))}));
      
      p = sum(p, unitaryVector({x: parseFloat(refs[i].getAttributeNS(null, 'x2')) - parseFloat(refs[i].getAttributeNS(null, 'x1')), y: parseFloat(refs[i].getAttributeNS(null, 'y2')) - parseFloat(refs[i].getAttributeNS(null, 'y1'))}));
 
    }

    return rest(p0, p);
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

  function sum(a, b){
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }

  function mult(a, k){
    return{
      x: k * a.x,
      y: k * a.y
    };
  }

  function rest(a, b){
    return sum(a, mult(b, -1));
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
