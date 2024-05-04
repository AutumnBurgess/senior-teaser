// modified from https://www.youtube.com/watch?v=TwWZwS8iBrw&t=92s 

// Function for generating rectangles
class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.draw = function (rightColor, leftColor, swipePos, pulseSize = 0) {
            this.px = this.x - pulseSize / 2;
            this.py = this.y - pulseSize / 2;
            this.pw = this.w + pulseSize;
            this.ph = this.h + pulseSize;
            if (swipePos < this.px) {
                fill(rightColor)
                rect(this.px, this.py, this.pw, this.ph);
            } else if (swipePos > this.px + this.pw) {
                fill(leftColor);
                rect(this.px, this.py, this.pw, this.ph);
            } else {
                fill(leftColor);
                rect(this.px, this.py, swipePos - this.px, this.ph);
                fill(rightColor);
                rect(swipePos, this.py, this.px - swipePos + this.pw, this.ph);
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
    draw: function (firstColor, secondColor, swipePos, corner = 0) {
        const cornerSize = 8;
        let rectangle1;
        let rectangle2;
        // let rectangle = new Rectangle(this.x, this.y, this.w, this.h + 1);
        switch (corner) {
            case 0://TL
                rectangle1 = new Rectangle(this.x, this.y + cornerSize, cornerSize + 1, this.h - cornerSize + 1);
                rectangle2 = new Rectangle(this.x + cornerSize, this.y, this.w - cornerSize, this.h + 1);
                break;
            case 1://TR
                rectangle1 = new Rectangle(this.x, this.y, this.w - cornerSize, this.h + 1);
                rectangle2 = new Rectangle(this.x + this.w - cornerSize - 1, this.y + cornerSize, cornerSize + 1, this.h - cornerSize + 1);
                break;
            case 2://BR
                rectangle1 = new Rectangle(this.x, this.y, this.w - cornerSize, this.h + 1);
                rectangle2 = new Rectangle(this.x + this.w - cornerSize - 1, this.y, cornerSize + 1, this.h - cornerSize);
                break;
            case 3://BL
                rectangle1 = new Rectangle(this.x, this.y, cornerSize + 1, this.h - cornerSize);
                rectangle2 = new Rectangle(this.x + cornerSize, this.y, this.w - cornerSize, this.h + 1);
                break;
        }
        rectangle1.draw(firstColor, secondColor, swipePos);
        rectangle2.draw(firstColor, secondColor, swipePos);
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