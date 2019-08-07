const io = require('socket.io-client');


module.exports = class {

    constructor(verbose = true, endpoint = 'http://localhost', port = 50005){
        this.endpoint = endpoint+':'+port;
        this.socket='';
        this.availableLights = [];
        this.currentSettings = {};
        this.connected = false;
        this.verbose = verbose;
        this.message = '';
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
                        if(this.verbose){console.log("detected lights available");}
                        this.availableLights = payload.lights;
                        resolve(payload.lights);
                    }else{
                        reject([payload.msg]);
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
                        if (desiredGlobalModellingLight[0] < 0 || desiredGlobalModellingLight[0] > 0.03) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3% (0.03)');
                        }
                        if (desiredGlobalModellingLight[1] < 0 || desiredGlobalModellingLight[1] > 0.03) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3% (0.03)');
                        }
                        if (desiredGlobalModellingLight[2] < 0 || desiredGlobalModellingLight[2] > 0.03) {
                            allOk = false;
                            errorMessages.push('Intensity should be between 0 and 3% (0.03)');
                        }
                    }
                    if (allOk) {
                        this.socket.emit('api-set-global-modelling-light', desiredGlobalModellingLight, (response) => {
                            if (response.status) {
                                resolve(desiredGlobalModellingLight);
                            } else {
                                reject([response.msg]);
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
                        if (payload[i].intensities[0] < 0 || payload[i].intensities[0] > 0.03) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  intensity should be between 0 and 3% - occurred at stage ${i + 1}`);
                        }
                        if (payload[i].intensities[1] < 0 || payload[i].intensities[1] > 0.03) {
                            allOk = false;
                            errorMessages.push(`Could not set individual modelling lights -  intensity should be between 0 and 3% - occurred at stage ${i + 1}`);
                        }
                        if (payload[i].intensities[2] < 0 || payload[i].intensities[2] > 0.03) {
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
                        if (!this.nodeExists(payload[i].id)) {
                            allOk = false;
                            errorMessages.push(`An IDs was passed that does not exist - id ${payload[i].id} was set on stage ${i + 1}`)
                        }
                        idStore.push(payload[i].id);

                        if (allOk) {
                            this.socket.emit('api-set-individual-modelling-light', payload, (response) => {
                                if (response.status) {
                                    resolve();
                                } else {
                                    reject([response.msg]);
                                }
                            });
                        } else {
                            reject(errorMessages);
                        }
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
    //todo version checking

    /*
    *   Chain mode is for being able to take many photos - each light can oqwe
    * nly flash once
    * */
    chain(chainData){
        return new Promise((resolve,reject)=>{
            /*
                {
                    id:1,						1<=id<=255		//unique
                    flashPosition:2,  			1<=id<=255
                    intensities:[0.99,0.5,0], 	0<=int<=1
                    duration:1.99				0 < duration <= 30 //ms
                },
            */
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
                    errorMessages.push(`Invalid Light IDs were passed - id ${chainData[i].id} does not exist`);
                }

                //check we have the correct number of intensities passed
                if(chainData[i].intensities.length !== 3){
                    allOk = false;
                    errorMessages.push(`Incorrect number of intensities passed - each stage should have 3 intensities - stage ${i+1} has ${chainData[i].intensities.length} set`);
                }


                //check the intensities are in range (0-3%)
                chainData[i].intensities[0] = (Math.round(parseFloat(chainData[i].intensities[0])*10000)/10000);
                chainData[i].intensities[1] = (Math.round(parseFloat(chainData[i].intensities[1])*10000)/10000);
                chainData[i].intensities[2] = (Math.round(parseFloat(chainData[i].intensities[2])*10000)/10000);
                if(chainData[i].intensities[0] < 0 || chainData[i].intensities[0] > 0.03 ){
                    allOk = false;
                    errorMessages.push(`Incorrect intensities set - intensity should be between 0% and 3% (0.03) - error occurred on stage ${i+1}`);
                }
                if(chainData[i].intensities[1] < 0 || chainData[i].intensities[1] > 0.03 ){
                    allOk = false;
                    errorMessages.push(`Incorrect intensities set - intensity should be between 0% and 3% (0.03) - error occurred on stage ${i+1}`);
                }
                if(chainData[i].intensities[2] < 0 || chainData[i].intensities[2] > 0.03 ){
                    allOk = false;
                    errorMessages.push(`Incorrect intensities set - intensity should be between 0% and 3% (0.03) - error occurred on stage ${i+1}`);
                }
                //check the flash positions are within range
                if(chainData[i].flashPosition > 255){
                    allOk = false;
                    errorMessages.push(`Highest flash position was in excess of the maximum of 255 - error occurred on stage ${i+1}`);
                }

                //check the flash durations are acceptable
                if(chainData[i].duration > 0 && chainData[i].duration <= 30 ){
                    allOk = false;
                    errorMessages.push(`Highest flash position was in excess of the maximum of 255 - error occurred on stage ${i+1}`);
                }
            }
            if(allOk){

            }else{reject();}


           // resolve({success:1,msg:'successfully executed'});
        });
        //set currentSettings object when finished
    }

    /*
    *   Allows the programming of custom light stages - intricate control over each lighting stage
    * */
    sequence(sequenceData){

        //set currentSettings object when finished
    }

    /*
    *   The command to tell the rig to start the capture. Fine-grained control over number of stages to take
    * */
    trigger(args = ''){
        return new Promise((resolve,reject)=>{
            reject(['sopmefhgd']);
        });
    }

    describeErrors(errors){
        console.log(`ERROR - There were ${errors.length} error(s)`);
        console.log("===========================================================");
        console.log("=========  Summary of the error(s) is as follows  =========");
        for(let i =0; i<errors.length;i++){
            console.log(`    #${i+1})    `+errors[i]);
        }
        console.log("===========================================================");
    }
};