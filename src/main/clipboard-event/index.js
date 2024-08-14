// Copied from https://github.com/sudhakar3697/node-clipboard-event

import * as path from 'path';

import {
  EventEmitter 
} from 'events';
import {
  execFile 
} from 'child_process';

const currentDirName = path.dirname(__dirname);

class ClipboardEventListener extends EventEmitter {
  constructor() {
    super();
    this.child = null;
  }

  startListening() {
    const {
      platform 
    } = process;

    if (platform === 'win32') {
      // TODO: Make this path dynamic.
      this.child = execFile(path.join(currentDirName, 'main/clipboard-event/platform/clipboard-event-handler-win32.exe'));
    }
    else if (platform === 'linux') {
      this.child = execFile(path.join(currentDirName, 'main/clipboard-event/platform/clipboard-event-handler-linux'));
    }
    else if (platform === 'darwin') {
      this.child = execFile(path.join(currentDirName, 'main/clipboard-event/platform/clipboard-event-handler-mac'));
    }
    else {
      throw 'Not yet supported';
    }

    this.child.stdout.on('data', (data) => {
      // TODO: See if this value is standard on all platforms.
      if (data.trim() === 'CLIPBOARD_CHANGE') {
        this.emit('change');
      }
    });

  }

  stopListening() {
    const res = this.child.kill();
    return res;
  }
}

export default new ClipboardEventListener();