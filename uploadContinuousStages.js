const EsperApi = require('./esper-api');
let esperApi = new EsperApi();

initUserInput();

let userFlashDurationMillis = 1;

// define the lighting directions  (change to match your direction convention if needed..)
const DIR_VECT_GLOBAL    = [ 0, 0, 0];
const DIR_VECT_SUB_LEFT  = [ 1, 0, 0];
const DIR_VECT_SUB_RIGHT = [-1, 0, 0];
const DIR_VECT_SUB_TOP   = [ 0, 1, 0];
const DIR_VECT_SUB_BOT   = [ 0,-1, 0];
const DIR_VECT_SUB_FRONT = [ 0, 0, 1];
const DIR_VECT_SUB_BACK  = [ 0, 0,-1];
// arbitrary directions, vectors can be any magnitude.
const DIR_VECT_SUB_FRONT_LEFT   = [ 1, 0, 1];
const DIR_VECT_SUB_FRONT_RIGHT  = [-1, 0, 1];

// define led names: (don't change!)
const NEUTRAL_LED    = 1;
const CROSS_LED      = 0;
const PARALLEL_LED   = 2;

// specify which directions to upload in sequence order: (This array length must match ledsToUse.length)
let directionsToUse = [
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
    DIR_VECT_GLOBAL,
    DIR_VECT_SUB_LEFT,
    DIR_VECT_SUB_RIGHT,
    DIR_VECT_SUB_TOP,
];

// specify which leds to use in sequence order:
let ledsToUse = [
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
    PARALLEL_LED,
];

let perStageIntensityMask = [
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
];

if (ledsToUse.length === directionsToUse.length){
    esperApi.connect()
        .then(() => {
            let lights = JSON.parse(JSON.stringify(esperApi.availableLights)); // lazy deep copy.
            for (let light of lights){
                light.intensitiesTable = [];
                light.ledsTable = [];
                for (let sIt = 0; sIt < directionsToUse.length; sIt++){
                    let directionVector = directionsToUse[sIt];
                    let calculatedIntensity = -1;
                    if (calcMagnitude(directionVector) > 0.001){ // if vector is [0,0,0], light from everywhere.
                        calculatedIntensity = calcUnitaryInteractionWith(light.positions, directionVector);
                    }
                    else{
                        calculatedIntensity = 1; // GI
                    }
                    light.intensitiesTable.push(calculatedIntensity * 100 * perStageIntensityMask[sIt]);
                    light.ledsTable.push(ledsToUse[sIt]);
                }
            }

            let sequenceHolder = [];
            for (let stageIndex = 0; stageIndex < directionsToUse.length; stageIndex++){
                let thisStageArray = [];
                for (let light of lights){
                    let intensitiesTrio = [0,0,0];
                    intensitiesTrio[light.ledsTable[stageIndex]] = light.intensitiesTable[stageIndex];
                    thisStageArray.push({
                        id: light.id,
                        intensities: intensitiesTrio,
                        duration: userFlashDurationMillis
                    })
                }
                sequenceHolder.push(thisStageArray);
            }
            return esperApi.sequence(sequenceHolder);
        })
        .then(()=>{
            console.log("uploading all light data - see dome for progress...");
            console.log("Once data is uploaded:" +
                "\n\t press f to perform a test flash" +
                "\n\t press k to rewind the dome's sequence point to zero" +
                "\n\t press l to set the lights to low" +
                "\n\t press o to turn the lights off" +
                "\n\t press x to exit"
            );

        })
        .catch((err)=>{
            console.table(err);
        });
}
else{
    console.error("ERR: directions array and leds array must be of equal length.")
}

function dotProduct(a, b){
    if (a !== null && b !== null){
        return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
    }
    return null;
}

/**
 *
 * @param {String} arg
 */
function promptUser(arg){
    process.stdout.write(arg + " >> ");
}

process.stdin.on("keypress", (err, key) => {
    // console.log(key);
    let char = key.sequence;
    switch (char){
        case "f":
            esperApi.testFlash();
            break;

        case "k":
            esperApi.setCurrentSequencePoint(0);
            break;

        case "l":
            esperApi.globalModellingLight([0.15, 0.15, 0.15]);
            break;

        case "o":
            esperApi.globalModellingLight([0,0,0]);
            break;

        case "x":
            esperApi.disconnect();
            process.exit(0);
            break;
    }
});

function initUserInput(){
    try{
        require("readline").emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);
        process.stdout.cursorTo(0,0, ()=>{
            process.stdout.clearScreenDown(()=>{
                process.stdout.write("Started CLI applet. Attempting to connect to controlSuite...");
            });
        })
    }
    catch(err){
        console.error("Couldn't initialise user input... further prompts will not respond to keypresses.")
    }
}


/**
 *
 * @param {number[]} vect1
 * @param {number[]} vect2
 * @returns {null|number}
 */
function calcUnitaryInteractionWith(vect1, vect2) {
    if (Array.isArray(vect1) && Array.isArray(vect2)){
        let dot = dotProduct(vect1, vect2);
        let magThis = calcMagnitude(vect1);
        let magThat = calcMagnitude(vect2);
        let unityInteraction = dot / (magThis * magThat);
        unityInteraction += 1;
        unityInteraction /= 2;
        if (!(unityInteraction >= 0 && unityInteraction <= 1)) {
            console.error("Unitary interaction calculation error:" + unityInteraction);
            return null;
        }
        return unityInteraction;
    }
    else{
        console.error("Typerror on calcUnitaryInteractionWith()");
        return null;
    }
}

/**
 *
 * @param {number[]} vectIn
 * @returns {number}
 */
function calcMagnitude(vectIn){
    return Math.sqrt(
        Math.pow(vectIn[0],2) +
        Math.pow(vectIn[1],2) +
        Math.pow(vectIn[2],2)
    );
}
