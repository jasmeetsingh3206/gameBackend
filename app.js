// app.js file
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello,World");
});
const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const io = socketio(server);

let x_1 = 0;
let y_1 = 0;

let dx_1 = 0;
let dy_1 = 0;
let numClients=0;
let updatedpostion = 210;
let secondupdatedpostion = 210;
const myArray = [];
io.on("connection", (socket) => {
 
  let check = false;
  console.log("A user connected");
  console.log(io.engine.clientsCount);

  socket.on("join", (data) => {
    let room = Math.random().toString(36).substr(2, 6);
    let socketid = socket.id;

    if (data.havecode != "") {
      myArray.forEach((element) => {
        if (data.havecode === element) {
          room = data.havecode;
          check = true;
          console.log(data.havecode + "ok i understood");
        }
      });
    }
    if (check == false) {
      myArray.push(room);
    }
    console.log(myArray);

    data.room = room;

    socket.emit("info", {
      socketid: socketid,
    });

    socket.emit("room-created", {
      roomId: data.room,
    });

    socket.join(data.room);

    const rooms = io.sockets.adapter.rooms.get(data.room);

    numClients = rooms.size;
    console.log(numClients + "yes");
    if(numClients==2){
      for (let i = myArray.length - 1; i >= 0; i--) {
        if (myArray[i] === data.room) {
          // Remove the room at index i
          myArray.splice(i, 1);
        }
      }
    }
console.log(myArray)
    io.to(data.room).emit("clientcount", {
      clientcount: numClients,
    });
 

    const clients = Array.from(rooms);
    const client1Id = clients[0];
    const client2Id = clients[1];
    console.log(client1Id, client2Id + "we are the two clients");

    socket.on("movePaddle", (data) => {
      if (numClients == 2) {
        
        console.log(data.socketID + "i am the socket id");

        if (data.direction === "left" && client1Id==data.socketID) {
          if(client1Id==data.socketID){}
          updatedpostion = data.value - 15;
        } else if (data.direction === "right" && client1Id==data.socketID) {
          updatedpostion = data.value + 15;
        } else if (data.direction === "secondleft" && client2Id==data.socketID) {
          secondupdatedpostion = data.secondvalue - 15;
        } else if (data.direction === "secondright"&& client2Id==data.socketID) {
          secondupdatedpostion = data.secondvalue + 15;
        }
        io.to(room).emit("message", {
          position: updatedpostion,
          secondpostion: secondupdatedpostion,
        });
      }
    });

    socket.on("game_data", (data) => {
      x_1 = data.x_1;
      y_1 = data.y_1;
      dx_1 = data.dx_1;
      dy_1 = data.dy_1;
      radius_1 = data.radius_1;
      goals_1 = data.goals_1;
      gameover = data.gameover;
      greyX_1 = data.greyX_1;
      check1_1 = data.check1_1;
      // check_1 = data.check_1;
      secondgreyX_1 = data.secondgreyX_1;

      io.to(room).emit("gameanimated", {
        x_cordinate_center: x_1,
        y_cordinate_center: y_1,
        xspeed: dx_1,
        yspeed: dy_1,
        radius_1: radius_1,
        goals_1: goals_1,
        gameover: gameover,
        greyX_1: greyX_1,
        check1_1: check1_1,
       
      });
    });

    // }
  });
});
