# Connecting to Esper API

In order to use `esper-api` you must required it in any script you want to run. When you require it, the module exports a class the must be instantiated;

```js
const esperClass = require('esper-api');
let Esper = new esperClass();
```

You can then connect to the API by calling the connect method like so:
```javascript
Esper.connect();

```
___
## Constructor arguments
The constructor for the Esper class takes three optional arguments.
```javascript
new esperClass(
    verbose = true, 
    endpoint = 'http://localhost', 
    port = 50005
);
```
### Verbose 
The first optional argument is a boolean that when set to true gives extended output on the console or reduced output when set to false.

```javascript
let Esper = new esperClass(true); // verbose output

let Esper = new esperClass(false); // silences non-essential console output
```

### Remote connection 
You can specify which machine you wish to make a connection to, by default it will assume localhost, but if the controller box is connected to a remote pc, it is possible to specify that as an endpoint for the API wrapper to connect to
```javascript
let Esper = new esperClass(true, 'http://192.168.1.54'); 
// make connection to local machine on IP address 192.168.1.54  
// (with verbose reporting as per the first argument)
```


### Port specification 
You can specify what port the API wrapper should use. This is useful if you have configured the Control Suite to run on a different port. For example you are already using port 50005 for something else or your network administration prohibits the use of that port
 
```javascript
let Esper = new esperClass(true, 'http://localhost', 8080);
// make connection on port 8080  
//(with verbose reporting and connecting to localhost as per the first argument)

 
```



