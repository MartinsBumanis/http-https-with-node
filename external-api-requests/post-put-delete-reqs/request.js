const http = require('http');


const data = JSON.stringify({
  userName: 'forolo1'
});
//for authenticated use https over 443
const options = { //settings for the request, method can be changed to 'PUT' or 'DELETE'
  hostname: 'localhost',
  port: 8080,
  path: '/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': Buffer.from('myUsername' + ':' + 'myPassword').toString('base64'), //authenticated calls added and with https, js supports base64 as that is needed tosend
  }
  // data.length indicates that we are making a request with json payload
}

//for https just replace http with https
const request = http.request(
  options,
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

request.write(data); //sends the actual payload, writes json data into the request stream

request.end();