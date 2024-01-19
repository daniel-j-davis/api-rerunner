import WebSocket from 'ws';
import * as lineReader from "line-reader";


const ws = new WebSocket('ws://localhost:8765', {
  handshakeTimeout: 500
});

const isValidJSONString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

lineReader.eachLine("/home/ubuntu/apps/api-rerunner/api_file.json", async (line, _): Promise<void> => {
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

