# API Design Philosophy

The design philosophy for the Esper API has focused on allowing the user to create real time, event driven scripts to expose the full functionality of the range of Esper products.    

To allow for fine-grained control of chained events, every method on the Esper API returns a promise that resolves when the requested action has been carried out or rejected upon an error.

This allows for easy chaining of order-critical events, for example;
```javascript
const esperClass = require('esper-api');
let Esper = new esperClass();
let sequencePayload = { };   //populated with correct information


Esper.connect()

.then(Esper.checkRigFunctionality)

.then(()=>{
    return Esper.globalModellingLight([0,0.7,0])
})

.then(()=>{
    return Esper.sequence(sequencePayload);
})

.then(Esper.trigger)

.then(Esper.disconnect)

.catch(Esper.describeErrors);       //handles any rejected promise in the chain
```

If a method returns data, it will resolve its promise with the requested payload.

More information on promises can be found in the [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

