let size = 200.0;

const canvas = document.getElementById('mesh');
const mesh = canvas.getContext('2d');
canvas.width = size;
canvas.height = size;

mesh.imageSmoothingEnabled = false

let min = -2.0;
let max = 2.0;

let itr = 500; // max iterations
let inf = 4.0; // assumed infinity

let col = 0;

zx = 0.0, zy = 0.0;
cx = 0.0, cy = 0.0;

window.onload = () => {
    render();
}

function render() {

    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            cx = map(x, 0, size, min, max);
            cy = map(y, 0, size, min, max);

            // determines how quickly the complex number number x + yi escapes to infinity
            q = compute(cx, cy);

            const hue = (360 * q) / itr;
            const saturation = 100;
            const lightness = q < itr ? 50 : 0;

            const color = `hsl(${hue - col}, ${saturation}%, ${lightness}%)`;

            mesh.fillStyle = color;
            mesh.fillRect(x , y , 1, 1);
        }
    }
    //requestAnimationFrame(render);

}

function compute(cx, cy) {
    zx = 0;
    zy = 0;
    for (i = 1; i <= itr; i++) {
        a = (zx * zx - zy * zy) + cx;
        b = 2 * zx * zy + cy;
        zx = a, zy = b;
        if ((zx * zx + zy * zy) > inf)
            return i;

        // zx = nzx;
        // zy = nzy;
    }
    return itr;
}

// linearly maps value from the range (a..b) to (c..d)
function map(value, a, b, c, d) {
    value = (value - a) / (b - a);
    return c + value * (d - c);
}




var slider = document.getElementById("myRange");
var output = document.getElementById("colorVal");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    col = this.value;
  output.innerHTML = this.value;
  const value = this.value;
  const max = slider.max;
  const percent = (value / max) * 100;
  slider.style.setProperty('--thumb-position', `${percent}%`);
  window.onload();
}
