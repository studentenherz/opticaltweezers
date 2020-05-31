var setup = document.querySelector('#setup');


const ids = ["setup-laserfrombeamsplitter", 'setup-laser', 'setup-camera', 'setup-mirror2', 'setup-mirror1', 'setup-lens2', 'setup-lens1', 'setup-image2camera', 'setup-filter','setup-beamsplitter', 'setup-laser3beamsplitter', 'setup-laser1', 'setup-laser2filter',  'setup-laser2lens','setup-laser2mirror',
  'setup-laserchange', 'setup-mirror3', 'setup-laser2objective', 'setup-positioner', 'setup-lightsource', 'setup-muestra', 'setup-objective'];
  
const descriptions = ["50% &nbsp;&nbsp; A=4", `&lambda; = 633 nm &nbsp;&nbsp;  I = 17 mW`, 'Cámara de video', 'Espejo ajustable', 'Espejo ajustable', 'f = 15 cm', 'f = 5cm', 'Imagen a la cámara', 'Filtro','Divisor de haz', '100% &nbsp;&nbsp; A=4', '100% &nbsp;&nbsp; A=1', '25% &nbsp;&nbsp; A=4',  '100% &nbsp;&nbsp; A=1','100% &nbsp;&nbsp; A=4',
'Ensanchamiento del haz', 'Espejo ajustable', '50% &nbsp;&nbsp; A=4', 'Posicionador XYZ', 'Fuente de luz blanca', 'Muestra', 'Objetivo de microscopio'];

ids.forEach((id, i) => {
  var elm = setup.querySelector('#'+id);

  elm.addEventListener('mouseover', function(evt){
    tooltip.innerHTML = descriptions[i];
    tooltip.style.display = 'block';
    showTooltip(evt);
  });

  elm.addEventListener('mousemove', function(evt){
    showTooltip(evt);
  });
  
  elm.addEventListener('mouseleave', function(evt){
    tooltip.style.display = 'none';
  });

  // console.log(elm);

});


var tooltip = document.querySelector('#setup-tooltip');
tooltip.style.position = 'absolute';
const dx = 30,
dy = -40;

function showTooltip(evt){
  tooltip.style.left = (evt.pageX + dx) + "px";
  tooltip.style.top = (evt.pageY + dy) + "px";
}
