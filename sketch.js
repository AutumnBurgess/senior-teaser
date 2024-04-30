// platformer code taken from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 
let shredIndex = 0;
let clicks = [];
let looping = false;
let arpMidi;
let hihatMidi;
let kickMidi;
let padMidi;
let synbassMidi;
let arpSound;
let hihatSound;
let kickSound;
let padSound;
let synbassSound;
let allSound;
let playing = false;
let kickTimer = 0;

const WIPE_SECTIONS = 20;
const PALETTES = [{ fg: 'black', bg: 'white', mg: 'lightgrey' }, { fg: 'orange', bg: 'blue', mg: 'lightblue' }, { fg: 'green', bg: 'pink', mg: 'lightpink' }];
const BORDER_PIXEL = 5;
const BORDER_HEIGHT = 3;
const DEBUG = false;
const U = 0;
const D = 1;
const L = 2;
const R = 3;
let border = [];

let curPalette = 0;
let wipeIndex = 0;
let wipeDir = R;

let x = 100;
let y = 100;
let vx = 10;
let vy = 10;
let BALL_RADIUS = 100;
let jumpPressed = false;
let rects = [];
let bgRects = [];
let origin;
let center;

function preload() {
  kickMidi = loadJSON('midis/kick.json');
  kickSound = loadSound('sounds/anticipation kick.wav');
  allSound = loadSound('sounds/anticipation.wav');
}

function setup() {
  let times = kickMidi.tracks[0].notes.map(e => e.time);
  print(times);
  times.forEach(time => {
    allSound.addCue(time, onKick, time);
  });

  createCanvas(windowWidth, windowHeight, 'p2d').parent('#p5here');
  colorMode(HSB, 100);
  rects.push(new Rectangle(-500, 560, 2000, 40));
  rects.push(new Rectangle(200, 420, 200, 40));
  rects.push(new Rectangle(250, 300, 200, 50));
  rects.push(new Rectangle(150, 150, 50, 50));
  rects.push(new Rectangle(400, 100, 50, 50));
  rects.push(new Rectangle(500, 10, 145, 60));
  rects.push(new Rectangle(760, -50, 200, 150));
  rects.push(new Rectangle(600, -200, 100, 80));
  rects.push(new Rectangle(220, -300, 300, 50));

  bgRects.push(new Rectangle(0, 0, 100, 100));
  bgRects.push(new Rectangle(100, 300, 100, 100));
  bgRects.push(new Rectangle(500, 280, 200, 180));
  bgRects.push(new Rectangle(300, -100, 100, 100));
  bgRects.push(new Rectangle(426, -435, 40, 100));
  bgRects.push(new Rectangle(767, -380, 400, 100));


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

function onKick(time) {
  kickTimer = 10;
}

function draw() {
  if (!playing) {
    textAlign(CENTER);
    textSize(100);
    text("press a button", width / 2, height / 2);
  } else {
    update();
    push();
    drawScene();
    pop();
    drawBorder();
  }
}

function drawScene() {
  let oldPalette = PALETTES[curPalette];
  let newPalette = PALETTES[(curPalette + 1) % PALETTES.length];
  let translateX = origin.x - center.x;
  let translateY = origin.y - center.y;
  let wipePosition = wipeIndex * ((wipeDir == L || wipeDir == R ? width : height) / WIPE_SECTIONS);
  let wipeOffset = wipeDir == L || wipeDir == R ? translateX : translateY;
  noStroke();
  let bgRect = new Rectangle(0, 0, width, height);
  bgRect.draw(oldPalette.bg, newPalette.bg, wipePosition, wipeDir)
  translate(translateX, translateY);

  for (let i = 0; i < bgRects.length; i++) {
    bgRects[i].draw(oldPalette.mg, newPalette.mg, wipePosition - wipeOffset, wipeDir, kickTimer)
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
    for (let y = 0; y < BORDER_HEIGHT; y++) {
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
  kickTimer = max(kickTimer - 1, 0);

  if (frameCount % 5 == 0) {
    incrementWipe();
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
}

function incrementWipe() {
  // if (wipeDir == R || wipeDir == D){
  //   wipeIndex++;
  //   if (wipeIndex == WIPE_SECTIONS) {
  //     wipeDir = random([U,D,L,R]);
  //     wipeIndex = wipeIndex == U || wipeIndex == L ? WIPE_SECTIONS : 0;
  //     curPalette = (curPalette + 1) % PALETTES.length;
  //   }
  // } else {
  //   wipeIndex--;
  //   if (wipeIndex == 0) {
  //     wipeDir = random([U,D,L,R]);
  //     wipeIndex = wipeIndex == U || wipeIndex == L ? WIPE_SECTIONS : 0;
  //     curPalette = (curPalette + 1) % PALETTES.length;
  //   }
  // }
  wipeIndex++;
  if (wipeIndex == WIPE_SECTIONS) {
    //wipeDir = random([U,D,L,R]);
    //wipeIndex = wipeIndex == U || wipeIndex == L ? WIPE_SECTIONS : 0;
    wipeDir = R;
    wipeIndex = 0;
    curPalette = (curPalette + 1) % PALETTES.length;
  }
}