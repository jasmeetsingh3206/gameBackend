// app.js file
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello,World");
});
const server = app.listen(3001, () => {
  console.log("Server listening on port 3000");
});

const io = socketio(server);

const roomdata = {};
let numClients = 0;
let key = "";

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
          key = room;
          check = true;
          console.log(data.havecode + "ok i understood");
        }
      });
    }
    if (check == false) {
      myArray.push(room);
      key = room;

      roomdata[key] = {
        x_1: 0,
        y_1: 0,
        dx_1: 0,
        dy_1: 0,
        radius_1: 0,
        goals_1: 0,
        gameover: true,
        greyX_1: 210,
        check1_1: false,
        secondgreyX_1: 210,
        heighttemp_1: 500,
        widthtemp_1: 500,
        check_1: false,
      };
    }
    console.log(myArray);
    console.log(roomdata);
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

    if (numClients == 2) {
      for (let i = myArray.length - 1; i >= 0; i--) {
        if (myArray[i] === data.room) {
          myArray.splice(i, 1);
        }
      }
    }
    console.log(myArray);
    io.to(data.room).emit("clientcount", {
      clientcount: numClients,
    });

    const clients = Array.from(rooms);
    const client1Id = clients[0];
    const client2Id = clients[1];
    console.log(client1Id, client2Id + "we are the two clients");

    socket.on("life", (data) => {
      console.log(data.key);
      if (numClients == 2) {
        roomdata[data.key].x_1 = data.x_1;
        roomdata[data.key].y_1 = data.y_1;
        roomdata[data.key].dx_1 = data.dx_1;
        roomdata[data.key].dy_1 = data.dy_1;
        roomdata[data.key].radius_1 = data.radius_1;
        roomdata[data.key].goals_1 = data.goals_1;
        roomdata[data.key].gameover = data.gameover;
        roomdata[data.key].check1_1 = data.check1_1;
        roomdata[data.key].heighttemp_1 = data.heighttemp_1;
        roomdata[data.key].widthtemp_1 = data.widthtemp_1;
        roomdata[data.key].check_1 = data.check_1;
        setInterval(() => {
          if (roomdata[data.key].check1_1 == false) {
            if (
              (roomdata[data.key].y_1 == 440 || roomdata[data.key].y_1 == 64) &&
              ((roomdata[data.key].x_1 >= roomdata[key].greyX_1 - 11 &&
                roomdata[data.key].y_1 == 440) ||
                (roomdata[data.key].x_1 >= roomdata[key].secondgreyX_1 - 11 &&
                  roomdata[data.key].y_1 == 64)) &&
              ((roomdata[data.key].x_1 <= roomdata[key].greyX_1 + 91 &&
                roomdata[data.key].y_1 == 440) ||
                (roomdata[data.key].x_1 <= roomdata[key].secondgreyX_1 + 91 &&
                  roomdata[data.key].y_1 == 64))
            ) {
              if (roomdata[data.key].check_1 == true) {
                roomdata[data.key].x_1 =
                  roomdata[data.key].x_1 + roomdata[data.key].dx_1;

                roomdata[data.key].y_1 =
                  roomdata[data.key].y_1 - roomdata[data.key].dy_1;

                roomdata[data.key].check_1 = false;
              } else {
                roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
                roomdata[data.key].y_1 =
                  roomdata[data.key].y_1 - roomdata[data.key].dy_1;

                roomdata[data.key].x_1 =
                  roomdata[data.key].x_1 + roomdata[data.key].dx_1;
                roomdata[data.key].goals_1 = roomdata[data.key].goals_1 + 1;
              }
            } else {
              if (
                roomdata[data.key].x_1 + roomdata[data.key].radius_1 >=
                  roomdata[data.key].widthtemp_1 ||
                roomdata[data.key].x_1 - roomdata[data.key].radius_1 == 0
              ) {
                roomdata[data.key].dx_1 = -roomdata[data.key].dx_1;
              }
              if (
                roomdata[data.key].y_1 + roomdata[data.key].radius_1 == 100 &&
                roomdata[data.key].x_1 < 185 &&
                roomdata[data.key].y_1 > 315
              ) {
                roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
              }
              if (
                roomdata[data.key].y_1 + roomdata[data.key].radius_1 >=
                  roomdata[data.key].heighttemp_1 ||
                roomdata[data.key].y_1 + roomdata[data.key].radius_1 <= 0
              ) {
                if (
                  roomdata[data.key].x_1 >= 185 &&
                  roomdata[data.key].x_1 <= 315
                ) {
                  if (
                    roomdata[data.key].y_1 > 500 ||
                    roomdata[data.key].y_1 <= 0
                  ) {
                    return;
                  }
                } else {
                  roomdata[data.key].goals_1 = roomdata[data.key].goals_1 - 1;
                  roomdata[data.key].dy_1 = -roomdata[data.key].dy_1;
                }
              }
              roomdata[data.key].x_1 =
                roomdata[data.key].x_1 + roomdata[data.key].dx_1;
              roomdata[data.key].y_1 =
                roomdata[data.key].y_1 - roomdata[data.key].dy_1;
            }
          }

          io.to(room).emit("gameanimated", {
            x_cordinate_center: roomdata[data.key].x_1,
            y_cordinate_center: roomdata[data.key].y_1,
            xspeed: roomdata[data.key].dx_1,
            yspeed: roomdata[data.key].dy_1,
            radius_1: roomdata[data.key].radius_1,
            goals_1: roomdata[data.key].goals_1,
            gameover: roomdata[data.key].gameover,
            check_1: roomdata[data.key].check_1,
            check1_1: roomdata[data.key].check1_1,
          });
        }, 10);
      }
    });

    socket.on("movePaddle", (data) => {
      if (numClients == 2) {
        console.log(data.socketID + "i am the socket id");

        if (data.direction === "left" && client1Id == data.socketID) {
          roomdata[key].greyX_1 = data.value - 15;
        } else if (data.direction === "right" && client1Id == data.socketID) {
          roomdata[key].greyX_1 = data.value + 15;
        } else if (
          data.direction === "secondleft" &&
          client2Id == data.socketID
        ) {
          roomdata[key].secondgreyX_1 = data.secondvalue - 15;
        } else if (
          data.direction === "secondright" &&
          client2Id == data.socketID
        ) {
          roomdata[key].secondgreyX_1 = data.secondvalue + 15;
        }

        io.to(room).emit("message", {
          position: roomdata[key].greyX_1,
          secondpostion: roomdata[key].secondgreyX_1,
        });
      }
    });
  });
});
