# Rig Setup and Config

## Startup Tasks
A number of things happen on startup of an Esper Multiflash rig in order to configure the equipment for scanning.

A large proportion of this process is abstracted away behind the scenes, but for completeness, the startup process is described here. 

***
## Communication
The ControllerBox handles all communication with the Multiflashes. Whenever you communicate with a Multiflash through the API, the ControllerBox is the device that is responsible for managing that communication.

The computer needs to detect the ControllerBox, in order to achive this, it sends a series of arbitrary bytes to every serial device connected. An Esper ControllerBox is programmed to respond to these bytes with its version number. Once this has happened, the serial port is kept open and communication with the ControllerBox can begin.

When the Esper Control Suite is opened, it goes through this process. If the ControllerBox is not found during this startup, you can request the software attem

 ***
### First startup - Initial Configuration
>Initial setup will be carried out for you during installation and commissioning of your rig, however the information regarding the process of setting up a rig is documented here in the event you need to change your setup for any reason.

The very first time an Esper MultiFlash starts up, it does not have an ID and needs to be assigned one. Each ID is unique to that particular MultiFlash and is the way you identify each MultiFlash when using the API. Each ID infers positional information of that light. IDs for a LightCage are assigned top to bottom in an anticlockwise fashion. 

We need to tell each MultiFlash to save its assigned ID into its EEPROM memory. Once this has happened, the lights will remember their ID when they start up every subsequent time. 

~~In order to do this, we need to construct a NodeChain. This is the source of all information regarding the MultiFlashes that are connected to the ControllerBox. We need to tell the software what order the MultiFlashes are daisy-chained together.~~
#### Saving Rig Configuration
The software needs to be given its configuration file to know what lights are connected and in which order. In order to do this, call the following method:

```javascript
Esper.saveConfiguration('/path/to/my/configuration/file.txt');
//This will overwrite any previous settings

//if you want to preserve your current settings, call 

Esper.exportSettings()

.then((theSettings)=>{
    console.log(theSettings); //do something with them, maybe save to text file
});
```

This information will now be saved into the application's database for future reference. 

#### Assigning MultiFlash IDs

Now the application knows how many MultiFlashes are connected and in what order, it can assign IDs. You can do this with the following function.

```javascript
Esper.writeEEPROMAddresses();
/* Beware, if this function errors out, your rig may behave unpredictably 
or not respond at all until it successfully runs.
 Assigning IDs to lights is not something that is done often. */
```


$USER
***