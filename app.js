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

const myArray = [];
io.on("connection", (socket) => {
  let updatedpostion = 210;
  let secondupdatedpostion = 210;
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
    
   
    

    var numClients = rooms.size;
    console.log(numClients + "yes");

    io.to(data.room).emit("clientcount", {
      clientcount: numClients,
    });

    if (numClients == 2) {
      const clients = Array.from(rooms);
    const client1Id = clients[0];
    const client2Id = clients[1];
    console.log(client1Id, client2Id+"we are the two clients");
      
      socket.on("movePaddle", (data) => {
        debugger;
       console.log(data.socketID+"i am the socket id")
     
        if (data.direction === 'left') {

          updatedpostion = data.value - 15;
       
        } else if (data.direction === 'right')  {
         
            updatedpostion = data.value + 15;
          
        } else if (data.direction === 'secondleft') {
          secondupdatedpostion = data.secondvalue - 15;
        } else if (data.direction === 'secondright') {
          secondupdatedpostion = data.secondvalue + 15;
        }
        // switch (data.direction) {
        //   case "left":
        //     if (data.socketID != client1Id) {
        //       updatedpostion = data.value - 15;
        //     }
        //     break;
        //   case "right":
        //     if (data.socketID != client1Id) {
        //       updatedpostion = data.value + 15;
        //     }
        //     break;
        //   case "secondleft":
        //     if (data.socketID == client2Id) {
        //       secondupdatedpostion = data.secondvalue - 15;
        //     }
        //     break;
        //   case "secondright":
        //     if (data.socketID == client2Id) {
        //       secondupdatedpostion = data.secondvalue + 15;
        //     }
        //     break;
        //   default:
        //     // handle invalid direction
        //     break;
        // }

        io.to(room).emit("message", {
          position: updatedpostion,
          secondpostion: secondupdatedpostion,
        });
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
        check_1 = data.check_1;
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
          check_1: check_1,
        });
      });
    }
  });
});
// isse copy kar de
