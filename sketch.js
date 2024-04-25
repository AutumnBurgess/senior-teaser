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
const PALETTES = [['black', 'white', 'lightgrey'], ['orange', 'blue', 'lightblue'], ['green', 'pink', 'lightpink']];
const BORDER_PIXEL = 5;
const BORDER_HEIGHT = 3;
const DEBUG = false;
let border = [];

let curPalette = 0;
let wipePosition = 0;

let x = 100;
let y = 100;
let vx = 10;
let vy = 10;
let BALL_RADIUS = 100;
let jumpPressed = false;
let rects = [];
let bgRects = [];

function preload() {
    kickMidi = loadJSON('midis/kick.json');
    kickSound = loadSound('sounds/anticipation kick.wav');
    allSound = loadSound('sounds/anticipation.wav');
}

function setup() {
    let times = kickMidi.tracks[0].notes.map(e => e.time);
    print(times);
    times.forEach(time => {
        kickSound.addCue(time, onKick, time);
    });

    createCanvas(800, 600, 'p2d').parent('#p5here');
    colorMode(HSB, 100);
    rects.push(new Rectangle(10, 560, 800, 40));
    rects.push(new Rectangle(200, 420, 200, 40));
    rects.push(new Rectangle(250, 300, 200, 50));
    rects.push(new Rectangle(150, 150, 50, 50));
    rects.push(new Rectangle(400, 100, 50, 50));
    rects.push(new Rectangle(500, 10, 145, 10));
    rects.push(new Rectangle(750, 0, 200, 150));

    bgRects.push(new Rectangle(0, 0, 100, 100));
    bgRects.push(new Rectangle(100, 300, 100, 100));
    bgRects.push(new Rectangle(500, 280, 200, 180));
    bgRects.push(new Rectangle(300, -100, 100, 100));

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

function mousePressed() {
    if (playing) return;
    playing = true;
    allSound.play();
}

function onKick(time) {
    print('kick at ' + time);
    kickTimer = 10;
}

function draw() {
    if (!window.loaded) return;
    if (!playing) return;
    // if (!looping) {
    //     looping = true;
    //     theChuck.setFloat('rateChange', 0.0);
    //     theChuck.runFileWithArgs('loop.ck', 'all')
    // }

    update();
    let oldPalette = PALETTES[curPalette];
    // let newPalette = PALETTES[(curPalette + 1) % PALETTES.length];
    let oldImg = drawScene(oldPalette[0], oldPalette[1], oldPalette[2]);
    // let newImg = drawScene(newPalette[0], newPalette[1], newPalette[2]);
    // newImg.mask(makeMask());
    image(oldImg, 0, 0);
    // image(newImg, 0, 0);
    drawBorder();
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

    if (frameCount % 10 == 0) {
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

        // Draw colliders
        // top.draw()
        // btm.draw()
        // lt.draw()
        // rt.draw()

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

function drawScene(fg, bg, mg) {
    let g = createGraphics(width, height, 'p2d');
    g.background(bg);
    g.noStroke();
    g.translate(origin.x - center.x, origin.y - center.y)

    g.fill(mg);
    for (let i = 0; i < bgRects.length; i++) {
        bgRects[i].drawPulse(g, kickTimer)
    }

    g.fill(fg);
    p.draw(g)
    for (let i = 0; i < rects.length; i++) {
        rects[i].draw(g)
    }
    if (DEBUG) {
        g.push()
        g.noFill()
        g.stroke(0);
        g.rect(center.x - 100, center.y - 100, 200, 200)
        g.pop()
    }
    let img = g.get();
    g.remove();
    return img;
}

function testMask() {
    let msk = createGraphics(width, height, 'p2d');
    msk.background(0);
    msk.erase();
    msk.noStroke();
    msk.ellipse(width / 2, height / 2, 100, 100);
    let img = msk.get();
    msk.remove();
    return img;
}

function makeMask() {
    let msk = createGraphics(width, height, 'p2d');
    msk.background(0);
    msk.erase();
    msk.noStroke();
    msk.rect(0, 0, wipePosition * (width / WIPE_SECTIONS), height);
    let img = msk.get();
    msk.remove();
    return img;
}

function incrementWipe() {
    wipePosition++;
    if (wipePosition == WIPE_SECTIONS) {
        wipePosition = 0;
        curPalette = (curPalette + 1) % PALETTES.length;
    }
}

p5.Graphics.prototype.remove = function () {
    if (this.elt.parentNode) {
        this.elt.parentNode.removeChild(this.elt);
    }
    var idx = this._pInst._elements.indexOf(this);
    if (idx !== -1) {
        this._pInst._elements.splice(idx, 1);
    }
    for (var elt_ev in this._events) {
        this.elt.removeEventListener(elt_ev, this._events[elt_ev]);
    }
};
