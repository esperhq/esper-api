let esperClass = require("./esper-api.js");
let Esper = new esperClass(true); // enable verbose reporting
let fs = require("fs");

fs.readFile("textTableFile.txt", "utf8", (err, data)=>{
    if (err){
        console.error("OPEN FILE ERROR:")
        console.error(err);
        process.exit(-10);
    }
    else{
        console.log("Reading light input data...");
        let lines = data.split("\r\n");
        let tableData = [];
        let ledData = [];
        let flashDuration = -1;
        for (let line of lines){
            if (line.startsWith("//")){
                //
            }
            else if (line.startsWith("@")){
                // remove redundant whitespace:
                let stageData = [];
                line = line.replace("@", "");
                while (line.includes(" ")){ line = line.replace(" ", ""); }

                // split line into array of floats
                let values = line.split(",");
                for (let value of values){
                    value = Number.parseFloat(value);
                    if (value >= 0 && value <= 100){
                        stageData.push(value);
                    }
                }
                tableData.push(stageData);
            }
            else if (line.startsWith("LEDS:")){
                line = line.replace("LEDS:", "");
                while (line.includes(" ")){ line = line.replace(" ", ""); }
                let ledDataPoints = line.split(",");
                for (let ld of ledDataPoints){
                    if (ld.length > 0){
                        let ledIndex = Number.parseInt(ld);
                        if (!(ledIndex === 0 || ledIndex === 1 || ledIndex === 2)){
                            console.error("LED Specified needs to be 0, 1 or 2");
                            process.exit(-789);
                        }
                        ledData.push(ledIndex);
                    }
                }
            }
            else if (line.startsWith("FLASH_DURATION:")){
                line = line.replace("FLASH_DURATION:", "");
                while (line.includes(" ")){ line = line.replace(" ", ""); }
                flashDuration = Number.parseFloat(line);
            }
        }
        for (let nodeLightingData of tableData){
            if (nodeLightingData.length !== 32){
                errorQuit("table data incorrect length, should be 32");
            }
        }
        if (ledData.length !== 32){
            errorQuit("led data incorrect length, should be 32");
        }
        if (flashDuration === -1){
            errorQuit("User needs to specify flash duration by adding line: \n" +
                "^ 5 to input file for a 5mS flash");
        }
        console.log("FLASH DURATION: " + flashDuration + "mS");
        console.log("Found lighting data for " + tableData.length + " lights...");
        console.log("Found LED data for " + ledData.length + " stages...");
        setTimeout(()=>{
            console.log("Packaging data for upload...");
            let uploadPayload = [];
            for (let stageIndex = 0; stageIndex < ledData.length; stageIndex++){
                let stage = [];
                for (let lightIndex = 0; lightIndex < tableData.length; lightIndex++){
                    let intensityArray = [0,0,0];
                    intensityArray[ledData[stageIndex]] = tableData[lightIndex][stageIndex];
                    stage.push({id: lightIndex+1, intensities:intensityArray, duration: flashDuration})
                }
                uploadPayload.push(stage);
            }
            console.log("Starting upload...");
            uploadData(uploadPayload)
        }, 1000)
    }
});

function errorQuit(msg){
    console.error("ERROR:" + msg);
    process.exit(9);
}

function uploadData(data){
    Esper.connect()
        .then(() => {
            return Esper.getAvailableLights();
        })
        .then((availableLights)=>{
            console.log("Found " + availableLights.length + " available lights...");
            return Esper.sequence(data);
        })
        .then(() => {
            Esper.disconnect();
        }).catch((errs) => {
        Esper.describeErrors(errs);
    });
}
