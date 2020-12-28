const http = require('http');
const services = require('../../services');
const url = require('url');
const jsonBody = require("body/json");



const server = http.createServer();
server.on('request', (request, response) => { //fires once for every request that comes in, req/res what comes in
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
    } else {
        //  response.statusCode = 404; //node decides by itself when to pass this
        //  response.setHeader('X-powered-by', 'Node'); //this sets a singular header only
        //  response.setHeader("Content-Type", "text/plain");
        /// response.end();

        // or

        response.writeHead(404, { //manually write the response and with multiple headers, code content etc
            'X-powered-By': 'Node',
            'Content-Type': 'application/json'
        })

        response.end();
    }


});
server.listen(8080); // listens on this port