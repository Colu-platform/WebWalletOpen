var http = require('http'),
    express = require('express'),
    app = express(),
    path = require('path'),
    server;

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

app.get('/wallet', wallet);

function wallet(req, res) {
    res.sendFile(path.join(__dirname+'/public/wallet.html'));
}