misty.StopAvStreaming();

misty.Pause(500);

misty.EnableAvStreamingService();
misty.Pause(500);
misty.StartAvStreaming("rtspd:1935", 640, 480, 30, 256000, 1000000, 48000, "username", "password");


misty.Debug("thing is done");
