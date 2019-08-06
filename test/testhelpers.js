let Server = require('http').Server();
let ioServer = require('socket.io')(Server);

module.exports = class {
    constructor(verbose = true) {
        this.lastMessage = '';
        this.verbose = verbose;
    }
    start(){
        return new Promise((resolve,reject)=>{
            if(this.verbose){console.log("starting server");}
            ioServer.on('connection',(socket)=>{
                if(this.verbose){console.log("server detected a client connection");}
                socket.on('api-set-global-modelling-light',(modellingLight,callback)=>{
                    callback({status:true});
                });
                socket.on('api-set-individual-modelling-light',(modellingLight,callback)=>{
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
            Server.listen('50005');
            resolve();
        });
    }
    getLastMessage(){
        return this.lastMessage;
    }
}