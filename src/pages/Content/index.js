console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const { printLine } = require('./modules/print'); // CommonJS 방식으로 모듈 로드

printLine("Using the 'printLine' function from the Print Module");
