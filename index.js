'use static';
import JsSandBox from './src/lib/JsSandBox/index';

const script1 = `
  window.asd = 'asd1';
  window.onloadend = () => {
    console.log(window.asd);
  }
`;

const script2 = `
  window.asd = 'asd2';
  window.onloadend = () => {
    console.log(window.asd);
  }
`;

const JsSandBox1 = new JsSandBox({
  script: script1
});
const JsSandBox2 = new JsSandBox({
  script: script2
});
JsSandBox1.run();



