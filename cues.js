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

    function onArp() {
        curCorner = (curCorner + 1) % 4;
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
    let arpTimes = arpMidi.tracks[0].notes.map(e => e.time);
    arpTimes.forEach(time => {
        mainSound.addCue(time, onArp, time);
    });

    introSound.onended(begin);
}