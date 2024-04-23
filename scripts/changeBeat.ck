// sound file to load; me.dir() returns location of this file
me.dir() + me.arg(0) => string filename;

me.arg(1).toFloat() => float delay;
me.arg(2).toFloat() => float maxRate;

// the patch
SndBuf buf => dac;
filename => buf.read;

// check if file successfully loaded
if( !buf.ready() ) me.exit();

Math.random2(10, 15) => int plays;
0 => int count;

// time loop
while( count < plays )
{
    count ++;
    // set playback position to beginning
    0 => buf.pos;
    // randomize gain
    // Math.random2f(maxGain - .25, maxGain) => buf.gain;
    Math.random2f(.25,.5) => buf.gain;
    // randomize rate
    Math.random2f(maxRate - 1, maxRate) => buf.rate;
    // Math.random2f(.5,1.5) => buf.rate;

    // advance time
    delay::ms => now;
}
