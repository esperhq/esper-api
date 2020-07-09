let esperClass = require("./esper-api.js");
let Esper = new esperClass(true); // enable verbose reporting

Esper.connect()
    .then(() => {
        let stage = [];
        let duration = 2;
        for (let i = 0; i < Esper.availableLights.length; i++){
            stage.push({id: Esper.availableLights[i].id, intensities: [100, 100, 100], duration: duration});
        }
        let payload = [];
        for (let j = 0; j < 32; j++){
            payload.push(stage);
        }
        return Esper.sequence(payload);
    })

    .then(() => {
        Esper.disconnect();
    }).catch((errs) => {
    Esper.describeErrors(errs);
});
