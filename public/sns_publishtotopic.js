//////////////////////////////////////////INICIO -- SERVIDOR/////////////////////////////////////////////////////////////////
import express from "../node_modules/express/index.js";
const app = express();

app.use(express.static('public'));
app.use("/public", express.static('./public/'));

app.get("/", function(req, res) {
    res.render('index.html', {title: "Home Page"});
});

app.listen(3000, () => 
console.log("Servidor rodando local na porta 3000"));

///////////////////////////////////////////////FIM -- SERVIDOR///////////////////////////////////////////////////////////////

import AWS from "../node_modules/aws-sdk/index.js";
AWS.config.update({region: 'us-east-1'});

var params = {
  Message: `${id}`,  
  TopicArn: 'arn:aws:sns:us-east-1:384071997796:actualstation',
};

var id = 0;

function shuffle(array) {
  var i = array.length,
      j = 0,
      temp;
  while (i--) {
      j = Math.floor(Math.random() * (i+1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}

var ranNums = shuffle([1,2,3,4,5]);
console.log(ranNums)
for (var i = 0; i < 5; i++) {
  (function(i) {
      setTimeout(function() { 
        params.Message = ranNums[i].toString();
        
        var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise()  
        publishTextPromise.then(
        function() {
          params.Message = ranNums[i].toString();
          console.log(params.Message);           
          }).catch(
            function(err) {
              console.error(err, err.stack);
           });
         }, i*8000);
        
  })(i);
}