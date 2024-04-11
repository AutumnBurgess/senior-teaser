function createKickCues() {
    const kicks = [782, 2031, 2906, 3656, 4906, 6030, 6778, 7655, 8779, 10029, 10907, 11657, 12906, 14031, 14780, 15653, 16779, 18030, 18907, 19656, 20905, 22032, 22781, 23655, 24777, 26031, 26906, 27656, 28907, 30032, 30782];
    for (const kick of kicks) {
        mp3.addCue(kick / 1000, () => { kickTimer = KICK_TIME });
    }
}

function createBellCues() {
    const shortBells = [4651, 8659, 12659, 16655];
    const longBells = [20657, 24655, 28656];
    for (const bell of shortBells) {
        mp3.addCue(bell / 1000, pushBall, SHORT_STRENGTH);
    }
    for (const bell of longBells) {
        mp3.addCue(bell / 1000, pushBall, LONG_STRENGTH);
    }
}

function pushBall(strength) {
    let toMouse = p5.Vector.sub(createVector(mouseX, mouseY), ballPos);
    ballVel = toMouse.setMag(strength);
}

function createSnareCues() {
    const snares = [290, 1168, 2415, 3169, 4291, 5167, 6418, 7166, 8292, 9168, 10416, 11168, 12293, 13168, 14411, 15169, 16292, 17168, 18416, 19168, 20293, 21165, 22418, 23167, 24292, 25162, 26417, 27167, 28293, 29165, 30415, 31168];
    for (const snare of snares) {
        mp3.addCue(snare / 1000, startSnareBar);
    }
}

function startSnareBar() {
    snareTimer = SNARE_TIME_1 + SNARE_TIME_2;
    snarePos = random(0, width - BAR_WIDTH);
    snareTop = random(1) < 0.5;
}

function createEffectCues() {
    const effects = [3750, 5004, 6027, 7761, 8831, 10152, 12984, 15643, 17152, 18655, 19160, 19652, 21655, 22023, 23653, 24806, 27775, 30082, 22777];
    const durations = [9, 9, 32, 33, 20, 9, 9, 19, 19, 9, 5, 19, 9, 9, 24, 26, 32, 9, 24];
    for (let i = 0; i < effects.length; i++) {
        mp3.addCue(effects[i] / 1000, () => { effectTimer = durations[i] });
    }
}