const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect().then(()=>{
    console.log("API::Switching to gradient mode...");
    return esper.useBackendTerminalCommand("m 1\n");
}).then(()=>{
    console.log("API::Rewinding Sequence Point...");
    return esper.rewindSequencePoint();
}).then(()=>{
    return esper.disconnect();
}).catch((errs)=>{
    console.error("API::caught errors:");
    console.table(errs);
});

