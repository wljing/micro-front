'use static';
import JsSandBox from './src/lib/JsSandBox/index';
import Communicator from './src/lib/Communicator/index';

const script1 = `
  window.asd = 'asd1';
  window.IPC.on('main:asd', (payload) => {
    console.log('ipc', payload)
  })
`;

const script2 = `
  window.asd = 'asd2';
  window.IPC.emit('main:*', { name: 'asd' });
`;

JsSandBox.defineGlobalProperty('IPC', new Communicator());

// window.IPC = new Communicator();

const JsSandBox1 = new JsSandBox({
  script: script1
});
const JsSandBox2 = new JsSandBox({
  script: script2
});
JsSandBox1.run();


