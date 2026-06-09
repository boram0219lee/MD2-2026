// Test Creature for Media Design II
// Canvas size: 1280 x 720
// Interaction: mouse movement + mouse click
// Sound: simple oscillator starts after click, because autoplay may be blocked by browsers.

let creatureX = 640;
let creatureY = 360;
let breath = 0;
let particles = [];
let osc;
let soundStarted = false;

function setup() {
  createCanvas(1280, 720);
  angleMode(RADIANS);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      r: random(1, 4),
      speed: random(0.2, 1.2),
      phase: random(TWO_PI)
    });
  }

  osc = new p5.Oscillator('sine');
  osc.freq(220);
  osc.amp(0);
}

function draw() {
  background(8, 10, 18);

  drawAtmosphere();

  // Mouse controls where the creature gently moves.
  let targetX = constrain(mouseX, 120, width - 120);
  let targetY = constrain(mouseY, 120, height - 120);
  creatureX = lerp(creatureX, targetX, 0.035);
  creatureY = lerp(creatureY, targetY, 0.035);

  breath += 0.035;
  let bodySize = 95 + sin(breath) * 10;

  drawCreature(creatureX, creatureY, bodySize);
  drawAura(creatureX, creatureY, bodySize);

  if (soundStarted) {
    let freq = map(mouseX, 0, width, 160, 520);
    let amp = map(mouseY, height, 0, 0.03, 0.16);
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.2);
  }
}

function drawAtmosphere() {
  noStroke();

  for (let p of particles) {
    let drift = sin(frameCount * 0.01 + p.phase) * 16;
    let distanceToMouse = dist(p.x, p.y, mouseX, mouseY);
    let alpha = map(distanceToMouse, 0, 500, 160, 30, true);

    fill(180, 210, 255, alpha);
    circle(p.x + drift, p.y, p.r);

    p.y -= p.speed;
    if (p.y < -10) {
      p.y = height + 10;
      p.x = random(width);
    }
  }
}

function drawAura(x, y, s) {
  noFill();

  for (let i = 0; i < 6; i++) {
    let radius = s + i * 28 + sin(breath + i) * 6;
    let alpha = map(i, 0, 5, 70, 8);

    stroke(150, 190, 255, alpha);
    strokeWeight(1.4);
    ellipse(x, y, radius * 2.1, radius * 1.35);
  }
}

function drawCreature(x, y, s) {
  push();
  translate(x, y);

  // Body
  noStroke();
  fill(210, 230, 255, 230);
  ellipse(0, 0, s * 1.25, s);

  fill(120, 170, 255, 110);
  ellipse(-s * 0.16, -s * 0.08, s * 0.45, s * 0.32);

  // Tentacles / sensitive lines
  stroke(210, 230, 255, 170);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < 8; i++) {
    let a = TWO_PI / 8 * i + sin(breath) * 0.08;
    let len = s * 0.7 + sin(breath + i) * 18;

    let x1 = cos(a) * s * 0.45;
    let y1 = sin(a) * s * 0.32;
    let x2 = cos(a) * len;
    let y2 = sin(a) * len * 0.75;

    bezier(x1, y1, x1 * 1.4, y1 * 1.4, x2 * 0.8, y2 * 0.8, x2, y2);
  }

  // Eyes
  noStroke();
  fill(20, 30, 50);
  let eyeShiftX = map(mouseX - x, -width / 2, width / 2, -5, 5, true);
  let eyeShiftY = map(mouseY - y, -height / 2, height / 2, -3, 3, true);

  ellipse(-s * 0.18 + eyeShiftX, -s * 0.08 + eyeShiftY, 12, 16);
  ellipse(s * 0.18 + eyeShiftX, -s * 0.08 + eyeShiftY, 12, 16);

  // Core
  fill(255, 255, 255, 190);
  circle(0, s * 0.12, s * 0.16 + sin(breath * 2) * 4);

  pop();
}

function mousePressed() {
  // Sound must start after user interaction.
  if (!soundStarted) {
    userStartAudio();
    osc.start();
    osc.amp(0.08, 0.4);
    soundStarted = true;
  }

  // Small burst reaction
  for (let i = 0; i < 18; i++) {
    particles.push({
      x: creatureX + random(-40, 40),
      y: creatureY + random(-40, 40),
      r: random(2, 6),
      speed: random(1.5, 3.5),
      phase: random(TWO_PI)
    });
  }

  if (particles.length > 140) {
    particles.splice(0, particles.length - 140);
  }
}
