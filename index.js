// const io = require('socket.io')(8000)
const express = require('express');
const {socket}= require('socket.io');

const app = express();

const http = require('http').createServer(app);

const PORT =process.env.PORT||3000

http.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})
app.use(express.static(__dirname+ '/public'))

app.get('/',(req,res)=>{
    res.sendFile(__dirname+ '/public/index.html')
    // res.send("hello world");
})
const io = require('socket.io')(http)

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})