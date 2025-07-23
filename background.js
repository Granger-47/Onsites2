const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const maxradius = 40;
const minradius = 5;
let opacity = 0.5;
const colourarray = [
    `rgba(255,0,0,${opacity})`,
    `rgba(0,255,0,${opacity})`,
    `rgba(0,0,255,${opacity})`
];

function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colourarray[Math.floor(Math.random() * colourarray.length)];

    this.draw = function () {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        bgCtx.stroke();
        bgCtx.fillStyle = this.color;
        bgCtx.fill();
    };

    this.update = function () {
        this.draw();
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx *= -1;
        }
        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy *= -1;
        }
        this.x += this.dx;
        this.y += this.dy;
    };
}

const circlearray = [];
for (let i = 0; i < 200; i++) {
    const radius = Math.random() * (maxradius - minradius) + minradius;
    const x = Math.random() * (window.innerWidth - 2 * radius) + radius;
    const y = Math.random() * (window.innerHeight - 2 * radius) + radius;
    const dx = (Math.random() - 0.5) * 5;
    const dy = (Math.random() - 0.5) * 5;
    circlearray.push(new Circle(x, y, dx, dy, radius));
}

function animateBackground() {
    requestAnimationFrame(animateBackground);
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    const gradient = bgCtx.createLinearGradient(0, 0, 0, bgCanvas.height);
    gradient.addColorStop(0, "#0f0f0f");   
    gradient.addColorStop(0.5, "#1a2e2b"); 
    gradient.addColorStop(1, "#121212");    

    bgCtx.fillStyle = gradient;
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    for (let i = 0; i < circlearray.length; i++) {
        circlearray[i].update();
    }
}
animateBackground();
