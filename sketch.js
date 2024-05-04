// platformer code taken from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 
let kickMidi;
let hatMidi;
let bassMidi;
let arpMidi;
let introSound;
let mainSound;
let outroSound;
let playing = false;
let kickTimer = 0;
let hatTimer = 0;
let bassStart = 0;
let bassEnd = 0;
let bassRunning = false;
const WAITING = 0;
const INTRO = 1;
const MAIN = 2;
const OUTRO = 3;
let state = WAITING;
let curCorner = 0;
let curCornerMod = 0;
const CORNER_MOD = 4;

const PALETTES = [{ fg: 'black', bg: 'white', mg: 'lightgrey' }, { fg: 'orange', bg: 'blue', mg: 'lightblue' }, { fg: 'green', bg: 'pink', mg: 'lightpink' }];
let borderHeight = 0;
const DEBUG = false;

let curPalette = 0;
let wipeIndex = 0;
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
let colorFrames = [];
let curColorFrame = 0;
let origin;
let center;
//distortion begins at 90 seconds
function preload() {
  kickMidi = loadJSON('midis/kick.json');
  hatMidi = loadJSON('midis/hat.json');
  bassMidi = loadJSON('midis/bass.json');
  arpMidi = loadJSON('midis/arp.json');
  introSound = loadSound('sounds/intro.wav');
  mainSound = loadSound('sounds/anticipation.wav');
  outroSound = loadSound('sounds/outro.wav');
  for (let i = 0; i <= 60; i++) {
    const path = 'colorFrames/frame' + str(i) + '.png' // create a path to the image
    const loaded_image = loadImage(path)     // load the image from the path
    colorFrames.push(loaded_image)             // add the loaded path to ims
  }
}

function setup() {
  addCues();

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

  hatRects.push(new Rectangle(-793, 370, 220, 120));
  kickRects.push(new Rectangle(-1061, 180, 180, 80));
  hatRects.push(new Rectangle(-1378, 100, 90, 120));
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
}

function draw() {
  if (state == WAITING) {
    textAlign(CENTER);
    textSize(100);
    text("click", width / 2, height / 2);
    return;
  } else if (state == INTRO) {
    dx = center.x - p.x;
    dy = center.y - p.y;
    if (abs(dx) > 100) {
      center.x -= dx - 100 * dx / abs(dx)
    }
    if (abs(dy) > 100) {
      center.y -= dy - 100 * dy / abs(dy)
    }
    const zoomLevel = map(introSound.currentTime(), 0, introSound.duration(), 10, 1);
    translate(873, 646);
    scale(zoomLevel);
    translate(-873, -646);
    drawScene();
  } else if (state == MAIN) {
    update();
    drawScene();
    drawEdge();
  } else if (state == OUTRO) {
    outro();
    drawScene();
    drawEdge();
  }
}

function mousePressed() {
  print(mouseX + ", " + mouseY);
  if (state != WAITING) return;
  state = MAIN;
  mainSound.play();
}

function outro() {
  p.y -= 6;
}

function drawScene() {
  push();
  let newHeight = map(p.y, 0, -1100, 0, 480);
  newHeight = newHeight - (newHeight % 8);
  borderHeight = max(borderHeight, newHeight);
  kickTimer = max(kickTimer - 1, 0);
  hatTimer = max(hatTimer - 1, 0);
  let oldPalette = PALETTES[curPalette];
  let newPalette = PALETTES[(curPalette + 1) % PALETTES.length];
  let translateX = origin.x - center.x;
  let translateY = origin.y - center.y + 100;
  let wipeOffset = translateX;
  noStroke();
  let bgRect = new Rectangle(0, 0, width, height);
  bgRect.draw(oldPalette.bg, newPalette.bg, wipePosition)
  translate(translateX, translateY);

  for (let i = 0; i < kickRects.length; i++) {
    kickRects[i].draw(oldPalette.mg, newPalette.mg, wipePosition - wipeOffset, kickTimer)
  }

  for (let i = 0; i < hatRects.length; i++) {
    hatRects[i].draw(oldPalette.mg, newPalette.mg, wipePosition - wipeOffset, hatTimer)
  }

  p.draw(oldPalette.fg, newPalette.fg, wipePosition - wipeOffset, curCorner);

  for (let i = 0; i < rects.length; i++) {
    if (i % CORNER_MOD == curCornerMod) {
      rects[i].drawNotched(oldPalette.fg, newPalette.fg, wipePosition - wipeOffset, curCorner);
    } else {
      rects[i].draw(oldPalette.fg, newPalette.fg, wipePosition - wipeOffset);
    }

  }

  if (DEBUG) {
    push();
    noFill();
    stroke(0);
    rect(center.x - 100, center.y - 100, 200, 200);
    pop();
  }
  pop();
}

function drawEdge() {
  if (frameCount % 5 == 0) {
    curColorFrame = floor(random(0, colorFrames.length));
  }
  push();
  image(colorFrames[curColorFrame], 0, min(borderHeight - 1080, 0));
  pop();
}

function update() {
  let curTime = mainSound.currentTime();
  if (bassRunning) {
    wipePosition = map(curTime, bassStart, bassEnd, 0, width);
  }
  if (curTime >= bassEnd && bassRunning) {
    bassRunning = false;
    curPalette = (curPalette + 1) % PALETTES.length;
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
  if (p.y <= -1255) {
    state = OUTRO;
    outroSound.play();
    mainSound.pause();
  }
}