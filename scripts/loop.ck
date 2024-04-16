global float rateChange;

// sound file to load; me.dir() returns location of this file
me.dir() + me.arg(0) => string filename;


// the patch
SndBuf buf => dac;
filename => buf.read;
// check if file successfully loaded
if( !buf.ready() ) me.exit();
buf.loop(1);

1 => float rate;
while( true ) {
    // chnage rate
    rate + rateChange => rate;
    rate => buf.rate;
    <<<rate>>>;
    // advance time
    200::ms => now;
}
