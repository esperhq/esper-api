const esper = require('./esper');
const Esper = new esper();



Esper.sandbox()
    .then(()=>{

        Esper.sequence([[{id:1,intensities:[100,100,100],duration:5},{id:2,intensities:[3,50,99],duration:15},{id:3,intensities:[0.03,0.01944999,0.02],duration:5}]])
            .then(()=>{
                console.log("sequence mode activated");
                Esper.disconnect();
            })
            .catch((err)=>{
                console.log(`node 1 - ${Esper.nodeExists(3)}`);
                Esper.describeErrors(err);
            });

    }).catch((err)=>{
        Esper.describeErrors(err);
});


