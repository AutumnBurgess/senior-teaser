let mp3;
const SNARE_TIME_1 = 16;
const SNARE_TIME_2 = 16;
const SHORT_STRENGTH = 25;
const LONG_STRENGTH = 50;
const KICK_TIME = 50;
const BG_SECTIONS = 50;
const BAR_WIDTH = 40;
const BALL_RADIUS = 80;
const DRAG = 0.98;
let snareTimer = 0;
let snarePos = 0;
let snareTop = false;
let kickTimer = 0;
let bellTimer = 0;
let ballPos;
let ballVel;
let effectTimer = 0;
let BGColors;
let BGIndex = 0;
let BGPosition = 0;
let BGDirection = "up";

function preload() {
  mp3 = loadSound("DEGCOHT cut.mp3");
}

function setup() {
  createCanvas(1200, 800);
  textAlign(CENTER);
  textSize(100);
  createKickCues();
  createBellCues();
  createSnareCues();
  createEffectCues();
  mp3.onended(reset);
  reset();
}

function reset() {
  BGColors = ["darkgrey", "blue", "darkgreen"]
  snareTimer = 0;
  snarePos = 0;
  kickTimer = 0;
  bellTimer = 0;
  ballPos = createVector(width / 2, height / 2);
  ballVel = createVector(0, 0);
  effectTimer = 0;
  BGIndex = 0;
  BGPosition = 0;
}

function draw() {
  background(BGColors[0]);
  if (!mp3.isPlaying()) {
    fill("black");
    text("Click to begin", width / 2, height / 2);
    return;
  }
  effectTimer = max(effectTimer - 1, 0);
  kickTimer = max(kickTimer - 6, 0);
  snareTimer = max(snareTimer - 1, 0);

  updateBall();
  drawBackground();
  drawSnareBar();
  drawBall();
}

function moveBackground() {
  BGPosition++;
  if (BGPosition >= BG_SECTIONS) {
    BGIndex = (BGIndex + 1) % BGColors.length;
    BGPosition = 0;
    BGDirection = random(["left", "right", "up", "down"]);
  }
}

function drawBackground() {
  if (effectTimer > 0) moveBackground();
  background(BGColors[BGIndex]);
  const nextBG = (BGIndex + 1) % BGColors.length;
  noStroke();
  fill(BGColors[nextBG]);
  switch (BGDirection) {
    case "right":
      rect(0, 0, (width / BG_SECTIONS) * BGPosition, height);
      break;
    case "left":
      rect((width / BG_SECTIONS) * (BG_SECTIONS - BGPosition), 0, width, height);
      break;
    case "up":
      rect(0, (height / BG_SECTIONS) * (BG_SECTIONS - BGPosition), width, height);
      break;
    case "down":
      rect(0, 0, width, (height / BG_SECTIONS) * BGPosition);
      break;
  }

}

function updateBall() {
  if (ballPos.x < BALL_RADIUS || ballPos.x > width - BALL_RADIUS) {
    ballPos.x = constrain(ballPos.x, BALL_RADIUS, width - BALL_RADIUS);
    ballVel.x = -ballVel.x;
  }
  if (ballPos.y < BALL_RADIUS || ballPos.y > height - BALL_RADIUS) {
    ballPos.y = constrain(ballPos.y, BALL_RADIUS, height - BALL_RADIUS);
    ballVel.y = -ballVel.y;
  }
  ballVel.mult(DRAG);
  ballPos.add(ballVel);

}

function drawBall() {
  fill("pink");
  stroke("black");
  ellipse(ballPos.x, ballPos.y, (BALL_RADIUS * 2) + kickTimer, (BALL_RADIUS * 2) + kickTimer);
}

function drawSnareBar() {
  if (snareTimer <= 0) return;

  fill("red");
  stroke("black");
  let snareH = 0;
  if (snareTimer > SNARE_TIME_2) {
    snareH = map(snareTimer - SNARE_TIME_2, 0, SNARE_TIME_1, 0, height / 2);
  } else {
    snareH = map(snareTimer, 0, SNARE_TIME_2, 0, height / 4);
  }
  if (snareTop) {
    rect(snarePos, 0, BAR_WIDTH, snareH);
  } else {
    rect(snarePos, height - snareH, BAR_WIDTH, snareH);
  }
}

function mousePressed() {
  if (!mp3.isPlaying()) {
    mp3.play();
  }
}