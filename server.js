var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/Mangadb', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => {
    console.log('DB connect')
  })
  .catch((err) => {
    console.log(err)
  })


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '5mb'}));

var routes = require('./api/routes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('Server started on: ' + port);
//npm run start