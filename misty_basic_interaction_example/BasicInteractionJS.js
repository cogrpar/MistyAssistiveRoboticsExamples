/* ---------------------- MISC FUNCTIONS ---------------------- */

// Returns a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




/* ---------------------- INTERACTION FUNCTIONS ---------------------- */

function greetPerson(){
    // face detected, so change LED, move head, and wave
    //misty.PlayAudio("s_Amazement.wav", 30);

    //mirrorFace();

    misty.TransitionLED(0, 0, 0, 0, 0, 140, "TransitOnce", 1000);

    misty.MoveHeadDegrees(-10 + getRandomInt(-20, 20), getRandomInt(-20, 20), getRandomInt(-20, 20), null, 1);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(-10 + getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(-10, 10), null, 0.5);
    misty.MoveArm("left", 45, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(-10 + getRandomInt(-15, 15), getRandomInt(-15, 15), getRandomInt(-15, 15), null, 0.3);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);

    misty.TransitionLED(0, 0, 140, 0, 0, 0, "TransitOnce", 1000);
    // center the head
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(-10, 0, 0, null, 0.5);
    // move arms to the start position
    misty.MoveArm("left", 90, 90);
    misty.MoveArm("right", 90, 90);

    //misty.DisplayImage("e_DefaultContent.jpg");

    misty.Pause(3000);
}

function greetVisitor (speech){
    // ---------------- talk to a visitor demo ---------------- //
    misty.SetDefaultVolume(50);
    misty.Speak(speech, 1.2);
    misty.Pause(100);

    // call greet person for "fun" movements
    greetPerson();
}

function mirrorFace(){
    // function that capture's picture of participant's face and displays it on the screen
    misty.TakePicture("face.jpg", 1600, 1200, false, true);
    misty.DisplayImage("face.jpg");
    misty.Pause(2000);
}

function getSad(){
    // function that makes misty react sadly
    misty.PlayAudio("s_Grief.wav", 30);
    misty.DisplayImage("e_Sadness.jpg");

    misty.TransitionLED(0, 0, 0, 140, 0, 0, "TransitOnce", 1000);

    misty.MoveHeadDegrees(-40 + getRandomInt(-20, 20), getRandomInt(-20, 20), getRandomInt(-20, 20), null, 1);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(-40 + getRandomInt(-10, 10), getRandomInt(-10, 10), getRandomInt(-10, 10), null, 0.5);
    misty.MoveArm("left", 45, 90);
    misty.Pause(1500);
    misty.MoveHeadDegrees(-40 + getRandomInt(-15, 15), getRandomInt(-15, 15), getRandomInt(-15, 15), null, 0.3);
    misty.MoveArm("left", 0, 90);
    misty.Pause(1500);

    misty.TransitionLED(140, 0, 0, 0, 0, 0, "TransitOnce", 1000);
    // center the head
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(-40, 0, 0, null, 0.5);
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
function initiateVariables()
{
    misty.Debug("Centering Head");
    misty.MoveHeadDegrees(-10, 0, 0, null, 0.5);
}

initiateVariables();


/* ---------------------- MAIN ---------------------- */


// ---------------- talk to the governor demo ---------------- //
misty.RegisterEvent("Triggered", "BumpSensor", 200, true); // create an event that listens for any of the buttons on misty to be pressed
misty.AddPropertyTest("Triggered", "isReleased", "==", true, "boolean"); // add a property test to only call _Triggered() when the button is pressed and not when it is released

function _Triggered(data) { // callback function that is run when the button is pressed: greets the visitor
    greetVisitor("Welcome to the Innovation Center Governor Polis and distinguished guests"); // change the text passed to this function to change what misty says to greet the guest
}