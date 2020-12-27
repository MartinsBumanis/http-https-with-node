const http=require('http');

const server = http.createServer();
server.on('request',(request,response)=>{ //fires once for every request that comes in, req/res what comes in
    console.log('this is an incoming request');
});
server.listen(8080);