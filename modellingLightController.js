
const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

let activeLED = 0;
let brightnessVal = 0;
initUserInput();



function initUserInput(){
    try{
        require("readline").emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdout.cursorTo(0,0, ()=>{
            process.stdout.clearScreenDown(()=>{
                process.stdout.write("Started CLI applet. \n");
                process.stdout.write(" Attempting to connect to controlSuite... \n");
                esper.connect().then(()=>{
                    console.log("WARNING! THIS FILE ALLOWS THE USER TO COMMAND A 100% MODELLING LIGHT BRIGHTNESS");
                    console.log("WARNING! REFLECTORS MAY BE MELTED, LEDS MAY BE OVERHEATED");
                    console.log("WARNING! DO NOT USE THIS SCRIPT UNLESS YOU REALLY KNOW WHAT YOU'RE DOING.");
                    setTimeout(()=>{
                        console.log("Press x to exit");
                        console.log("Press o to turn all lights off");
                        console.log("Press [a,b,c] to select active LED");
                        console.log("Press 1 for 10%");
                        console.log("Press 2 for 20%");
                        console.log("...");
                        console.log("Press 0 for 100%");
                    },1000);
                });
            });
        })
    }
    catch(err){
        console.error("Couldn't initialise user input... further prompts will be unresponsive.")
    }
}

function quit(){
    esper.disconnect();
    process.exit(0);
}

process.stdin.on("keypress", (err, key) => {
    // console.log(key);
    let char = key.sequence;
    //console.log(key);
    switch (char){
        case "1": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "2": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "3": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "4": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "5": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "6": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "7": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "8": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "9": brightnessVal = Number.parseInt(char)*10; esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;
        case "0": brightnessVal = 100;                      esper.useBackendTerminalCommand("o"); esper.useBackendTerminalCommand("tv " + activeLED + " " + brightnessVal ); break;

        case "a": activeLED = 0; break;
        case "b": activeLED = 1; break;
        case "c": activeLED = 2; break;


        case " ": esper.useBackendTerminalCommand("l"); break;

        case "o":
            esper.useBackendTerminalCommand("o");
            break;

        case "k":
            esper.setCurrentSequencePoint(0);
            break;

        case "x":
            quit();
            break;
    }
});
