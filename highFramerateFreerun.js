let esperClass = require("./esper-api.js");
let Esper = new esperClass(true); // enable verbose reporting

Esper.connect()

    .then(()=>{
        return Esper.globalModellingLight([0,0,0]);
    })

    .then(()=>{
        return Esper.wait(500);
    })

    .then(()=>{
        return Esper.continuousCapture({
            fps:20,
            flashLag:0,                 //milliseconds
            triggerDuration:2,          //milliseconds
            triggerOutput:'gp1',        //  (cc1,cc2,gp1,gp2)
            triggerChannel:'a',         // (a, b)
            triggerType:'5v'            // (5v, cc, diff)
        })
    })

    .then(()=>{
        return Esper.wait(1000);   //wait for 1 second (1000ms)
    })
    .then(()=>{
        return Esper.stopContinuousCapture();      //stop capture
    })

    .then(()=>{
        Esper.globalModellingLight([0,0.15,0]);
    })
    .then(()=>{
        Esper.disconnect(); //disconnect from API
    })
    .catch((errs)=>{
        Esper.describeErrors(errs);
    });