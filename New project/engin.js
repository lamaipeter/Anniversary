const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const readLink = document.getElementById("readLink");

let envelopeOpened = false;
let envelopeAlpha = 1;
let fadeOut = false;
let heartScale = 14;
let growing = true;
let heartDrawIndex = 0;
let heartOutlinePoints = [];
let heartGrowComplete = false;
let textX = -canvas.width;
let frame = 0;
const message = "Happy 3 Year Anniversary Babe";
const fontSize = 40;
ctx.font = `${fontSize}px Times New Roman`;

let envelope = {
  x: canvas.width / 2 - 100,
  y: canvas.height / 2 - 60,
  dx: Math.random() < 0.5 ? -3 : 3,
  dy: Math.random() < 0.5 ? -3 : 3,
  width: 200,
  height: 120
};

let rosePetals = Array.from({ length: 30 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * -canvas.height,
  speed: 1 + Math.random() * 2
}));

function drawEnvelope(opened) {
  ctx.save();
  ctx.globalAlpha = envelopeAlpha;
  ctx.fillStyle = "#fff";
  ctx.fillRect(envelope.x, envelope.y, envelope.width, envelope.height);
  ctx.fillStyle = "#ccc";
  ctx.beginPath();
  if (!opened) {
    ctx.moveTo(envelope.x, envelope.y);
    ctx.lineTo(envelope.x + envelope.width / 2, envelope.y + 60);
    ctx.lineTo(envelope.x + envelope.width, envelope.y);
  } else {
    ctx.moveTo(envelope.x, envelope.y);
    ctx.lineTo(envelope.x + envelope.width / 2, envelope.y - 60);
    ctx.lineTo(envelope.x + envelope.width, envelope.y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function heartPoints(scale, offsetX, offsetY) {
  let points = [];
  for (let i = 0; i < 360; i++) {
    let k = i * Math.PI / 180;
    let x = 15 * Math.pow(Math.sin(k), 3) * scale;
    let y = (12 * Math.cos(k) - 5 * Math.cos(2 * k) - 2 * Math.cos(3 * k) - Math.cos(4 * k)) * scale;
    points.push({ x: offsetX + x, y: offsetY - y });
  }
  return points;
}

function drawHeart() {
  if (!heartGrowComplete) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < heartDrawIndex; i++) {
      let p1 = heartOutlinePoints[i];
      let p2 = heartOutlinePoints[i + 1];
      if (p1 && p2) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
    }
    ctx.stroke();
    heartDrawIndex++;
    if (heartDrawIndex >= heartOutlinePoints.length - 1) {
      heartGrowComplete = true;
    }
  } else {
    if (growing) {
      heartScale += 0.2;
      if (heartScale >= 14) growing = false;
    } else {
      heartScale -= 0.2;
      if (heartScale <= 12) growing = true;
    }
    let points = heartPoints(heartScale, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let p of points) {
      ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

function drawFirework() {
  let x = 100 + Math.random() * (canvas.width - 200);
  let y = 100 + Math.random() * (canvas.height - 200);
  let colors = ["yellow", "cyan", "magenta", "orange", "lime"];
  let color = colors[Math.floor(Math.random() * colors.length)];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let angle = 0; angle < 360; angle += 30) {
    let dx = 50 * Math.cos(angle * Math.PI / 180);
    let dy = 50 * Math.sin(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }
}

function drawRoses() {
  for (let petal of rosePetals) {
    ctx.fillStyle = "#ff007f";
    ctx.beginPath();
    ctx.arc(petal.x, petal.y, 5, 0, Math.PI * 2);
    ctx.fill();
    petal.y += petal.speed;
    petal.x += Math.sin(petal.y / 30) * 0.5;
    if (petal.y > canvas.height) {
      petal.y = Math.random() * -100;
      petal.x = Math.random() * canvas.width;
      petal.speed = 1 + Math.random() * 2;
    }
  }
}

function drawMessage() {
  ctx.fillStyle = "#fff";
  ctx.fillText(message, textX, canvas.height / 2 + 40);
  textX += 2;
  if (textX > canvas.width) {
    textX = -ctx.measureText(message).width;
  }
  readLink.style.display = "block"; // Show the link here 💌
}

canvas.addEventListener("click", (e) => {
  if (!envelopeOpened) {
    let rect = { x: envelope.x, y: envelope.y, width: envelope.width, height: envelope.height };
    if (
      e.clientX >= rect.x &&
      e.clientX <= rect.x + rect.width &&
      e.clientY >= rect.y &&
      e.clientY <= rect.y + rect.height
    ) {
      envelopeOpened = true;
      fadeOut = true;
      heartOutlinePoints = heartPoints(heartScale, canvas.width / 2, canvas.height / 2);
      heartDrawIndex = 0;
      heartGrowComplete = false;
    }
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!envelopeOpened) {
    envelope.x += envelope.dx;
    envelope.y += envelope.dy;
    if (envelope.x <= 0 || envelope.x + envelope.width >= canvas.width) envelope.dx *= -1;
    if (envelope.y <= 0 || envelope.y + envelope.height >= canvas.height) envelope.dy *= -1;
    drawEnvelope(false);
    readLink.style.display = "none";
  } else {
    if (fadeOut) {
      envelopeAlpha -= 0.05;
      if (envelopeAlpha <= 0) {
        envelopeAlpha = 0;
        fadeOut = false;
      }
    }
    if (envelopeAlpha > 0) drawEnvelope(true);
    if (envelopeAlpha === 0) {
      drawRoses();
      drawHeart();
      drawMessage();
      if (frame % 30 === 0) drawFirework();
    }
  }

  frame++;
  requestAnimationFrame(animate);
}

animate();
