let EsperFactory = require("./esper-api.js")
let esper = new EsperFactory()

esper.connect().then(()=>{
    return esper.getAvailableLights()
}).then((availableLights)=>{
    esper.useBackendTerminalCommand("f");
    setTimeout(()=>{
        esper.useBackendTerminalCommand("w");
        // Check printout from ControlSuite console window... each light should be at position 1
    }, 100);
    setTimeout(()=>{
        esper.disconnect()
    }, 1000)
})

