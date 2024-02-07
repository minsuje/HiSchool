const { Club, Club_chat, User, Sequelize } = require("../models/Index");
const jwt = require("jsonwebtoken");

exports.connection = async (io, socket) => {
  console.log("접속 :", socket.id);

  //채팅방 목록 보내기
  //   socket.emit("roomList", roomList);
  const roomNum = await Club_chat.findAll({ attributes: ["club_id"] });
  let rooms = [];
  for (let i = 0; i < roomNum.length; i++) {
    rooms.push(roomNum[i].club_id);
  }

  //채팅방 만들기 생성
  socket.on("create", async (roomName, userName, cb) => {
    console.log("group socket create >", socket);
    //join(방이름) 해당 방이름으로 없다면 생성. 존재하면 입장
    //socket.rooms에 socket.id값과 방이름 확인가능
    socket.to(roomName).emit("notice", `${userName}님이 입장하셨습니다`);
    socket.join(roomName);
    //socket은 객체이며 원하는 값을 할당할 수 있음
    socket.room = roomName;
    socket.user = userName;

    cb();
  });

  //================ 위 까지 방만들기 =======================
  socket.on("sendMessage", async (message) => {
    const newClubChat = await Club_chat.create({
      userid_num: message.userid_num,
      from_name: message.nick,
      content: message.message,
      club_id: message.roomName,
    });

    io.to(socket.room).emit("newMessage", newClubChat, false);
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.leave(socket.room);
    }
  });
};
