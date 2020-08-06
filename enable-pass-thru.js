const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect()
    .then(()=> {
        console.log("Enabling pass through mode...");
        esper.useBackendTerminalCommand("PT 1");
        setTimeout(()=>{
            esper.disconnect()
        }, 1000);
    })
    .catch((errs)=>{
        console.error("API::caught errors:");
        console.table(errs);
    });

