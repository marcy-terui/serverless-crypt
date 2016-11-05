'use strict';

const slscrypt = require('slscrypt');

module.exports.hello = (event, context, callback) => {
  slscrypt.get('test').then((txt) => {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: txt,
        input: event,
      }),
    };

    callback(null, response);
  });

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
