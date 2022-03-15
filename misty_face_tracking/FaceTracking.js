class FaceTracking {

    FaceDetect (data, unknownFace){
        // debugging function used to test if camera is able to recognize face
        // to monitor filter misty debug messages by 'face_detect'
        if (unknownFace) {
            misty.Debug("face_detect: unknown face detected");
            misty.Debug(data);
        }
    }

    ReadOnFaceDetect (data, callbackArgs){
        // function that causes misty to speak the passed callback args on a face being detected
        misty.Speak(callbackArgs[0]);
    }

    constructor(basePitch=0, skill="FaceDetect", callbackArgs=[]) {
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

        // define a function to register the face recognition events
        function _registerFaceRec(){
            // Cancels any face recognition that's currently underway
            misty.StopFaceRecognition();
            // Starts face recognition
            misty.StartFaceRecognition();

            misty.Debug("registered");

            misty.AddPropertyTest("FaceRec", "Label", "exists", "", "string"); // AddPropertyTest adds a test to determine which data will be sent to the event, in this case, if there is a person that goes with the detected face
            misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false); // RegisterEvent to register an event for face recognition (see callback function definition below)
        }

        function _FaceRec(data, call=skill) { // FaceRec callback function
            let unknownFace = data.PropertyTestResults[0].PropertyParent.Label == "unknown person"; // bool that is true if this is an unknown face
            if (call == "FaceDetect"){
                // call face detect function passing data to it
                this.FaceDetect(data, unknownFace);
            }
            misty.RegisterTimerEvent("registerFaceRec", 800, false);
        }

        _registerFaceRec(); // call the register function
    }

}

const test = new FaceTracking(callbackArgs=["hello world"]);



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