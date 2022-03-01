class FaceTracking {
    constructor(basePitch=0) {
        // Global variable to store current pitch and yaw position of the head
        // 'basePitch' is the default base angle of the pitch of the head (usually adjusted so to make misty look up if on the ground)
        misty.Debug("Centering Head");
        misty.MoveHeadDegrees(-basePitch, 0, 0, null, 0.5);
        misty.Set("headYaw", 0.0, false);
        misty.Set("headPitch", -basePitch, false);

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
    }

    // define a function to register the face recognition events
    _registerFaceRec(){ // TODO see if this can be added to constructor to only run once to speed things up
        misty.Debug("registered")

        misty.AddPropertyTest("FaceRec", "Label", "exists", "", "string"); // AddPropertyTest adds a test to determine which data will be sent to the event, in this case, if there is a person that goes with the detected face
        misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false); // RegisterEvent to register an event for face recognition (see callback function definition below)
    }

    _FaceRec(data, train_face=false, name="person1") { // FaceRec function definition TODO modify to utilize 'misty_face_tracking' library once complete
        misty.Debug("looking for face...")
        // Check if the FaceRec event was triggered by a stranger
        if (data.PropertyTestResults[0].PropertyParent.Label == "unknown person"){
            // Misty doesn't recognize this person.
            misty.Debug("unknown face detected!");

            //_trackFace(data); // realign with face
            misty.RegisterTimerEvent("registerFaceRec", 800, false);
        }
        else {
            // Misty knows this person. Do something else.
            misty.Debug("known face detected: " + data.PropertyTestResults[0].PropertyParent.Label);
            // Misty doesn't recognize this person.
            misty.Debug("unknown face detected!");

            //_trackFace(data); // realign with face
            misty.RegisterTimerEvent("registerFaceRec", 800, false);
        }
    }

}


/*
function _trackFace(data){
    // function to track a person's face once they have been identified and misty has said hello

    const faceDetected = data.PropertyTestResults[0].PropertyParent.Label;
    const bearing = data.PropertyTestResults[0].PropertyParent.Bearing/2; // -13 right and +13 left
    const elevation = data.PropertyTestResults[0].PropertyParent.Elevation/2; // -13 up and +13 down
    misty.Debug(faceDetected + " detected");

    const headYaw = misty.Get("headYaw");
    const headPitch = misty.Get("headPitch");
    const yawRight = misty.Get("yawRight");
    const yawLeft = misty.Get("yawLeft");
    const pitchUp = misty.Get("pitchUp");
    const pitchDown = misty.Get("pitchDown");

}
 */