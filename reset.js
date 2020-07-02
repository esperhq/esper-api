const EsperFactory = require('./esper-api');
let esper = new EsperFactory();

esper.connect().then(()=>{
    console.log("API::resetting all lights...");
    return esper.useBackendTerminalCommand("r\n");
}).then(()=>{
    console.log("API::pause...");
    return esper.wait(2000);
}).then(()=>{
    console.log("API::loading light addresses...");
    console.log("\n\n --- check green lights are not blinking --- \n\n");
    console.log("\n\n ---        sequence data cleared        --- \n\n");

    return esper.useBackendTerminalCommand("i\n");
}).then(()=>{
    esper.disconnect();
}).catch((err)=>{
    console.error("API:: errors occured: ");
    console.table(err);
});
