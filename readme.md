Learning about HTTP with nodejs, responses, status codes, file upload handling and axios.

Learning from PluralSight with added comments.


When using a windows machine you have to make a self signed certificate for it to work. You can use openssl on windows with this command:

    openssl req -newkey rsa:4096 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem

   

Or a linux opennssl command:

    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -subj "/"