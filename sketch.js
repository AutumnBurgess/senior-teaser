// platformer code taken from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 
let shredIndex = 0;
let clicks = [];
let looping = false;
let kickMidi;
let hatMidi;
let bassMidi;
let allSound;
let playing = false;
let kickTimer = 0;
let hatTimer = 0;
let bassStart = 0;
let bassEnd = 0;
let bassRunning = false;
let distortionShader;
let state = 1;

const WIPE_SECTIONS = 20;
const PALETTES = [{ fg: 'black', bg: 'white', mg: 'lightgrey' }, { fg: 'orange', bg: 'blue', mg: 'lightblue' }, { fg: 'green', bg: 'pink', mg: 'lightpink' }];
const BORDER_PIXEL = 8;
let borderHeight = 3;
const DEBUG = false;
const U = 0;
const D = 1;
const L = 2;
const R = 3;
let border = [];

let curPalette = 0;
let wipeIndex = 0;
let wipeDir = R;
let wipePosition = 0;

let x = 100;
let y = 100;
let vx = 10;
let vy = 10;
let BALL_RADIUS = 100;
let jumpPressed = false;
let rects = [];
let kickRects = [];
let hatRects = [];
let origin;
let center;
//distortion begins at 90 seconds
function preload() {
  kickMidi = loadJSON('midis/kick.json');
  hatMidi = loadJSON('midis/hat.json');
  bassMidi = loadJSON('midis/bass.json');
  allSound = loadSound('sounds/anticipation.wav');
}

function setup() {
  // center = createVector(0, 500);
  let kickTimes = kickMidi.tracks[0].notes.map(e => e.time);
  kickTimes.forEach(time => {
    allSound.addCue(time, onKick, time);
  });
  let hatTimes = hatMidi.tracks[0].notes.map(e => e.time);
  hatTimes.forEach(time => {
    allSound.addCue(time, onHat, time);
  });
  let bassTimes = bassMidi.tracks[0].notes.map(e => {return {t: e.time, d: e.duration}});
  bassTimes.forEach(note => {
    allSound.addCue(note.t, onBass, note);
  });

  createCanvas(windowWidth, windowHeight, 'p2d').parent('#p5here');
  colorMode(HSB, 100);
  rects.push(new Rectangle(-5000, 560, 10000, 40));
  rects.push(new Rectangle(200, 420, 200, 40));
  rects.push(new Rectangle(250, 300, 200, 50));
  rects.push(new Rectangle(150, 150, 50, 50));
  rects.push(new Rectangle(400, 100, 50, 50));
  rects.push(new Rectangle(500, 10, 145, 60));
  rects.push(new Rectangle(760, -50, 200, 150));
  rects.push(new Rectangle(600, -200, 100, 80));
  rects.push(new Rectangle(220, -300, 300, 50));
  rects.push(new Rectangle(40, -440, 80, 150));
  rects.push(new Rectangle(238, -562, 200, 50));
  rects.push(new Rectangle(528, -645, 500, 110));
  rects.push(new Rectangle(1410, -439, 300, 300));
  rects.push(new Rectangle(1640, -574, 50, 50));
  rects.push(new Rectangle(1740, -734, 50, 50));
  rects.push(new Rectangle(1840, -894, 50, 50));
  rects.push(new Rectangle(1940, -1054, 50, 50));
  rects.push(new Rectangle(-358, 3, 140, 300));
  rects.push(new Rectangle(-280, -531, 120, 90));

  rects.push(new Rectangle(-1109, 370, 220, 50));
  rects.push(new Rectangle(-878, 0, 100, 100));
  rects.push(new Rectangle(-1273, 20, 110, 190));


  kickRects.push(new Rectangle(0, 0, 100, 100));
  hatRects.push(new Rectangle(100, 300, 100, 100));
  kickRects.push(new Rectangle(500, 280, 200, 180));
  hatRects.push(new Rectangle(300, -100, 100, 100));
  kickRects.push(new Rectangle(426, -435, 40, 90));
  hatRects.push(new Rectangle(767, -380, 400, 100));
  kickRects.push(new Rectangle(981, -152, 100, 100));
  kickRects.push(new Rectangle(100, -208, 150, 90));
  hatRects.push(new Rectangle(-143, -322, 100, 40));
  kickRects.push(new Rectangle(663, -502, 200, 100));
  hatRects.push(new Rectangle(50, -640, 90, 40));
  kickRects.push(new Rectangle(446, -840, 100, 100));
  hatRects.push(new Rectangle(840, -722, 150, 40));
  kickRects.push(new Rectangle(1207, -640, 150, 200));
  hatRects.push(new Rectangle(1221, 302, 150, 200));
  kickRects.push(new Rectangle(910, 395, 170, 20));
  hatRects.push(new Rectangle(1486, -814, 1000, 60));
  hatRects.push(new Rectangle(1304, -1184, 40, 450));

  hatRects.push( new Rectangle(-793, 370, 220, 120));
  kickRects.push(new Rectangle(-1061, 180, 180, 80));
  hatRects.push( new Rectangle(-1378, 100, 90, 120));
  kickRects.push(new Rectangle(-649, 40, 120, 300));

  
  
  
  

  origin = {
    x: width / 2,
    y: height / 2
  }

  center = {
    x: width / 2,
    y: height / 2
  }
  dx = center.x - p.x;
  dy = center.y - p.y;

  if (DEBUG){
    p.y = -340;
  }
}

function onKick(time) {
  kickTimer = 20;
}

function onHat(time) {
  hatTimer = 15;
}

function onBass(note) {
  bassRunning = true;
  bassStart = note.t;
  bassEnd = note.t + note.d;
}

function draw() {
  if (!playing) {
    textAlign(CENTER);
    textSize(100);
    text("click", width / 2, height / 2);
    return;
  }
  if (state == 1){
    update();
  } else if (state == 2){
    end();
  }
  push();
  drawScene();
  pop();
  drawBorder();
  
}

function end(){
  p.y -= 8;
}

function drawScene() {
  borderHeight = floor(map(p.y, 0, -1100, 0, 50));
  kickTimer = max(kickTimer - 1, 0);
  hatTimer = max(hatTimer - 1, 0);
  let oldPalette = PALETTES[curPalette];
  let newPalette = PALETTES[(curPalette + 1) % PALETTES.length];
  let translateX = origin.x - center.x;
  let translateY = origin.y - center.y + 100;
  let wipeOffset = wipeDir == L || wipeDir == R ? translateX : translateY;
  noStroke();
  let bgRect = new Rectangle(0, 0, width, height);
  bgRect.draw(oldPalette.bg, newPalette.bg, wipePosition, wipeDir)
  translate(translateX, translateY);

  for (let i = 0; i < kickRects.length; i++) {
    kickRects[i].draw(oldPalette.mg, newPalette.mg, wipePosition - wipeOffset, wipeDir, kickTimer)
  }

  for (let i = 0; i < hatRects.length; i++) {
    hatRects[i].draw(oldPalette.mg, newPalette.mg, wipePosition - wipeOffset, wipeDir, hatTimer)
  }

  p.draw(oldPalette.fg, newPalette.fg, wipePosition - wipeOffset, wipeDir);
  for (let i = 0; i < rects.length; i++) {
    rects[i].draw(oldPalette.fg, newPalette.fg, wipePosition - wipeOffset, wipeDir);
  }
  if (DEBUG) {
    push();
    noFill();
    stroke(0);
    rect(center.x - 100, center.y - 100, 200, 200);
    pop();
  }
}

function drawBorder() {
  if (frameCount % 5 == 0) {
    border = [];
    for (let y = 0; y < borderHeight; y++) {
      let row = [];
      for (let x = 0; x < width / BORDER_PIXEL; x++) {
        row.push(color(random(100), random(40, 80), random(90, 100)));
      }
      border.push(row);
    }
  }
  noStroke();
  for (let y = 0; y < border.length; y++) {
    const row = border[y];
    for (let x = 0; x < row.length; x++) {
      const col = row[x];
      fill(col);
      rect(x * BORDER_PIXEL, y * BORDER_PIXEL, BORDER_PIXEL, BORDER_PIXEL);
    }
  }
}

function update() {
  let curTime = allSound.currentTime();
  if (bassRunning) {
    switch (wipeDir) {
      case L:
        wipePosition = map(curTime, bassStart, bassEnd, 0, width);
        break;
      case R:
        wipePosition = map(curTime, bassStart, bassEnd, width, 0);
        break;
      case U:
        wipePosition = map(curTime, bassStart, bassEnd, 0, height);
        break;
      case D:
        wipePosition = map(curTime, bassStart, bassEnd, height, 0);
        break;
      case L:
    }
    wipePosition = map(curTime, bassStart, bassEnd, 0, width);
  }
  if (curTime >= bassEnd && bassRunning) {
    bassRunning = false;
    curPalette = (curPalette + 1) % PALETTES.length;
    // wipeDir = random([U, D, L, R]);
    wipePosition = 0;
  }
  dx = center.x - p.x;
  dy = center.y - p.y;

  if (abs(dx) > 100) {
    center.x -= dx - 100 * dx / abs(dx)
  }

  if (abs(dy) > 100) {
    center.y -= dy - 100 * dy / abs(dy)
  }

  p.colliding = false;

  for (let i = 0; i < rects.length; i++) {
    let r = rects[i];
    let top = new Rectangle(r.x, r.y - 10, r.w, 10)
    let btm = new Rectangle(r.x, r.y + r.h, r.w, 10)
    let lt = new Rectangle(r.x - 10, r.y, 10, r.h)
    let rt = new Rectangle(r.x + r.w, r.y, 10, r.h)

    // Additional Criteria or Smoother Gameplay
    if (rectCollision(lt, p) && p.vx > 0 && p.y + p.h - 10 > top.y + top.h) {
      p.anticipate = "LEFT"
    }
    if (rectCollision(rt, p) && p.vx < 0 && p.y + p.h - 10 > top.y + top.h) {
      p.anticipate = "RIGHT"
    }
    if (rectCollision(btm, p)) {
      p.anticipate = "CEILING"
    }
    if (rectCollision(top, p) && p.y + p.h - 5 < top.y + top.h && p.vy > 0) {
      p.anticipate = "FLOOR"
    }

    if (rectCollision(p, r)) {
      if (p.anticipate == "FLOOR") {
        p.vy = 0;
        p.y = r.y - p.h
        p.onGround = true;
        p.colliding = true;
      }
      if (p.anticipate == "CEILING") {
        if (p.vy < 0) {
          p.vy = 0;
          p.y = r.y + r.h
        }
        p.colliding = true;
      }
      if (p.anticipate == "RIGHT") {
        p.vx = 0;
        p.x = r.x + r.w
        p.colliding = true;
      }
      if (p.anticipate == "LEFT") {
        p.vx = 0;
        p.x = r.x - p.w
        p.colliding = true;
      }
    }
  }
  if (!p.colliding) p.onGround = false
  p.update()
  jumpPressed = false;
  if (p.y <= -1255) state = 2;
}