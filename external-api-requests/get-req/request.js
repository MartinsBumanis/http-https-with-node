const http = require('http');

//for https just replace http with https
const request = http.get( 
  'http://www.google.com', // or callback {hostname: www.google.com} with http.request
  (response) => {
    console.log(`statusCode: ${response.statusCode}`); 
    console.log(response.headers);

    response.on('data', (chunk) => { //listen to stream responed through data event
      console.log('This is a chunk: \n');
      console.log(chunk.toString());
    });
  }
);

request.on('error', (err) => {
  console.error(err);
});

request.end();