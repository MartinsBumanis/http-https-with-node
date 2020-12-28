const axios = require('axios');
const fs = require('fs');

// GET request used:
axios({ //speicify to stream
    method: 'get',
    url: 'http://www.google.com',
    responseType: 'stream'
  })
  .then((response) => { //pipes to writable stream with fs module, makes file
    response.data.pipe(fs.createWriteStream('google.html'));
  })
  .catch((error) => {
    console.error(error);
  });

// POST request used:
axios({
    method: 'post',
    url: 'http://localhost:8080/users',
    data: { //this is the payload for the post
      userNames: ['dannyt100', 'freddyv100'] //or jus string 'dannyt'
    },
    transformRequest: (data, headers) => { //you can maniupalte data and headers
      const newData = data.userNames.map((userName) => {
        return userName + '!'; //adds character at end of each name
        // for a single const newData = {userName: data.userName + '!'}
      });
      return JSON.stringify(newData); //return string
    } // if using single then ,transformResponse: (data) => {} can be used to transform the data in a similar fashion
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });

  //functions for the all method
const getMetadata = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};

const getMetadataAgain = () => {
  return axios.get('http://localhost:8080/metadata?id=1');
};

// Making concurrent requests and returns a single promise of all of our data
axios.all([
  getMetadata(), getMetadataAgain()
]).then((responseArray) => {
  console.log(responseArray[0].data.description);
  console.log(responseArray[1].data.description);
});