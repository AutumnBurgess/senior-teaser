let shredIndex = 0;
let clicks = [];
let looping = false;

function setup() {
  createCanvas(500, 500).parent('p5here');
}

async function draw() {
  if (!window.loaded) return;
  if (!looping) {
    looping = true;
    theChuck.setFloat('rateChange', 0.0);
    theChuck.runFileWithArgs('loop.ck', 'loop')
  }
  background(220);
  clicks.forEach(click => {
    ellipse(click[0], click[1], 10, 10);
  });
  theChuck.setFloat('rateChange', map(mouseY, 0, height, -0.1, 0.1));
}

function removeClick(index) {
  return () => {
    //console.log(index);
  }
}

function mousePressed() {
  if (!window.loaded) return;
  clicks.push([mouseX, mouseY, shredIndex]);
  theChuck.listenForEventOnce(str(shredIndex), removeClick(shredIndex))
  let maxRate = map(mouseX, 0, width, 1, 3);
  let maxGain = map(mouseY, height, 0, 0.25, 1);
  let count = floor(map(mouseY, height, 0, 1, 20));
  let delay = floor(map(mouseY, 0, height, 90, 150));
  theChuck.runFileWithArgs('many.ck', `snare:${delay}:${maxRate}:${shredIndex}`);
  shredIndex++;
}

function mouseWheel() {
  if (!window.loaded) return;
  clicks.push([mouseX, mouseY, shredIndex]);
  theChuck.listenForEventOnce(str(shredIndex), removeClick(shredIndex))
  let maxRate = map(mouseX, 0, width, 1, 3);
  let maxGain = map(mouseY, height, 0, 0.25, 1);
  let count = floor(map(mouseY, height, 0, 1, 20));
  let delay = floor(map(mouseY, 0, height, 90, 150));
  theChuck.runFileWithArgs('many.ck', `sine:${delay}:${maxRate}:${shredIndex}`);
  shredIndex++;
}