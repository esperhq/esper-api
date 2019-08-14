const io = require('socket.io-client');


module.exports = class {

    constructor(verbose = true, endpoint = 'http://localhost', port = 50005){
        this.endpoint = endpoint+':'+port;
        this.socket='';
        this.port = port;
        this.server='';
        this.availableLights = [];
        this.connected = false;
        this.verbose = verbose;
    };


    /*
    *   Bootstraps the Esper API wrapper
    * */
    connect(){
        return new Promise((resolve,reject)=>{
            this.socket = io(this.endpoint);
            if(this.verbose){console.log("Connecting to Esper API at "+this.endpoint);}
            this.socket.on('connect',()=>{
                if(this.verbose){console.log("Connected to Esper API");}
                this.connected = true;
                this.getAvailableLights().then((theLights)=>{
                    this.availableLights = theLights;
                    resolve();
                }).catch((err)=>{
                    console.log(err);
                    reject(['failed to start up correctly - could not detect connected lights'])
                });

            });


            this.socket.on('disconnect',()=>{
                if(this.verbose){console.log("Disconnected from Esper API");}
                this.connected = false;
            });
        });
    }



    /*
    *   Polls the API for the lights that the controller box can communicate with
    * */
    getAvailableLights(){
        return new Promise((resolve,reject)=>{
            if(this.connected){
                this.socket.emit('api-get-available-lights',(payload)=>{
                    if(payload.status){
                        if(this.verbose){console.log(`Detected available lights - there are ${payload.lights.length} lights`);}
                        this.availableLights = payload.lights;
                        resolve(payload.lights);
                    }else{
                        reject(response.errors);
                    }
                });
            }else{
                reject(['Could not get available lights - Not connected to Esper API']);
            }
        });
    }

    nodeExists(id){
        let connectedNodes= [];
        for(let i=0;i<this.availableLights.length;i++){
            connectedNodes.push(this.availableLights[i].id);
        }
        return connectedNodes.includes(id);
    }


    /*
    *   Turns on the modelling light - steady state lighting for each light node
    * */
    modellingLight(payload){
        return new Promise((resolve,reject)=> {
            if (this.connected) {
                let allOk = true;
                let desiredGlobalModellingLight = [];
                let errorMessages = [];
                if (typeof (payload[0]) === 'number') {
                    if (payload.length !== 3) {
                        allOk = false;
                        errorMessages.push('Expected an intensity array of length 3');
                    }
                    if (typeof (payload[0]) === 'number' && typeof (payload[1]) === 'number' && typeof (payload[2]) === 'number') {
                        allOk = false;
                        errorMessages.push('Light intensities should be a number');
                    } else {
                        desiredGlobalModellingLight = [
                            (Math.round(parseFloat(payload[0]) * 10000) / 10000),
                            (Math.round(parseFloat(payload[1]) * 10000) / 10000),
                            (Math.round(parseFloat(payload[2]) * 10000) / 10000),
                        ];
                        if (desiredGlobalModellingLight[0] < 0 || desiredGlobalModellingLight[0] > 3) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3%');
                        }
                        if (desiredGlobalModellingLight[1] < 0 || desiredGlobalModellingLight[1] > 3) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3%');
                        }
                        if (desiredGlobalModellingLight[2] < 0 || desiredGlobalModellingLight[2] > 3) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3%');
                        }
                    }
                    if (allOk) {
                        this.socket.emit('api-set-global-modelling-light', desiredGlobalModellingLight, (response) => {
                            if (response.status) {
                                resolve(desiredGlobalModellingLight);
                            } else {
                                reject(response.errors);
                            }
                        });
                    } else {
                        reject(errorMessages)
                    }
                } else {
                    //check if we want specific modelling lights
                    for (let i = 0; i < payload.length; i++) {
                        if (payload[i].intensities.length !== 3) {
                            allOk = false;
                            errorMessages.push(`Expecting intensities to be arrays of length 3 - occurred at stage ${i + 1}`)
                        }

                        if (typeof (payload[i].intensities[0]) !== 'number') {
                            allOk = false;
                            errorMessages.push(`Light intensities should be a number - occurred at stage ${i + 1}`);
                        }
                        if (typeof (payload[i].intensities[1]) !== 'number') {
                            allOk = false;
                            errorMessages.push(`Light intensities should be a number - occurred at stage ${i + 1}`);
                        }
                        if (typeof (payload[i].intensities[2]) !== 'number') {
                            allOk = false;
                            errorMessages.push(`Light intensities should be a number - occurred at stage ${i + 1}`);
                        }

                        payload[i].intensities[0] = (Math.round(parseFloat(payload[i].intensities[0]) * 10000) / 10000);
                        payload[i].intensities[1] = (Math.round(parseFloat(payload[i].intensities[1]) * 10000) / 10000);
                        payload[i].intensities[2] = (Math.round(parseFloat(payload[i].intensities[2]) * 10000) / 10000);
                        if (payload[i].intensities[0] < 0 || payload[i].intensities[0] > 3) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  intensity should be between 0 and 3% - occurred at stage ${i + 1}`);
                        }
                        if (payload[i].intensities[1] < 0 || payload[i].intensities[1] > 3) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  intensity should be between 0 and 3% - occurred at stage ${i + 1}`);
                        }
                        if (payload[i].intensities[2] < 0 || payload[i].intensities[2] > 3) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  intensity should be between 0 and 3% - occurred at stage ${i + 1}`);
                        }

                        if (payload.length > this.availableLights.length) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  too many light arrays were passed - occurred at stage ${i + 1}`);
                        }

                        let idStore = [];

                        if (idStore.includes(payload[i].id)) {
                            allOk = false;
                            errorMessages.push(`Duplicate Light IDs were passed - id ${payload[i].id} was repeated on stage ${i + 1}`)
                        }
                        idStore.push(payload[i].id);

                        if (!this.nodeExists(payload[i].id)) {
                            allOk = false;
                            errorMessages.push(`An IDs was passed that does not exist - id ${payload[i].id} was set on stage ${i + 1}`)
                        }

                    }
                    if (allOk) {
                        this.socket.emit('api-set-individual-modelling-light', payload, (response) => {
                            if (response.status) {
                                resolve();
                            } else {
                                reject(response.errors);
                            }
                        });
                    } else {
                        reject(errorMessages);
                    }
                }
            }
        });
    }

    /*
    *   Turns the modelling light off - sets a zero brightness for each LED globally
    * */
    modellingLightOff(){
        return new Promise((resolve,reject)=>{
            this.modellingLight([0,0,0]).then(()=>{resolve();}).catch((err)=>{reject(err)});
        });
    }

    bullseyeOn(){
        return new Promise((resolve,reject)=>{
            this.socket.emit('assertBullseye',true,(response)=>{
                if(response.status){
                    resolve();
                }else{
                    reject(response.errors);
                }
            });
        });
    }
    bullseyeOff(){
        return new Promise((resolve,reject)=>{
            this.socket.emit('assertBullseye',false,(response)=>{
                if(response.status){
                    resolve();
                }else{
                    reject(response.errors);
                }
            });
        });
    }

    //todo version checking

    /*
    *   Chain mode is for being able to take many photos - each light can only flash once
    * */
    chain(chainData){
        return new Promise((resolve,reject)=>{
            let allOk = true;
            let idsUsed = [];
            let errorMessages = [];

            for(let i=0;i<chainData.length;i++){

                //check there aren't duplicate ids
                if(idsUsed.includes(chainData[i].id)){
                    allOk = false;
                    errorMessages.push(`Duplicate Light IDs were passed - #${chainData[i].id} was passed multiple times`);
                }
                idsUsed.push(chainData[i].id);


                //check the id is associated with a node we have detected
                if(!this.nodeExists(chainData[i].id)){
                    allOk = false;
                    errorMessages.push(`Invalid Light ID was passed - ID ${chainData[i].id} does not exist`);
                }

                //check we have the correct number of intensities passed
                if(chainData[i].intensities.length !== 3){
                    allOk = false;
                    errorMessages.push(`Incorrect number of intensities passed - each stage should have 3 intensities - stage ${i+1} has ${chainData[i].intensities.length} set`);
                }


                //check the intensities are in range (0-100%)
                chainData[i].intensities[0] = (Math.round(parseFloat(chainData[i].intensities[0])*10000)/10000);
                chainData[i].intensities[1] = (Math.round(parseFloat(chainData[i].intensities[1])*10000)/10000);
                chainData[i].intensities[2] = (Math.round(parseFloat(chainData[i].intensities[2])*10000)/10000);
                if(chainData[i].intensities[0] < 0 || chainData[i].intensities[0] > 100 ){
                    allOk = false;
                    errorMessages.push(`Flash intensities must between 0 and 100 - sent ${chainData[i].intensities[0]} - occurred on stage ${i+1} light node ID ${chainData[i].id}`);
                }
                if(chainData[i].intensities[1] < 0 || chainData[i].intensities[1] > 100 ){
                    allOk = false;
                    errorMessages.push(`Flash intensities must between 0 and 100 - sent ${chainData[i].intensities[1]} - occurred on stage ${i+1} light node ID ${chainData[i].id}`);
                }
                if(chainData[i].intensities[2] < 0 || chainData[i].intensities[2] > 100 ){
                    allOk = false;
                    errorMessages.push(`Flash intensities must between 0 and 100 - sent ${chainData[i].intensities[2]} - occurred on stage ${i+1} light node ID ${chainData[i].id}`);
                }
                //check the flash positions are within range
                if(chainData[i].flashPosition > 255){
                    allOk = false;
                    errorMessages.push(`Highest flash position was in excess of the maximum of 255 - occurred on stage ${i+1} light node ID ${chainData[i].id}`);
                }

                //check the flash durations are acceptable
                if(chainData[i].duration > 0 && chainData[i].duration <= 30 ){
                    allOk = false;
                    errorMessages.push(`Duration error - flash duration must be 0 < flash duration <= 30 - occurred on stage ${i+1} light node ID ${chainData[i].id}`)
                }
            }
            if(allOk){
                this.socket.emit('api-upload-chain-mode-sequence',chainData,(response) => {
                    if (response.status) {
                        resolve();
                    } else {
                        reject(response.errors);
                    }
                });
            }else{reject(errorMessages);}
        });

    }

    /*
    *   Allows the programming of custom light stages - intricate control over each lighting stage
    * */
    sequence(sequenceData){
        return new Promise((resolve,reject)=>{
            let allOk = true;
            let errorMessages = [];
            // check number of stages
            if(sequenceData.length > 32){
                allOk = false;
                errorMessages.push('Too many stages - exceeded 32 light stages. - tried to set '+sequenceData.length+' stages');
            }

            if(!Array.isArray(sequenceData)){
                allOk = false;
                errorMessages.push('Sequence Data must be an array');
            }

            for(let i=0;i<sequenceData.length;i++){

                if(!Array.isArray(sequenceData[i])){
                    allOk = false;
                    errorMessages.push(`Each stage within the sequence data must be an array - stage ${i+1} was an ${typeof sequenceData[i]}`);
                }

                let idsUsed = [];

                for(let j=0;j<sequenceData[i].length;j++){

                    //check ids are unique
                    if(idsUsed.includes(sequenceData[i][j].id)){
                        allOk = false;
                        errorMessages.push(`Duplicate light ID in stage ${i+1} - id # ${sequenceData[i][j].id} duplicated`);
                    }
                    idsUsed.push(sequenceData[i][j].id);

                    // check id exists
                    if(!this.nodeExists(sequenceData[i][j].id)) {
                        allOk = false;
                        errorMessages.push(`Invalid Light ID was passed - ID ${sequenceData[i][j].id} does not exist`);
                    }


                    // check flash duration is a number
                    if(typeof sequenceData[i][j].duration !== 'number'){
                        allOk = false;
                        errorMessages.push(`Flash duration must be a number - occurred on stage ${i+1} light node ID # ${sequenceData[i][j].id}`);
                    }

                    // check duration is in range
                    if(sequenceData[i][j].duration <= 0 || sequenceData[i][j].duration > 30){
                        allOk=false;
                        errorMessages.push(`Duration error - 0 < flash duration <= 30 - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }

                    //check correct number of intensities
                    if(sequenceData[i][j].intensities.length !== 3){
                        allOk = false;
                        errorMessages.push(`Incorrect number of intensities sent - expected 3, received ${sequenceData[i][j].intensities.length} - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }

                    //check intensities are a number
                    if(typeof sequenceData[i][j].intensities[0] !== 'number'){
                        allOk = false;
                        errorMessages.push(`Flash intensities must be a number - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }
                    if(typeof sequenceData[i][j].intensities[1] !== 'number'){
                        allOk = false;
                        errorMessages.push(`Flash intensities must be a number - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }
                    if(typeof sequenceData[i][j].intensities[2] !== 'number'){
                        allOk = false;
                        errorMessages.push(`Flash intensities must be a number - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }

                    //check intensities are in range
                    sequenceData[i][j].intensities[0] = (Math.round(parseFloat(sequenceData[i][j].intensities[0])*100)/100);
                    sequenceData[i][j].intensities[1] = (Math.round(parseFloat(sequenceData[i][j].intensities[1])*100)/100);
                    sequenceData[i][j].intensities[2] = (Math.round(parseFloat(sequenceData[i][j].intensities[2])*100)/100);
                    if(sequenceData[i][j].intensities[0] < 0 || sequenceData[i][j].intensities[0] > 100){
                        allOk = false;
                        errorMessages.push(`Flash intensities must between 0 and 100 - sent ${sequenceData[i][j].intensities[0]} - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }
                    if(sequenceData[i][j].intensities[1] < 0 || sequenceData[i][j].intensities[1] > 100){
                        allOk = false;
                        errorMessages.push(`Flash intensities must between 0 and 100 - sent ${sequenceData[i][j].intensities[1]} - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }
                    if(sequenceData[i][j].intensities[2] < 0 || sequenceData[i][j].intensities[2] > 100){
                        allOk = false;
                        errorMessages.push(`Flash intensities must between 0 and 100 - sent ${sequenceData[i][j].intensities[2]} - occurred on stage ${i+1} light node ID ${sequenceData[i][j].id}`)
                    }

                }

            }

            if(allOk){
                this.socket.emit('api-upload-sequencer-mode-sequence',sequenceData,(response) => {
                    if (response.status) {
                        resolve();
                    } else {
                        reject(response.errors);
                    }
                });
            }else{
                reject(errorMessages);
            }
        });

    }

    /*
    *   The command to tell the rig to start the capture. Fine-grained control over number of stages to take
    * */
    trigger(args){
        return new Promise((resolve,reject)=>{
            let errorMessages = [];
            let allOk = True;
            let triggerPayload = {};


            if(args.hasOwnProperty('stages')){
                if(typeof (args.stages) === 'number' && !(args.stages%1)){
                    if( args.stages <= 32 && args.stages >=0){
                        triggerPayload.stages = args.stages;
                    }else{
                        allOk = false;
                        errorMessages.push('stages must be between 0 and 32 - '+args.stages+' given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('stages must be an integer');
                }
            }else{
                triggerPayload.stages = 0;
            }

            if(args.hasOwnProperty('start')){
                if(typeof (args.start) === 'number' && !(args.start%1)){
                    if( args.start <= 32 && args.start >=0){
                        triggerPayload.start = args.start;
                    }else{
                        allOk = false;
                        errorMessages.push('start must be between 0 and 32 - '+args.start+' given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('start must be an integer');
                }
            }else{
                triggerPayload.start = 0;
            }


            if(args.hasOwnProperty('acclimatizationDuration')){
                if(typeof (args.acclimatizationDuration) === 'number' && !(args.acclimatizationDuration%1)){
                    if( args.acclimatizationDuration <= 10000 && args.acclimatizationDuration >=0){
                        triggerPayload.acclimatizationDuration = args.acclimatizationDuration;
                    }else{
                        allOk = false;
                        errorMessages.push('Acclimatization duration must be between 0 and 10000 - '+args.acclimatizationDuration+' given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('Acclimatization duration must be an integer');
                }
            }else{
                triggerPayload.acclimatizationDuration = 0;
            }


            if(args.hasOwnProperty('acclimatizationIntensity')){
                if(typeof (args.acclimatizationIntensity) === 'number'){
                    if( args.acclimatizationIntensity <= 10 && args.acclimatizationIntensity >=0){
                        triggerPayload.acclimatizationIntensity = args.acclimatizationIntensity;
                    }else{
                        allOk = false;
                        errorMessages.push('Acclimatization intensity must be between 0 and 10 - '+args.acclimatizationIntensity+' given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('Acclimatization intensity must be a number');
                }
            }else{
                triggerPayload.acclimatizationIntensity = 0;
            }



            if(args.hasOwnProperty('preFocusDelay')){
                if(typeof (args.preFocusDelay) === 'number' && !(args.preFocusDelay%1)){
                    if( args.preFocusDelay <= 1000 && args.preFocusDelay >=0){
                        triggerPayload.preFocusDelay = args.preFocusDelay;
                    }else{
                        allOk = false;
                        errorMessages.push('Pre-focus delay must be between 0 and 10 - '+args.preFocusDelay+' given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('Pre-focus delay must be an integer');
                }
            }else{
                triggerPayload.preFocusDelay = 0;
            }


            if(args.hasOwnProperty('captureMode')){
                if(typeof (args.captureMode) === 'string'){
                    let acceptable = ['dslr', 'mv', 'video'];
                    if(acceptable.includes(args.captureMode)){
                        triggerPayload.captureMode = args.captureMode;
                    }else{
                        allOk = false;
                        errorMessages.push('Capture mode must be either "dslr", "mv" or "video" - "'+args.captureMode+'" given');
                    }
                }else{
                    allOk = false;
                    errorMessages.push('Capture mode must be a string');
                }
            }else{
                triggerPayload.captureMode = 'dslr';
            }


            if(allOk){
                this.socket.emit('api-trigger',triggerPayload,(response)=>{
                    if (response.status) {
                        resolve();
                    } else {
                        reject(response.errors);
                    }
                });
            }else{
                reject(errorMessages);
            }
        });
    }




    describeErrors(errors){
        let longestMessage = 52;
        for(let i=0;i<errors.length;i++){
            if((errors[i].length+11) > longestMessage){
                longestMessage = errors[i].length+11;
            }
        }
        let leftSide = 0;
        let rightSide = 0;
        if(longestMessage > 41){
            let numEquals = longestMessage - 41;
            if(numEquals%2){
                //odd number
                leftSide++;
                numEquals--;
            }
            leftSide = leftSide + (numEquals / 2);
            rightSide = numEquals / 2;
        }
        let wideString = '|';
        let leftString = '|';
        let rightString = '';
        for(let i=0;i<longestMessage;i++){
            wideString = wideString+'=';
        }
        for(let i=0;i<leftSide;i++){
            leftString = leftString+'=';
        }
        for(let i=0;i<rightSide;i++){
            rightString = rightString+'=';
        }

        console.log();
        console.log(wideString);
        console.log(leftString+`|     ERROR - There were ${errors.length} error(s)     |`+rightString);
        console.log(leftString+"| Summary of the error(s) is as follows |"+rightString);
        console.log(wideString);
        console.log("|");
        for(let i =0; i<errors.length;i++){
            console.log(`|    #${i+1})    `+errors[i]);
        }
        console.log(wideString);
    }


    sandbox(){
        return new Promise((resolve,reject)=>{
            if(this.verbose){console.log("starting server");}
            this.server = require('socket.io').listen(this.port);
            this.server.on('connection',(socket)=>{
                if(this.verbose){console.log("server detected a client connection");}
                socket.on('api-set-global-modelling-light',(modellingLight,callback)=>{
                    callback({status:true});
                });
                socket.on('api-set-individual-modelling-light',(modellingLight,callback)=>{
                    callback({status:true});
                });
                socket.on('api-upload-chain-mode-sequence',(chainModeData,callback)=>{
                    callback({status:true});
                });
                socket.on('api-upload-sequencer-mode-sequence',(sequenceModeData,callback)=>{
                    callback({status:true});
                });

                socket.on('api-get-available-lights',(callback)=>{
                    callback({status:true,lights:[
                            {   id:1,
                                xyz:[0,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                            {   id:2,
                                xyz:[200,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                            {   id:3,
                                xyz:[400,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                            {   id:4,
                                xyz:[600,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                            {   id:5,
                                xyz:[800,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                            {   id:6,
                                xyz:[1000,0,0],
                                ledPolarisation:['horisonal','neutral','vertical'],
                                maxFlashDuration:50,
                                maxModellingLight:0.03,
                                maxLightStages:32},
                        ]});
                });
            });

            //let Server = require('http').Server();
             //= Server.listen('50005');
            this.connect().then(()=>{resolve()});
        });
    }

    disconnect(){
        if(this.verbose){console.log("Stopping API connection");}
        if(this.server !== ''){
            this.server.close();
        }
        this.socket.close();
    }


};