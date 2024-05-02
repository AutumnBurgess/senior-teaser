// modified from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 

// Function for generating rectangles
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function (firstColor, secondColor, swipePos, direction, pulseSize = 0) {
            this.px = this.x - pulseSize / 2;
            this.py = this.y - pulseSize / 2;
            this.pw = this.w + pulseSize;
            this.ph = this.h + pulseSize;
            switch (direction) {
                case U:
                    this.drawVert(secondColor, firstColor, swipePos);
                    break;
                case D:
                    this.drawVert(firstColor, secondColor, swipePos);
                    break;
                case L:
                    this.drawVert(secondColor, firstColor, swipePos);
                    break;
                case R:
                    this.drawVert(firstColor, secondColor, swipePos);
                    break;

            }
            if (direction) {
                this.drawHori(firstColor, secondColor, swipePos);
            } else {
                this.drawVert(firstColor, secondColor, swipePos);
            }
        }

        this.drawHori = function (rightColor, leftColor, swipeX) {
            if (swipeX < this.px) {
                fill(rightColor)
                rect(this.px, this.py, this.pw, this.ph);
            } else if (swipeX > this.px + this.pw) {
                fill(leftColor);
                rect(this.px, this.py, this.pw, this.ph);
            } else {
                fill(leftColor);
                rect(this.px, this.py, swipeX - this.px, this.ph);
                fill(rightColor);
                rect(swipeX, this.py, this.px - swipeX + this.pw, this.ph);
            }
        };

        this.drawVert = function (downColor, upColor, swipeY) {
            if (swipeY < this.py) {
                fill(downColor)
                rect(this.px, this.py, this.pw, this.ph);
            } else if (swipeY > this.py + this.ph) {
                fill(upColor);
                rect(this.px, this.py, this.pw, this.ph);
            } else {
                fill(upColor);
                rect(this.px, this.py, this.pw, swipeY - this.py);
                fill(downColor);
                rect(this.px, swipeY, this.pw, this.py - swipeY + this.ph);
            }
        }
    }
}

// The player object
let p = {
    x: -1100,
    y: 530,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    anticipate: "FLOOR",
    onGround: false,
    colliding: false,
    jump: false,
    draw: function (firstColor, secondColor, swipePos, horizontal) {
        let rectangle = new Rectangle(this.x, this.y + 1, this.w, this.h);
        rectangle.draw(firstColor, secondColor, swipePos, horizontal);
    },
    update: function () {
        if (!this.onGround) {
            this.vy += 0.3;
            if (keyIsDown(LEFT_ARROW)) {
                this.vx -= 0.3
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.vx += 0.3
            }
            this.vx *= 0.95
        } else {
            this.vy = 0;

            if (keyIsDown(LEFT_ARROW)) {
                this.vx -= 1.2
            }
            if (keyIsDown(RIGHT_ARROW)) {
                this.vx += 1.2
            }

            if (keyIsDown(32) && jumpPressed) this.jump = true;
            if (this.jump) {
                this.vy = -10;
                this.jump = false;
                this.onGround = false;
            }
            this.vx *= 0.8
        }
        this.y += this.vy;
        this.x += this.vx;
    }
}

function keyPressed() {
    if (keyCode == 32) {
        jumpPressed = true;
        if (p.onGround) p.jump = true;
    }
    if (key == 'w') {
        print(floor(p.x) + ', ' + floor(p.y));
    }
}

function mousePressed() {
    if (playing) return;
    playing = true;
    allSound.play();
}

function rectCollision(r1, r2) {
    if (
        r1.x < r2.x + r2.w &&
        r1.x + r1.w > r2.x &&
        r1.y < r2.y + r2.h &&
        r1.h + r1.y > r2.y
    ) {
        return true
    } else {
        // No collision
        return false
    }
}