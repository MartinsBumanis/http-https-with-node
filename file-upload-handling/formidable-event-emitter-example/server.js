const http = require('http');
const services = require('../../services');
const url = require('url');
const jsonBody = require('body/json');
const formidable = require('formidable');
const fs = require('fs')


const server = http.createServer();

server.on('request', (request, response) => { //fires once for every request that comes in, req/res what comes in
    //standard error handling for response and request, also prevents a crash
    request.on('error', (err) => {
        console.erorr('request error')
    });
    response.on('error', (err) => {
        console.error('response.error')
    });


    const parsedUrl = url.parse(request.url, true);
    if (request.method === 'GET' && parsedUrl.pathname === '/metadata') { //gets the pathname from the request regardless of id
        const {
            id
        } = parsedUrl.query; //gets the id, btw, doesnt work properly with curl from powershell, use linux terminal
        // console.log(id);
        const metadata = services.fetchImageMetadata(id); //takes image id and gives js object
        response.setHeader('Content-Type', 'application/json'); //it will receive this type of data
        response.statusCode = 200; //status code for response
        const serializedJSON = JSON.stringify(metadata); //response is in native js object, so we must serialize to string
        response.write(serializedJSON); //write the data to the response stream
        response.end(); //end the stream

    } else if (request.method === 'POST' && parsedUrl.pathname === '/users') {
        //Simplified body parser
        jsonBody(request, response, (err, body) => { //uses the package
            //console.log(body);
            if (err) {
                console.log(err);
            } else {
                services.createUser(body['userName']); //creates like the last time
            }
        });
    } else if (request.method === 'POST' && parsedUrl.pathname === '/upload') {
        //you can configure formidable, for example to set the upload dir the same as node dir, max size in bytes 
        const form = new formidable.IncomingForm({
            uploadDir: __dirname,
            keepExtensions: true,
            multiples: true,
            maxFileSize: 5 * 1024 * 1024,
            enooding: 'utf-8',
            maxFeilds: 20
        });
        form.parse(request) // we can do this in async way, specify events what to listen to and what to do when it occurs
            .on('fileBegin', (name, file) => { // we can detect when the file is added to upload stream, you can change dir where it is stored for example
                console.log('Our upload has started!');
            })
            .on('file', (name, file) => {//once done it is available in the file event
                console.log('Field + file pair has been received');
            })
            .on('field', (name, value) => { //emitted each time a field value is received
                console.log('Field received:');
                console.log(name, value);
            })
            .on('progress', (bytesReceived, bytesExpected) => { //progress bar is called after some chunk of data is received
                console.log(bytesReceived + ' / ' + bytesExpected);
            })
            .on('error', (err) => { // when error, formidable pauses automatically, must use resume then
                console.error(err);
                request.resume();
            })
            .on('aborted', () => { //timeout can be called when aborted
                console.error('Request aborted by the user!');
            })
            .on('end', () => { //when request is fully received its a good place to send response and headers
                console.log('Done - request fully received!');
                response.end('Success!');
            });
    } else {
        fs.createReadStream("../../index.html").pipe(response);
    }


});
server.listen(8080); // listens on this port