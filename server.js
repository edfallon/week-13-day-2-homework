const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017"
, function(err, client){

  if (err){
    console.log(err);
    return;
  }



  const db = client.db("artists");
  console.log("Connected to database!!");


  server.post("/api/bands", function(req, res, next){
    const bandsCollection = db.collection("bands"); // like saying db.bands
    const bandsToSave = req.body; // = json object
    bandsCollection.save(bandsToSave, function(err, result){
      if (err) next(err);

      res.status(201);
      res.json(result.ops[0])// returns the result of the first opperation that it did which was save.
      console.log("saved to database!!");
    })

  });

  server.get("/api/bands", function(req, res, next){ //getting back all the bands
    const bandsCollection = db.collection("bands");
    bandsCollection.find().toArray(function(err, allQuotes){
      if (err) next(err);

      res.json(allQuotes);
    })
  })

  server.delete("/api/bands", function(req, res, next){//listening for delete requests. when it hears it it does the function
    const bandsCollection = db.collection("bands");//get all the bands
    bandsCollection.remove({}, function(err, result){//remove all the bands and then do the function

      if (err) next(err);//if there is an error express will handle it
      res.status(200).send();//set the status of the response to ok(200) and send it nothing.
    });
  })

  server.post('/api/bands/:id', function(req, res, next){
    const bandsCollection = db.collection("bands");
    const objectID = ObjectID(req.params.id);
    bandsCollection.update({_id: objectID}, req.body, function(err, result){
      if (err) next(err);
      res.status(200).send();
    })
  })



  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

});
