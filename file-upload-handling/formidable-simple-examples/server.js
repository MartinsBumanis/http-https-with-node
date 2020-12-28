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
            maxFileSize: 5 * 1024 * 1024
        });
        form.parse(request, (err, fields, files) => { //err if empty, fields is description, files uploaded
            if(err){ //error handling, must close connection
                console.log(err);
                response.statusCode = 500;
                response.end("Error!");
            }
            console.log('\n fields:');
            console.log(fields);
            console.log('\n files:');
            console.log(files); //get all the data for the file
            response.statusCode = 200;
            response.end("Success!");
        })
    } else {
        fs.createReadStream("../../index.html").pipe(response);
    }


});
server.listen(8080); // listens on this port