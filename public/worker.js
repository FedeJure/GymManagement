const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

let message2UI = (command, payload) => {
  ipcRenderer.send('message-from-worker', {
    command: command, payload: payload
  });
}

message2UI('helloWorld', { myParam: 1337, anotherParam: 42 });