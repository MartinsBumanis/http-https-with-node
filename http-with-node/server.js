const http = require('http');
const services = require('../services');
const url = require('url');


const server = http.createServer();
server.on('request', (request, response) => { //fires once for every request that comes in, req/res what comes in
    const parsedUrl = url.parse(request.url, true);
    if (request.method === 'GET' && parsedUrl.pathname === '/metadata') { //gets the pathname from the request regardless of id
        const {
            id
        } = parsedUrl.query; //gets the id, btw, doesnt work properly with curl from powershell, use linux terminal
        // console.log(id);
        const metadata = services.fetchImageMetadata(id);
        //console.log(metadata);
        console.log(request.headers);
    };
    const body = []; //stores each buffer
    request.on('data', (chunk) => { //data comes in different chunks it must be pieced together
        body.push(chunk); //pushes each buffer into array
        // console.log(chunk.toString());
    }).on('end', () => { //on end event chains together
        const parsedJSON = JSON.parse(Buffer.concat(body)); //concats into one json
        const userName = parsedJSON[0]['userName']; //makes into js object
        console.log(userName);
        services.createUser(userName);
    });

});
server.listen(8080); // listens on this port