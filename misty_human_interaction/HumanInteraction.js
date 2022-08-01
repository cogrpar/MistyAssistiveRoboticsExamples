/* ----------------- MISTY DIAGNOSTIC CAPTURE ----------------- */

// head pitch and yaw callback functions for face tracking
function _headYaw(data) {
    misty.Set("headYaw", data.AdditionalResults[1], false);
}
function _headPitch(data) {
    misty.Set("headPitch", data.AdditionalResults[1], false);
}




//* ------------------- DEFAULT CONFIGURATION ------------------ */
misty.Set("basePitch", 0, false);
misty.Set("skill", "FaceDetect", false);
misty.Set("callbackArgs", [], false);
misty.Set("faceDataLabel", "unknown person", false);
misty.Set("faceDataBearing", 0, false); // -13 right and +13 left
misty.Set("faceDataElevation", 0, false); // -13 up and +13 down




/* ----------------- MISTY INTERACTION SKILLS ----------------- */
function _FaceDetect (data){
    // debugging function used to test if camera is able to recognize face
    // to monitor filter misty debug messages by 'face_detect'
    data = (typeof data.Label !== "undefined" && typeof data.bearing !== "undefined" && typeof data.elevation !== "undefined") ? data : {"Label": misty.Get("faceDataLabel"), "bearing": misty.Get("faceDataBearing"), "elevation": misty.Get("faceDataElevation")}; 
    
    if (data.Label == "unknown person") {
        misty.Debug("face_detect: unknown face detected");
    }
    else {
        misty.Debug("face_detect: known face detected");
    }
    misty.Debug("success");
}

function _ReadOnFaceDetect(data, callbackArgs=misty.Get("callbackArgs")) {
    // function that causes misty to speak the passed callback args on a face being detected
    misty.Speak(callbackArgs); // Speak is still not working on misty
    misty.Debug("speaking: " + callbackArgs);
}

function _TrackFace(data){
    // function to track a person's face once they have been identified and misty has said hello

    data = (typeof data.Label !== "undefined" && typeof data.bearing !== "undefined" && typeof data.elevation !== "undefined") ? data : {"Label": misty.Get("faceDataLabel"), "bearing": misty.Get("faceDataBearing"), "elevation": misty.Get("faceDataElevation")}; 

    const faceDetect = data.Label;
    const bearing = data.bearing; // -13 right and +13 left
    const elevation = data.elevation; // -13 up and +13 down

    misty.Debug(bearing);
    
    const update = faceDetect + " detected, following face...";
    misty.Debug(update);

    const headYaw = misty.Get("headYaw");
    const headPitch = misty.Get("headPitch");
    const yawRight = misty.Get("yawRight");
    const yawLeft = misty.Get("yawLeft");
    const pitchUp = misty.Get("pitchUp");
    const pitchDown = misty.Get("pitchDown");

    if (bearing != 0 && !(elevation < 7 && elevation > -7)) { // move misty's head so that it is oriented towards the user's face (this gets triggered if misty needs to reorient the pitch)
        misty.MoveHeadDegrees(headPitch + ((pitchDown - pitchUp) / 66) * elevation, 0, headYaw + ((yawLeft - yawRight) / 132) * bearing, 100); // adjust pitch and yaw based on the location of the face (100% velocity)
    } else if (bearing != 0) {
        if (Math.abs(bearing) > 2){ // if the bearing is offset by more than  from center, rotate the entire robot to face the person
            var direction;
            if (bearing > 0) { // positive bearing
                direction = 1;
            }
            else { // negative bearing
                direction = -1;
            }
            misty.DriveTime(0 /* linear velocity */, 100 * direction /* angular velocity */, 1500 /* time */); // rotate misty to the direction of the person
            misty.MoveHeadDegrees(5 /* pitch */, 0 /* roll */, -((headYaw + (yawLeft - yawRight) / 132) * bearing)/40 /* yaw */, 100 /* velocity */); // rotate misty's head in the opposite direction to offset the rotation of the body
            misty.Pause(2000);
        }
        else {
            misty.MoveHeadDegrees(0, 0, headYaw + ((yawLeft - yawRight) / 132) * bearing, 100);
        }
    } else {
        misty.MoveHeadDegrees(headPitch + ((pitchDown - pitchUp) / 66) * elevation, 0, 0, 100);
    }
    misty.Pause(500);

}




/* ----------------------- LIBRARY CLASS ---------------------- */
function constructor() {
        // arguments of the form: this.basePitch=0, skill=this.FaceDetect, callbackArgs=[]

        if (typeof arguments[0] == "number") {
            misty.Set("basePitch", arguments[0], false);
        }
        else if (typeof arguments[0] == "string") {
            misty.Set("skill", arguments[0], false);
        }
        else if (typeof arguments[0] == "object") {
            misty.Set("callbackArgs", arguments[0], false);
        }

        if (typeof arguments[1] == "string") {
            misty.Set("skill", arguments[1], false);
        }
        else if (typeof arguments[1] == "object") {
            misty.Set("callbackArgs", arguments[1], false);
        }

        if (typeof arguments[2]) {
            misty.Set("callbackArgs", arguments[2], false);
        }

        // Global variable to store current pitch and yaw position of the head
        // 'basePitch' is the default base angle of the pitch of the head (usually adjusted so to make misty look up if on the ground)
        misty.Debug("Centering Head");
        misty.MoveHeadDegrees(-misty.Get("basePitch"), 0, 0, null, 0.5);
        misty.Set("headYaw", 0.0, false);
        misty.Set("headPitch", -misty.Get("basePitch"), false);

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

        /*// define a function to register the face recognition events
        function registerFaceRec(){
            // Cancels any face recognition that's currently underway
            misty.StopFaceRecognition();
            // Starts face recognition
            misty.StartFaceRecognition();

            misty.Debug("registered");

            misty.AddPropertyTest("FaceRec", "Label", "exists", "", "string"); // AddPropertyTest adds a test to determine which data will be sent to the event, in this case, if there is a person that goes with the detected face
            misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, true); // RegisterEvent to register an event for face recognition (see callback function definition below)
        }
        registerFaceRec();*/
}

// define a function to register the face recognition events
function registerFaceRec(debounce=250){
    // Cancels any face recognition that's currently underway
    misty.StopFaceRecognition();
    // Starts face recognition
    misty.StartFaceRecognition();

    misty.Debug("registered");

    misty.AddPropertyTest("FaceRec", "Label", "exists", "", "string"); // AddPropertyTest adds a test to determine which data will be sent to the event, in this case, if there is a person that goes with the detected face
    misty.RegisterEvent("FaceRec", "FaceRecognition", debounce, true); // RegisterEvent to register an event for face recognition (see callback function definition below)
}



/* ------------------ MAIN CALLBACK FUNCTION ------------------ */
function _FaceRec(data) { // FaceRec callback function
    misty.Debug("running skill: " + misty.Get("skill"));
    //misty.Set("faceData", data.PropertyTestResults[0].PropertyParent, false); 
    misty.Set("faceDataLabel", data.PropertyTestResults[0].PropertyParent.Label, false);
    misty.Set("faceDataBearing", data.PropertyTestResults[0].PropertyParent.Bearing/2, false); // -13 right and +13 left
    misty.Set("faceDataElevation", data.PropertyTestResults[0].PropertyParent.Elevation/2, false); // -13 up and +13 down

    misty.RegisterTimerEvent(misty.Get("skill"), 800, false);
}

registerFaceRec(3000);
const test = constructor(30, "ReadOnFaceDetect", ["que pasa my home slice, chillin brutha?"]);

