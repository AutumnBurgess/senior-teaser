// modified from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 

// Function for generating rectangles
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function (g) {
            g.rect(this.x, this.y, this.w, this.h);
        };

        this.drawPulse = function (g, t) {
            g.rect(this.x - t / 2, this.y - t / 2, this.w + t, this.h + t);
        };

    }
}

// The player object
let p = {
    x: 100,
    y: 560,
    w: 30,
    h: 30,
    vx: 0,
    vy: 0,
    anticipate: "FLOOR",
    onGround: false,
    colliding: false,
    jump: false,
    draw: function (g) {
        g.rect(this.x, this.y + 1, this.w, this.h)
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