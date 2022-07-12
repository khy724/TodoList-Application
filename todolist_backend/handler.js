'use strict';
const app = require('./index');
const serverless = require('serverless-http');
module.exports.hello = serverless(app);

if(require.main === module){
    console.log("this is a test");
    exports.hello();
}