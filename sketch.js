let sounds = [];
let analysers = [];

let sound1;
let sound2;
let sound3;
let sound4;

let s;
let a;

function preload() {
  sound1 = new Audio("sounds/Delta Polylogue.mp3");
  sound2 = new Audio("sounds/Arp2600 K3.mp3");
  sound3 = new Audio("sounds/Echo Pad.mp3");
  sound4 = new Audio("sounds/808 Pure.mp3");
}

function setup() {
  createCanvas(1200, 800);
  sounds.push(sound1);
  sounds.push(sound2);
  sounds.push(sound3);
  sounds.push(sound4);
  getAnalysers();
}

function getAnalysers(){
  for (let i = 0; i < sounds.length; i++) {
    const sound = sounds[i];
    let analyser = makeAnalyser(sound);
    analysers[i] = analyser;
  }
}

function makeAnalyser(audio){
  const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

  // Get the source
  audio.onplay = () => audioCtx.resume();
  const source = audioCtx.createMediaElementSource(audio);

  // Create an analyser
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2 ** 8;

  // Connect parts
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  return analyser;
}

function draw() {
  background(220);
  translate(0, -height/8);
  fill("red");
  drawWaveform(analysers[0]);
  translate(0, -height/4);
  fill("green");
  drawWaveform(analysers[1]);
  translate(0, -height/4);
  fill("blue");
  drawWaveform(analysers[2]);
  translate(0, -height/4);
  fill("yellow");
  drawWaveform(analysers[3]);
}

function drawWaveform(a){
  const bufferLength = a.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  a.getByteTimeDomainData(dataArray);
  for (let i = 0; i < dataArray.length; i++) {
    const val = dataArray[i];
    const x = map(i, 0, dataArray.length, 0, width);
    const h = map(val, 128, 0, 0, height/6);
    rect(x, height - h, width/dataArray.length, h);
  }

  /* RMS stands for Root Mean Square, basically the root square of the
  * average of the square of each value. */
  // var rms = 0;
  // for (var i = 0; i < dataArray.length; i++) {
  //   rms += dataArray[i] * dataArray[i];
  // }
  // rms /= dataArray.length;
  // rms = Math.sqrt(rms);
  // const val = abs(128-rms);
  // rect(0, height - val, width, val);
}

function mousePressed() {
  sounds.forEach(element => {
    element.play();
  });
}