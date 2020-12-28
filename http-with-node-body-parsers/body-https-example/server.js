const https = require('https');
const services = require('../../services');
const url = require('url');
const jsonBody = require("body/json");
const fs = require('fs');



const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./certificate.pem')
}
);
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
    //Simplified body parser
    jsonBody(request, response, (err, body) => { //uses the package
        //console.log(body);
        if (err) {
            console.log(err);
        } else {
            services.createUser(body['userName']); //creates like the last time
        }
    });
    response.end('This was received with https!')

});
server.listen(443); // listens on this port