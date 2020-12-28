The curl command used, when called from inside this directory:

curl --header Content-Type:application/json --request POST --data '{"userName": "armen"}' http://localhost:8080

curl --header Content-Type:application/json --request POST --data '{"userName": "armen"}>' http://localhost:8080

openssl req -newkey rsa:4096 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem