const esper = require('./esper');
const Esper = new esper();


let sequenceData =[
    [
        {id: 1, intensities: [100, 100, 100], duration: 5},
        {id: 2, intensities: [3, 50, 99], duration: 15},
        {id: 3, intensities: [0.03, 0.01944999, 0.02], duration: 5},
        {id: 4, intensities: [0.03, 0.01944999, 0.02], duration: 5},
        {id: 5, intensities: [0.03, 100, 0.02], duration: 5},
        {id: 6, intensities: [0.03, 0.01944999, 100], duration: 30},

    ],
    [
        {id: 1, intensities: [100, 100, 100], duration: 5},
        {id: 2, intensities: [3, 50, 99], duration: 15},
        {id: 3, intensities: [0.03, 0.01944999, 0.02], duration: 5}
    ],
];

Esper.connect()
    .then(()=> {
        return Esper.sequence(sequenceData);
    })

    .then(()=>{
        console.log("sequence mode activated");
        return Esper.disconnect();
    })
    .catch((err)=>{
        console.log(err);
        Esper.describeErrors(err);
    });


