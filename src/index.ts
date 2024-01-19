import WebSocket from 'ws';
import * as lineReader from "line-reader";
try {

  const ws = new WebSocket('ws://localhost:8765', {
    handshakeTimeout: 500
  });



  ws.on('error', function error(err) {
    console.log("Error: " + err.code);
    ws.close();
  });

  ws.on('open', function open() {
    console.log("CONNECTED");
    ws.close();
  });

  const isValidJSONString = (str: string): boolean => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  lineReader.eachLine("C:/Users/danie/Development/api-rerunner/api_file.json", async (line, _): Promise<void> => {
    await eventHandler(line);
  });

  const eventHandler = async (event: any) => {
    try {
      if (
        isValidJSONString(event) ||
        isValidJSONString(event.substring(0, event.length - 1))
      ) {
        let validLine = event;

        if (!isValidJSONString(validLine)) {
          validLine = event.substring(0, event.length - 1);
        }

        const actualEvent = JSON.parse(validLine);

        ws.send(JSON.stringify(actualEvent));

        return Promise.resolve();
      }
    } catch (err) {
      console.log(err);

      return Promise.reject();
    }
  };

} catch (err) {
  console.log(err);
}