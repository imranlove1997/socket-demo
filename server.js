var express = require('express');
var fs = require('fs');
var http = require('http');

var app = express();

var server = http.createServer(app);
var io = require('socket.io')(server);

var port = 4444;

io.on('connection', (socket) => {
    
    var fileData = fileContent();
    socket.emit('content', fileData);
    
    // console.log('USer is connected');

    // socket.on('disconnect', () => {
    //     console.log('User disconnected');
    // })
    socket.on('lines', (lines) => {
        var fileData = fileContent(lines);
        socket.emit('content', fileData);
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function fileContent(lines = 5) {
    var fileData = fs.readFileSync('./contents.txt', 'utf8');
    fileData = fileData.trim().split('\n');
    return fileData.length > lines ? fileData.slice(fileData.length - lines) : fileData;
}

fs.watchFile('./contents.txt', {interval: 1000}, (_stats) => {
    var fileData = fileContent();
    io.sockets.emit('content', fileData);
})

server.listen(port, () => {
    try {
        console.log('Server is listening on port: ' + port);
    } catch (error) {
        console.error('Server has error');
    }
})