var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.send('Hello World');
})

app.post('/transfer', function (req, res) {
   res.send('POST MODE');
})

/*
json output response
{id:transaction_id, from:{id:account, balance:current_balance},to:{id:account,balance:current_balance}, transfered:transfer_amount}
*/

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
