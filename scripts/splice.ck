// sound file to load; me.dir() returns location of this file
me.dir() + "dinner" => string filename;
// the patch
SndBuf buf => dac;
filename => buf.read;
// check if file successfully loaded
if( !buf.ready() ) me.exit();

buf.samples() => int samples;

int starts[10];
dur waits[10];
0 => int i;
repeat (10) {
    Math.random2(0, samples) => starts[i];
    Math.random2(25, 50)::ms => waits[i];
    i++;
}


Math.random2(10, 15) => int plays;

// time loop
while( true )
{
    0 => i;
    repeat (10) {
        starts[i] => buf.pos;
        waits[i] => now;
        i++;
    }
    1::second => now;
}
