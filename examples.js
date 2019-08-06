const esper = require('./Esper');
let theHelpers = require('./test/testhelpers');
let helper = new theHelpers(false);

const Esper = new esper('http://localhost:50005',true);

helper.start().then(()=>{
    Esper.connect()
        .then(()=>{

            Esper.modellingLight([{id:1,intensities:[0.03,0.01944999,0.02]},{id:2,intensities:[0.03,0.01944999,0.02]},{id:6,intensities:[0.03,0.01944999,0.02]}])
                .then(()=>{
                    console.log("Modelling lights set");
                })
                .catch((error)=>{
                    console.log(error);
                });
            Esper.modellingLightOff();
        });
});

/*

Esper.chain({

}).then((response)=>{
    console.log(response.msg);
}).catch((error)=>{
    console.log(error.msg);
});


Esper.trigger().catch((error)=>{console.log(error);});
*/
