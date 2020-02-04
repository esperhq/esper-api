# Lighting Profiles
Before we can do anything with a rig of MultiFlash units, we have to give them some instructions about what to do.

There are two modes the MultiFlashes can be in:
1. Chain Mode
2. Sequencer Mode
 ___
## Chain Mode
 Chain mode offers the user the ability to have fine-grained, multi-step directional lighting for the subject. Each individual MultiFlash can only flash once per take. In its longest form, this could be one light at a time, one after the other. It is possible to have more than one light illuminate per step giving a large number of creative options. 
 `Esper.chain()` accepts an array of objects object as an argument. Each element in this array details what a particular light should do. An example of a single element is:
```javascript
{
    id:1,                  // ID of the light node 
    stage:2,               // the step on which this light is to flash. (this example, MultiFlash #1 will flash on the second exposure)
    intensities:[99,50,0], // Flash Illumination in    tensities for each of the LEDs on the light node. (0-100 %)
    duration:1.99          // Flash duration in ms. 0 < flashDuration <= 30 ms
}
```   

An example of a full chain mode payload could look like this:
```javascript
let chainPayload = [
    {
        id:1,
        stage:1,
        intensities:[100,0,0],
        duration:5,
    },
    {
        id:2,
        stage:2,
        intensities:[0,100,0],
        duration:5,
    },
    {
        id:3,
        stage:2,
        intensities:[0,0,100],
        duration:5,
    },
    {
        id:4,
        stage:3,
        intensities:[100,100,100],
        duration:10,
    }
];

Esper.chain(chainPayload)
    .then(()=>{
        console.log("Chain mode data uploaded to the Light Nodes");
        //ready to trigger    
    })
    .catch((err)=>{
        Esper.describeErrors(err);
    });
```
This example result in a lighting profile with 3 stages. In the first stage, only light node 1 flashes, on the second stage light nodes 2 and 3 flash, and the third and final stage is where light 4 flashes all three of its LEDs.


___ 
## Sequencer Mode
Sequencer mode allows you to create complex lighting stages. Each light stage is independent from the one that came before it, so unlike chain mode, each light can flash on as many light stages as you like. There is a maximum of 32 light stages.

The payload sent to the `Esper.sequence(payload)` method is an array of lighting stages.

Each light stage has the following attributes:
```javascript
[
    {id:1,intensities:[0,0,75.00],duration:5.5},
    {id:2,intensities:[100,0,0], duration: 5.5},
    {id:3,intensities:[100,0,0],duration:5},
    {id:4,intensities:[0,100,0],duration:3},
    //...
    {id:156,intensities:[0,100,0],duration:10.55},
]
```
The ID parameter is the ID of the light, the intensities are the brighnesses you want each LED to flash at and the duration is the flash duration for that light in ms.


Multiple light stages are then assembled into a full payload :
```javascript
let sequencePayload =[
    [   // Stage 1
        {id:1,intensities:[100,0,0],duration:5.5},
        {id:2,intensities:[100,0,0],duration:5},
        {id:3,intensities:[100,0,0],duration:5},
        {id:4,intensities:[100,0,0],duration:3},
        ...
        {id:156,intensities:[100,0,0],duration:5.5}, 
    ],
    [   // Stage 2
        {id:1,intensities:[0,100,0],duration:5.5},
        {id:2,intensities:[0,100,0],duration:5},
        {id:3,intensities:[0,100,0],duration:5},
        {id:4,intensities:[0,100,0],duration:3},
        ...
        {id:156,intensities:[0,100,0],duration:10.55},
    ],
    //... so on up to a maximum of 32 stages
]



Esper.sequence( sequencePayload )
    .then(()=>{        
        console.log("Sequencer payload uploaded");
        //then do other things
        
    })
    .catch((errs)=>{
        Esper.describeErrors(errs);
    });
```
