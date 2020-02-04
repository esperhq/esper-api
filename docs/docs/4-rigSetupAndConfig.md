# Rig Setup and Config

## Communication
The ControllerBox handles all communication with the Multiflashes. Whenever you communicate with a Multiflash through the API, the ControllerBox is the device that is responsible for managing that communication.

The computer needs to detect the ControllerBox, in order to achieve this, it sends a series of arbitrary bytes to every serial device connected on startup. An Esper ControllerBox is programmed to respond to these bytes with its version number. Once this has happened, the serial port is kept open and communication with the ControllerBox can begin.

___
##Configuration
### Loading in Rig Configuration
The software needs to be given its configuration file to know what lights are connected and in which order. In order to do this, call the following method:

```javascript
Esper.saveConfiguration('/path/to/my/configuration/file.txt');
//This will overwrite any previous settings
```
This information will now be saved into the application's database for future reference. 

### Exporting Rig Configuration 
Make a call to `exportSettings()`, this returns a promise that resolves with a json object the contains all the application settings. You can save this out as a `.json` file or stringify it and save it as a text file.
```javascript
Esper.exportSettings()

.then((theSettings)=>{
    console.log(theSettings); //do something with them, maybe save to text file
});
```

___

## Startup Procedure

### Powering Up 
The following steps are to be followed to safely power up the rig;

1. Ensure everything is plugged in correctly  
    * Make sure all connectors are plugged in firmly  
        * On each MultiFlash  
        * On every Neutrik connector on the Rack and Rig
        * 240V connectors  
    * There must be no un-connected plugs
2. Ensure the Emergency Stop button is pressed
3. Turn on power at wall isolator
4. Supply power to each PSU with the breakers on the back of the rack
5. Ensure all PSUs show the red standby status light on the front
6. Release the Emergency Stop button
7. Ensure all PSUs now show the green status light on the front
8. All connected MultiFlash units should now be powered
9. Ensure all MultiFlashes are now showing a flashing green status light on the rear casing
   
### Software startup
Connect the ControllerBox to the computer you have the Esper Control Suite installed on. Start the Esper Control Suite. This will automatically start the ControllerBox detection process. Once it has correctly detected a ControllerBox, the software will issue a success message.

### Calling the API
With the Control Suite application successfully running, you can now execute your API scripts. Make sure the prerequisite modules are installed using `npm install`.

