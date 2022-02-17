//Appel modules

const app = require("express")();
// creer app express 
const server = require("http").createServer(app);
const console = require("console");
const cors = require("cors");


const io = require("socket.io")(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});


app.use(cors()); 

const PORT = process.env.PORT  || 5000;
/*fonction de rappel sera invoquée à chaque fois ou y aura une requete http
avec un chemin / (la racine du site) 
Prend une requete et response comme arguments et appel send */
app.get("/", (req, res) => {
  res.send('server is runnig...')
});
//appeler io.on sockeet pour la transmission des données
io.on('connection', (socket) => {
  socket.emit('me', socket.id);


  socket.on('disconnect', () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser",  ({userToCall, signalData, from, name}, ) =>{
    io.to(userToCall).emit("callUser", {signal: signalData, from, name});

  });

  socket.on('answerCall', (data) =>{
    io.to(data.to).emit("callAccepted", data.signal);
  })
})

//mettre le serveur en écote
server.listen(PORT, () => console.log('server listening on port ${PORT}'))



