console.log("no")
misty.EnableAvStreamingService();

misty.StartAvStreaming("rtsp:6968", 640, 480, 30, 256000, 1000000, 48000, null, null);
