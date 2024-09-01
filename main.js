let size = 200.0;

const canvas = document.getElementById('mesh');
const mesh = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;

mesh.imageSmoothingEnabled = false


let genJuliaSet = false;
let tricon = false;

let min = -2.0;
let max = 2.0;

let itr = 500; // max iterations
let inf = 4.0; // assumed infinity

let col = 160;
let spread = 1.2;
let initial_zx = 0.0;
let initial_zy = 0.0;
let c_x = 0.0;
let c_y = -0.7;

window.onload = () => {
    render();
}

function render() {

    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            a = map(x, 0, size, min, max);
            b = map(y, 0, size, min, max);

            // determines how quickly the complex number number x + yi escapes to infinity
            if(genJuliaSet) {
              // keep c constant & change z
              q = compute(a , b , c_x , c_y);
            } else {
              // keep z constant & change c
              q = compute(initial_zx , initial_zy , a , b);
            }

            const hue = (360 * q*spread) / itr;
            const saturation = 100;
            const lightness = q < itr ? 50 : 0;
   
            const color = `hsl(${hue - col}, ${saturation}%, ${lightness}%)`;

            mesh.fillStyle = color;
            mesh.fillRect(x , y , 1, 1);
        }
    }
    //requestAnimationFrame(render);

}

function compute(zx , zy , cx, cy) {
    for (i = 1; i <= itr; i++) {
        new_zx = (zx * zx - zy * zy) + cx;
        new_zy = 2 * zx * zy + cy;
        if(tricon)
          new_zy = -new_zy;
        zx = new_zx, zy = new_zy;
        if ((zx * zx + zy * zy) > inf)
          return i;
    }
    return itr;
}

// linearly maps value from the range (a..b) to (c..d)
function map(value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}





// customisation part

var genType = document.getElementById("set-type");
genType.oninput = function() {
  if(genJuliaSet) {
    genJuliaSet = false;
  } else {
    genJuliaSet = true;
  }
  render();
}


var colorSlider = document.getElementById("colorRange");
var colorOutput = document.getElementById("colorVal");
colorOutput.innerHTML = colorSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
colorSlider.oninput = function() {
  col = this.value;
  colorOutput.innerHTML = this.value;
  const value = this.value;
  const max = colorSlider.max;
  const percent = (value / max) * 100;
  colorSlider.style.setProperty('--thumb-position', `${percent}%`);
  render();
}


var cx_input = document.getElementById("cxInput");
var cy_input = document.getElementById("cyInput");
var cx_output = document.getElementById("cxVal");
var cy_output = document.getElementById("cyVal");

cx_input.oninput = function() {
  const value = +this.value;
  const max = +cx_input.max;
  const percent = map(value , +cx_input.min , max , 0 , 100);
  cx_input.style.setProperty('--thumb-position', `${percent}%`);
  //console.log(percent);
  
  c_x = +this.value;
  cx_output.innerHTML = "cx :" + ' ' + this.value;
  if(genJuliaSet)
    render();
}

cy_input.oninput = function() {
  const value = +this.value;
  const max = +cy_input.max;
  const percent = map(value , +cy_input.min , max , 0 , 100);
  
  cy_input.style.setProperty('--thumb-position', `${percent}%`);
  c_y = +this.value;
  cy_output.innerHTML = 'cy :' + ' ' + this.value;
  if(genJuliaSet)
    render();
}