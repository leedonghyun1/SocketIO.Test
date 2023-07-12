import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set('view engine', 'pug');
app.set("views", __dirname+"/views");
app.use("/public", express.static(__dirname+"/public"));
app.get("/", (_,res)=> res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000✅`);

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const sockets=[];

wss.on("connection", (socket)=>{
  sockets.push(socket);
  socket["nickname"] = "ananymous";
  //connection & disconnection
  console.log("connected to browser")
  socket.on("close", ()=> console.log("Disconnected from the browser"));

  //receive message from server
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${message.payload}`));
      case "nickname":
        socket["nickname"] = message.payload
    }
  });
})


server.listen(3000, handleListen);

