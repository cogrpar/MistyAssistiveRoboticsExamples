/* ---------------------- MISC FUNCTIONS ---------------------- */

// Returns a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




/* ---------------------- INTERACTION FUNCTIONS ---------------------- */

function greetPerson(){
    // face detected, so change LED, move head, and wave
    misty.PlayAudio("s_Amazement.wav", 30);

    //mirrorFace();

    misty.TransitionLED(0, 0, 0, 0, 0, 140, "TransitOnce", 1000);

    misty.MoveHeadDegrees(getRandomInt(-20, 20), getRandomInt(-20, 20), getRandomInt(-20, 20), null, 1);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(-10, 10), null, 0.5);
    misty.MoveArm("left", 45, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(getRandomInt(-15, 15), getRandomInt(-15, 15), getRandomInt(-15, 15), null, 0.3);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
        
    misty.TransitionLED(0, 0, 140, 0, 0, 0, "TransitOnce", 1000);
    // center the head
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(0, 0, 0, null, 0.5);
    // move arms to the start position
    misty.MoveArm("left", 90, 90);
    misty.MoveArm("right", 90, 90);

    //misty.DisplayImage("e_DefaultContent.jpg");

    misty.Pause(3000);
}

function mirrorFace(){
    // function that capture's picture of participant's face and displays it on the screen
    misty.TakePicture("face.jpg", 1600, 1200, false, true);
    misty.DisplayImage("face.jpg");
    misty.Pause(2000);
}

function _trackFace(data){
    // function to track a person's face once they have been identified and misty has said hello

    const faceDetected = data.PropertyTestResults[0].PropertyParent.Label; 
    const bearing = data.PropertyTestResults[0].PropertyParent.Bearing; // -13 right and +13 left
    const elevation = data.PropertyTestResults[0].PropertyParent.Elevation; // -13 up and +13 down
    misty.Debug(faceDetected + " detected");

    const headYaw = misty.Get("headYaw");
    const headPitch = misty.Get("headPitch");
    const yawRight = misty.Get("yawRight");
    const yawLeft = misty.Get("yawLeft");
    const pitchUp = misty.Get("pitchUp");
    const pitchDown = misty.Get("pitchDown");

    // TODO have misty rotate if the face is far enough to the side
    if (bearing != 0 && elevation != 0) { // move misty's head so that it is oriented towards the user's face
        misty.MoveHeadDegrees(headPitch + ((pitchDown - pitchUp) / 66) * elevation, 0, headYaw + ((yawLeft - yawRight) / 132) * bearing, 100); // adjust pitch and yaw based on the location of the face (100% velocity)
    } else if (bearing != 0) {
        misty.MoveHeadDegrees(0, 0, headYaw + ((yawLeft - yawRight) / 132) * bearing, 100);
    } else {
        misty.MoveHeadDegrees(headPitch + ((pitchDown - pitchUp) / 66) * elevation, 0, 0, 100);
    }

}

function getSad(){
    // function that makes misty react sadly
    misty.PlayAudio("s_Grief.wav", 30);
    misty.DisplayImage("e_Sadness.jpg");

    misty.TransitionLED(0, 0, 0, 140, 0, 0, "TransitOnce", 1000);

    misty.MoveHeadDegrees(getRandomInt(-20, 20), getRandomInt(-20, 20), getRandomInt(-20, 20), null, 1);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(-10, 10), null, 0.5);
    misty.MoveArm("left", 45, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(getRandomInt(-15, 15), getRandomInt(-15, 15), getRandomInt(-15, 15), null, 0.3);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
        
    misty.TransitionLED(140, 0, 0, 0, 0, 0, "TransitOnce", 1000);
    // center the head
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(0, 0, 0, null, 0.5);
    // move arms to the start position
    misty.MoveArm("left", 90, 90);
    misty.MoveArm("right", 90, 90);

    misty.DisplayImage("e_DefaultContent.jpg");

    misty.Pause(3000);
}




/* ---------------------- INIT ---------------------- */

// alert to notify user skill has started
misty.Debug("face recognition and interaction skill started");

// center the head
function initiateFaceFollowVariables() 
{
    // Global variable to check whether Misty is searching for a face
    // or looking at a face
    misty.Set("findFace", false);

    // Global variable to store current pitch and yaw position of the head
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(0, 0, 0, null, 0.5);
    misty.Set("headYaw", 0.0, false);
    misty.Set("headPitch", 0.0, false);

    misty.Set("said_hi", false, false); // variable that determines if misty has said hi to the person yet
    misty.Set("time_away", 0, false); // variable that keeps track of how long misty has gone without seeing a face 
}
initiateFaceFollowVariables();
// move arms to the start position
misty.MoveArm("left", 90, 90);
misty.MoveArm("right", 90, 90);


// register listener for head yaw position from ActuatorPosition events
function registerYaw() 
{
    misty.AddReturnProperty("headYaw", "SensorId");
    misty.AddReturnProperty("headYaw", "Value");
    misty.AddPropertyTest("headYaw", "SensorId", "==", "ahy", "string");
    misty.RegisterEvent("headYaw", "ActuatorPosition", 100, true);
}
registerYaw();

// register listener for pitch position from ActuatorPosition events
function registerPitch() 
{
    misty.AddReturnProperty("headPitch", "SensorId");
    misty.AddReturnProperty("headPitch", "Value");
    misty.AddPropertyTest("headPitch", "SensorId", "==", "ahp", "string");
    misty.RegisterEvent("headPitch", "ActuatorPosition", 100, true);
}
registerPitch();

// head pitch and yaw callback functions for face tracking
function _headYaw(data) 
{
    misty.Set("headYaw", data.AdditionalResults[1], false);
}
function _headPitch(data) 
{
    misty.Set("headPitch", data.AdditionalResults[1], false);
}

// set the limits of how misty's head can rotate for face tracking
function initiateHeadPhysicalLimitVariables() 
{
    misty.Set("yawRight", -90.0, false);
    misty.Set("yawLeft", 90.0, false);
    misty.Set("pitchDown", 90.0, false);
    misty.Set("pitchUp", -90.0, false);
    misty.Pause(3000);
    return 0;
}
initiateHeadPhysicalLimitVariables();


// define a function to register the face recognition events
function _registerFaceRec(){
    // Cancels any face recognition that's currently underway
    misty.StopFaceRecognition();
    // Starts face recognition
    misty.StartFaceRecognition();

    misty.Debug("registered")

	misty.AddPropertyTest("FaceRec", "Label", "exists", "", "string"); // AddPropertyTest adds a test to determine which data will be sent to the event, in this case, if there is a person that goes with the detected face
	misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false); // RegisterEvent to register an event for face recognition (see callback function definition below)
}

// define a function that will increase the timer since a face was last seen in the background
function _addTimeAway(){
    // update the time_away variable
    misty.Set("time_away", misty.Get("time_away")+1, false);

    if (misty.Get("time_away") > 10){ // if it has been more than ten seconds without seeing a face, misty will become sad
        getSad();
        misty.Set("time_away", 0, false);
        misty.Set("said_hi", false, false);
    }

    misty.RegisterTimerEvent("addTimeAway", 1000, false); // wait 1 second and call the function again
}
_addTimeAway();




/* ---------------------- MAIN ---------------------- */

function _FaceRec(data, train_face=false, name="person1") { // FaceRec function definition
    misty.Debug("looking for face...")
	// Check if the FaceRec event was triggered by a stranger
	if (data.PropertyTestResults[0].PropertyParent.Label == "unknown person"){
		// Misty doesn't recognize this person. 
        misty.Debug("unknown face detected!");
        //misty.Debug(data.PropertyTestResults[0].PropertyParent.Distance.toString());

        if (!misty.Get("said_hi")){
            greetPerson();
            misty.Set("said_hi", true, false); // set 'said_hi' to true
        }
        misty.Set("time_away", 0, false); // reset time_away to 0 seconds as a face has just been seen

        if (train_face) {
            // if this parameter is set to true, train on the unknown face
            misty.Debug("training on face, don't move...");
            res = misty.StartFaceTraining(name);
            misty.Pause(5000);
            misty.Debug("Done!");
        }

        _trackFace(data); // realign with face
        misty.RegisterTimerEvent("registerFaceRec", 200, false);
	} 
	else {
		// Misty knows this person. Do something else.
        misty.Debug("known face detected: " + data.PropertyTestResults[0].PropertyParent.Label);
        misty.Debug(data.PropertyTestResults[0].PropertyParent.Distance.toString());

        if (!misty.Get("said_hi")){
            greetPerson();
            misty.Set("said_hi", true, false); // set 'said_hi' to true
        }
        misty.Set("time_away", 0, false); // reset time_away to 0 seconds as a face has just been seen

        _trackFace(data); // realign with face
        misty.RegisterTimerEvent("registerFaceRec", 200, false);
  	}
}
misty.Debug("registering face rec event")
_registerFaceRec(); // call the register function
