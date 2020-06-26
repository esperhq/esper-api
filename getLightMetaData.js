let esperClass = require('./esper-api');

let Esper = new esperClass();

Esper.connect()
    .then(()=>{
        //print the meta associated with the first light in the chain
        console.log(JSON.stringify(Esper.availableLights[0], null, "\t"));
    })
    .catch(Esper.describeErrors);