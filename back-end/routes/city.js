const express = require("express");
const router = express.Router();
const cityToPlaceCoordinates = require("../public/javascripts/cityToPlaceCoordinates");
const cityAutoComplete = require("../public/javascripts/cityAutoComplete");
const torontoSample = require("./sampleData/torontoSample.js");
const API_KEY = require("../apikey.js");
const fetch = require("node-fetch");
const cityChar = require("./sampleData/cityChar.js");
const util = require('util');

const useSampleData = false;

module.exports = (knex) => {

  // function capitolizeFirstLetter(inputString){
  //   let formattedString = inputString.charAt(0).toUpperCase() + inputString.substr(1);
  //   return formattedString;
  // }

  router.get('/autocorrect/:name', (req, res)=>{
    // console.log('city.js: API_KEY = ', API_KEY.API_KEY); // API KEY IS GOOD
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.name}&types=(cities)&key=${API_KEY.API_KEY}`
    fetch(url)
    .then(res => res.json())
    .then(json => {
      // console.log(json);
      if (json.status === 'REQUEST_DENIED'){
        console.log('Google Autocorrect API request DENIED (API KEY INVALID??)');
        res.status(503).send('Google API request Denied');      
      }
      else if (json.predictions.length === 0){
        console.log('No cities found');
        res.status(204).send(); // 204 = NO CONTENT
      }
      else {
        let correctedCityName = json.predictions[0].description.split(',')[0];
        res.status(200);
        res.send(correctedCityName);
      }
    })
    .catch((error)=>{
      console.error(error);
      res.status(500);
      res.send('Google Maps Autocorrect request failed');
    })
  })



  router.get("/:city", async (req, res) => {
    // console.log(req.params.city);
    //If it should call the API's, just so it is possible to turn it off to avoid excess calls
    if (useSampleData){
      console.log('Sending Sample Toronto Data...');
      let response = torontoSample;
      response.cityChar = cityChar[req.params.city];
      res.send(response);
    } 
    else {
      // Search for city in database
      knex.select('*').from('city_data_cache')
      .where('city_name', '=', req.params.city)
      .then((async DBsearchResponse =>{
        if (DBsearchResponse.length > 0){
          // City is IN DB:
          let data_timestamp = DBsearchResponse[0].time_stamp;
          console.log(`Found ${req.params.city} in DB! Sending data from DB...`);
          console.log(`Data for ${req.params.city} is ${(Date.now() - data_timestamp)/1000/60} minutes old`);
          res.send(DBsearchResponse[0].data);          
        }
        else{
          // City is NOT IN DB:
          console.log(`${req.params.city} not in DB, collecting data from APIs ...`);
          let cityDetails = await cityAutoComplete(req.params.city);
          let pointsOfInterest = await cityToPlaceCoordinates(cityDetails.result);
          let response = {
            city_name: {
              formatted: cityDetails.result.formatted_address,
              long_name: cityDetails.result.address_components[0].long_name
            },
            city_coordinates: cityDetails.result.geometry.location,
            points_of_interest: pointsOfInterest
          };
          response.cityChar = cityChar[req.params.city];

          // Store City in DB
          knex('city_data_cache')
          .insert({
            city_name: req.params.city,
            time_stamp: String(Date.now()),
            data: response
          })
          .then((knexResponse)=>{
            console.log(`successfully saved: ${req.params.city} to DB`);
            res.send(response);
          })
          .catch((error)=>{
            console.log(`Failed to save ${req.params.city} to DB: ${error}`);
            console.log('Sending collected data anyway...');
            res.send(response);
          });



        }
      }))
      .catch((error)=>{
        console.log('Error while trying to search for city in city_data_cache table in DB:', error);
      });      








    }






    


  });

  return router;
}


//   RESPONSE = 

 // { city_name:
 //   { formatted: 'Sydney NSW 2000, Australia', long_name: 'Sydney' },
 //  city_coordinates: { lat: -33.8688197, lng: 151.2092955 },
 //  points_of_interest:
 //   { top_poi:
 //      [ [Object],
 //        [Object],
 //        [Object],
 //        [Object] ],
 //     museum_poi:
 //      [ [Object],
 //        [Object],
 //        [Object],
 //        [Object],
 //        [Object],
 //        [Object],
 //        [Object] ],
 //     food_poi:
 //      [ [Object],
 //        [Object],
 //        [Object],
 //        [Object] ] },
 //  cityChar: undefined }
