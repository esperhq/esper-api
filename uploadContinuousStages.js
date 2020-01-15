let esperClass = require("./esper-api.js");
let Esper = new esperClass(true); // enable verbose reporting


// let disallowed = [181,182, 211,212,213, 240,241,242,243, 270,271,272,273,274,  298,299,300,301, 321,322,323 ];
// for(let j=1; j<332; j++){
//     if(!disallowed.indexOf(j)){
//         stage.push({id:j,intensities:[0,100,0],duration:duration})
//     }
// }
//
// for(let i=0; i<32;i++){
//     payload.push(stage);
// }
//




Esper.connect()
    .then(()=>{
        let stage = [];
        let duration = 1;
        for(let i=0;i<Esper.availableLights.length;i++){
            stage.push({id:Esper.availableLights[i].id,intensities:[0,100,0],duration:duration})
        }
        let payload = [];
        for(j = 0;j<32;j++){
            payload.push(stage);
        }
        return Esper.sequence(payload)
    })

    .then(()=>{
        Esper.disconnect()
}).catch((errs)=>{
    Esper.describeErrors(errs);
})