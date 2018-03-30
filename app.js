var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public_html'));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.post("/api", function(req, res) {
   res.setHeader('Content-Type', 'application/json');
   res.send(JSON.stringify({ state:"success", basketProducts: []}));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
