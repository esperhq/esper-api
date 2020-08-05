// const EsperFactory = require('./esper-api');
// let esper = new EsperFactory();
//
// initUserInput();
//
// /**
//  * Duration in milliseconds to flash one at a time.
//  * @type {number}
//  */
// let userFlashDuration = 5;  // min: 1, max: 30;
//
// // set to something low while doing initial tests. Increase only when everything has been verified.
// /** @type {number[]} */
// let userFlashBrightnesses = [
//    3, // (%)
//    3, // (%)
//    3  // (%)
// ];
//
// let directionVector = [0, 0, -1];  //+Z
//
// esper.connect()
//     .then(() => {
//         //+Z to -Z OLAT
//         // we have x,y,z coordinates for each of the lights in the availableLights property.
//         // taking a dot product of these with a direction vector we are interested in and sorting by it will yield the results we want for any arbitrary case,
//         // This is an edge case however given that we want to look at a vector with a bunch of zeros in - gone down the dot product route for completeness
//
//         // noinspection DuplicatedCode
//
//
//         //get around pass-by-reference
//         let lights = JSON.parse(JSON.stringify(esper.availableLights));
//
//         for (let i = 0; i < esper.availableLights.length; i++){
//             lights[i].dotProduct = dotProduct(directionVector, lights[i].positions);
//         }
//         lights.sort((a, b) => (a.dotProduct > b.dotProduct) ? 1 : -1);
//
//         //Generate the payload
//         let olatPayloadFrontToBack = [];
//
//         //to do OLAT front to back
//         let stageAssignment = 0;
//         lights.forEach((light) => {
//             let positions  = light.positions;
//             for (let p = 0; p < positions.length; p++){
//                 positions[p] = Math.round(positions[p]);
//             }
//             /** @type {ChainModeDataInstance} */
//             let dataInstance = {
//                 id: light.id,
//                 flashPosition: stageAssignment,
//                 duration: userFlashDuration,
//                 locationInSpace: positions
//             };
//             stageAssignment++;
//             olatPayloadFrontToBack.push(dataInstance);
//             }
//         );
//         console.table(olatPayloadFrontToBack);
//         esper.configureChainMode(olatPayloadFrontToBack)
//         .then(()=>{
//             return esper.armChainMode(userFlashBrightnesses);
//         })
//         .then(()=>{
//             console.log("armed... ready for trigger.");
//             promptUser("Press f to test a single flash..." +
//                 "\n\t k to reset the lights to sequence point zero..." +
//                 "\n\t x to exit ... \n"
//             );
//         })
//         .catch((err)=>{
//             console.table(err);
//         });
// });
//
// function dotProduct(a, b){
//     if (a !== null && b !== null){
//         return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
//     }
//     return null;
// }
//
// /**
//  *
//  * @param {String} arg
//  */
// function promptUser(arg){
//     process.stdout.write(arg + " >> ");
// }
//
// process.stdin.on("keypress", (err, key) => {
//     // console.log(key);
//     let char = key.sequence;
//     switch (char){
//         case "f":
//             esper.testFlash();
//             break;
//
//         case "k":
//             esper.setCurrentSequencePoint(0);
//             break;
//
//         case "x":
//             quit();
//             break;
//     }
// });
//
// function quit(){
//     esper.disconnect();
//     process.exit(0);
// }
//
// function initUserInput(){
//     try{
//         require("readline").emitKeypressEvents(process.stdin);
//         process.stdin.setRawMode(true);
//         process.stdout.cursorTo(0,0, ()=>{
//             process.stdout.clearScreenDown(()=>{
//                 process.stdout.write("Started CLI applet. Attempting to connect to controlSuite...");
//             });
//         })
//     }
//     catch(err){
//         console.error("Couldn't initialise user input... further prompts will be unresponsive.")
//     }
// }

const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

initUserInput();

/**
 * Duration in milliseconds to flash one at a time.
 * @type {number}
 */
let userFlashDuration = 5;  // min: 1, max: 30;

// set to something low while doing initial tests. Increase only when everything has been verified.
/** @type {number[]} */
let userFlashBrightnesses = [
    3, // (%)
    3, // (%)
    3  // (%)
];

let directionVector = [0, 0, -1];  //+Z

esper.connect()
    .then(() => {
        //+Z to -Z OLAT
        // we have x,y,z coordinates for each of the lights in the availableLights property.
        // taking a dot product of these with a direction vector we are interested in and sorting by it will yield the results we want for any arbitrary case,
        // This is an edge case however given that we want to look at a vector with a bunch of zeros in - gone down the dot product route for completeness

        // noinspection DuplicatedCode


        //get around pass-by-reference
        let lights = JSON.parse(JSON.stringify(esper.availableLights));

        for (let i = 0; i < esper.availableLights.length; i++){
            lights[i].dotProduct = dotProduct(directionVector, lights[i].positions);
        }
        lights.sort((a, b) => (a.dotProduct > b.dotProduct) ? 1 : -1);

        //Generate the payload
        let olatPayloadFrontToBack = [];

        //to do OLAT front to back
        let stageAssignment = 0;
        lights.forEach((light) => {
                let positions  = light.positions;
                for (let p = 0; p < positions.length; p++){
                    positions[p] = Math.round(positions[p]);
                }
                /** @type {ChainModeDataInstance} */
                let dataInstance = {
                    id: light.id,
                    flashPosition: stageAssignment*2,
                    duration: userFlashDuration,
                    locationInSpace: positions
                };
                stageAssignment++;
                olatPayloadFrontToBack.push(dataInstance);
            }
        );
        console.table(olatPayloadFrontToBack);
        esper.configureChainMode(olatPayloadFrontToBack)
            .then(()=>{
                return esper.armChainMode(userFlashBrightnesses);
            })
            .then(()=>{
                console.log("armed... ready for trigger.");
                promptUser("Press f to test a single flash..." +
                    "\n\t k to reset the lights to sequence point zero..." +
                    "\n\t x to exit ... \n"
                );
            })
            .catch((err)=>{
                console.table(err);
            });
    });

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
            esper.testFlash();
            break;

        case "k":
            esper.setCurrentSequencePoint(0);
            break;

        case "x":
            quit();
            break;
    }
});

function quit(){
    esper.disconnect();
    process.exit(0);
}

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
        console.error("Couldn't initialise user input... further prompts will be unresponsive.")
    }
}
