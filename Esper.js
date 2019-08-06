const io = require('socket.io-client');


module.exports = class {

    constructor(endpoint = 'http://localhost:50005',verbose = true,){
        this.endpoint = endpoint;
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
                    reject('failed to start up correctly - could not detect connected lights')
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
                        reject(payload.msg);
                    }
                });
            }else{
                reject('Could not get available lights - Not connected to Esper API');
            }
        });
    }




    /*
    *   Turns on the modelling light - steady state lighting for each light node
    * */
    modellingLight(payload){
        return new Promise((resolve,reject)=>{
            if(this.connected){
                if(typeof(payload[0]) === 'number'){
                    if(payload.length === 3){
                        if(typeof(parseFloat(payload[0])) === 'number' && typeof(parseFloat(payload[1])) === 'number' && typeof(parseFloat(payload[2])) === 'number'){
                            let desiredGlobalModellingLight = [
                                (Math.round(parseFloat(payload[0])*10000)/10000),
                                (Math.round(parseFloat(payload[1])*10000)/10000),
                                (Math.round(parseFloat(payload[2])*10000)/10000),
                            ];
                            let status = true;
                            if(desiredGlobalModellingLight[0] < 0 || desiredGlobalModellingLight[0] > 0.03){status = false;}
                            if(desiredGlobalModellingLight[1] < 0 || desiredGlobalModellingLight[1] > 0.03){status = false;}
                            if(desiredGlobalModellingLight[2] < 0 || desiredGlobalModellingLight[2] > 0.03){status = false;}
                            if(status){
                                this.socket.emit('api-set-global-modelling-light',desiredGlobalModellingLight,(response)=>{
                                    if(response.status){
                                        resolve(desiredGlobalModellingLight);
                                    }else{
                                        reject(response.msg)
                                    }
                                });
                            }else{
                                reject('Could not set global modelling light -  intensity should be between 0 and 3% (0.03)');
                            }
                        }else{
                            reject('Could not set global modelling light - light intensities should be a number');
                        }
                    }else{
                        reject('Could not set global modelling light - expected and array of length 3');
                    }
                }else{
                    //check if we want specific modelling lights
                    let correctLengths = true;
                    for(let i = 0;i < payload.length; i++){
                        if(payload[i].intensities.length != 3){correctLengths = false;}
                    }
                    if(correctLengths){
                        let numeric = true;
                        for(let i = 0;i < payload.length; i++){
                            if(typeof (payload[i].intensities[0]) !== 'number'){numeric = false;}
                            if(typeof (payload[i].intensities[1]) !== 'number'){numeric = false;}
                            if(typeof (payload[i].intensities[2]) !== 'number'){numeric = false;}
                        }
                        if(numeric){
                            let inRange = true;
                            for(let i = 0;i < payload.length; i++){
                                payload[i].intensities[0] = (Math.round(parseFloat(payload[i][0])*10000)/10000);
                                payload[i].intensities[1] = (Math.round(parseFloat(payload[i][1])*10000)/10000);
                                payload[i].intensities[2] = (Math.round(parseFloat(payload[i][2])*10000)/10000);
                                if(payload[i].intensities[0] < 0 || payload[i][0] > 3 ){inRange = false;}
                                if(payload[i].intensities[1] < 0 || payload[i][1] > 3 ){inRange = false;}
                                if(payload[i].intensities[2] < 0 || payload[i][2] > 3 ){inRange = false;}
                            }
                            if(inRange){
                                console.log(`lights available: ${this.availableLights.length}`);
                                if(payload.length <= this.availableLights.length ){
                                    let uniqueIds = true;
                                    let idStore = [];
                                    for(let i = 0;i < payload.length; i++){
                                        if(idStore.includes(payload[i].id)){
                                            uniqueIds = false;
                                        }
                                        idStore.push(payload[i].id);
                                    }
                                    if(uniqueIds){
                                        this.socket.emit('api-set-individual-modelling-light',payload,(response)=>{
                                            if(response.status){
                                                resolve();
                                            }else{
                                                reject(response.msg);
                                            }
                                        });
                                    }else{
                                        reject('Duplicate Light IDs were passed')
                                    }
                                }else{
                                    reject('Could not set individual modelling lights -  too many light arrays were passed')
                                }
                            }else{
                                reject('Could not set individual modelling lights -  intensity should be between 0 and 3%');
                            }
                        }else{
                            reject('Could not set individual modelling lights -  light intensities should be a number');
                        }
                    }else{
                        reject('Could not set individual modelling lights - expecting arrays of length 3');
                    }
                }
            }else{
                reject('Could not set modelling light - Not connected to Esper API');
            }
        });
    }

    /*
    *   Turns the modelling light off - sets a zero brightness for each LED globally
    * */
    modellingLightOff(){
        return new Promise((resolve,reject)=>{
            this.modellingLight([0,0,0]).then(()=>{resolve();})
        });
    }

    /*
    *   Chain mode is for being able to take many photos - each light can only flash once
    * */
    chain(chainData){
        return new Promise((resolve,reject)=>{
            resolve({success:1,msg:'successfully executed'});
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
            reject('sopmefhgd');
        });
    }
};