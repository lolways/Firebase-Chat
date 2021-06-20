const express = require('express')
const app = express()


//generador de la plantilla(ejs)
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//rutas
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)


//instanciación de socket.io
const io = require("socket.io")(server)


//escuchar las conexiones  
io.on('connection', (socket) => {
	console.log('New user connected')

	//nombre de usuario default
	socket.username = "Anonymous"

    //cambio de nombre
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //nuevo mensaje
    socket.on('new_message', (data) => {
        //enviar nuevo mensaje
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    //escritura 
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    })
})
