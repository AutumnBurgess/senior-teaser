function addCues() {
    function onKick(time) {
        kickTimer = 20;
    }

    function onHat(time) {
        hatTimer = 15;
    }

    function onBass(note) {
        bassRunning = true;
        bassStart = note.t;
        bassEnd = note.t + note.d;
    }

    function onArp(note) {
        // if (note.v < 0.6) return;
        curCorner = (curCorner + 1) % 4;
        // if (curCorner == 0) curCornerMod = (curCornerMod + 1) % CORNER_MOD;
        if (curCorner == 0) {
            curCornerMod = floor(random(CORNER_MOD));
        }
        // curCorner = floor(random(4));
        // curCornerMod = floor(random(CORNER_MOD));
    }

    function begin() {
        state = MAIN;
        mainSound.play();
    }

    let kickTimes = kickMidi.tracks[0].notes.map(e => e.time);
    kickTimes.forEach(time => {
        mainSound.addCue(time, onKick, time);
    });
    let hatTimes = hatMidi.tracks[0].notes.map(e => e.time);
    hatTimes.forEach(time => {
        mainSound.addCue(time, onHat, time);
    });
    let bassTimes = bassMidi.tracks[0].notes.map(e => { return { t: e.time, d: e.duration } });
    bassTimes.forEach(note => {
        mainSound.addCue(note.t, onBass, note);
    });
    let arpTimes = arpMidi.tracks[0].notes.map(e => { return { t: e.time, v: e.velocity } });
    arpTimes.forEach(note => {
        mainSound.addCue(note.t, onArp, note);
    });

    introSound.onended(begin);
}