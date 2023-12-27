const { Club, Club_chat, User, Sequelize } = require("../models/Index");
const jwt = require("jsonwebtoken");

let roomList = [];

// exports.getDmRoom = async (req, res) => {
//   try {
//     const { userid, userid_num } = jwt.verify(
//       req.cookies.jwt,
//       process.env.JWT_SECRET
//     );

//     const name = await User.findOne({
//       attributes: ["name"],
//       where: {
//         userid_num: userid_num,
//       },
//     });
//     res.send(roomName, myNickname);
//   } catch (err) {
//     console.error(err);
//     res.send("Internal Server Error!");
//   }
// };

exports.connection = async (io, socket) => {
  console.log("접속 :", socket.id);

  //채팅방 목록 보내기
  //   socket.emit("roomList", roomList);
  const roomNum = await Club_chat.findAll({ attributes: ["club_id"] });
  console.log(`roomNum ${roomNum.length}`);
  /*
  let userInfo = [];
    for (const element of getUserInfo) {
      // console.log(element);
      let info = await User.findOne({ where: { userid_num: element } });
      userInfo.push(info.name);
      console.log("클럽 멤버 이름조회 >>>>>>>>>>>>>", userInfo);
      console.log("getUserInfo까지 실행 완료");
    }
  */

  //채팅방 만들기 생성
  socket.on("create", async (roomName, userName, cb) => {
    //join(방이름) 해당 방이름으로 없다면 생성. 존재하면 입장
    //socket.rooms에 socket.id값과 방이름 확인가능
    socket.join(roomName);
    //socket은 객체이며 원하는 값을 할당할 수 있음
    socket.room = roomName;
    socket.user = userName;

    console.log("CclubSocket create", roomName, userName);
    // const roomNum = await Club_chat.findAll({ attributes: ["club_id"] });
    // console.log(`roomNum ${roomNum.dataValues.club_id}`);
    // const roomNum = await Club_chat.findAll({});
    // console.log(`roomNum ${roomNum}`);
    roomList = [...new Set(roomNum)];
    console.log(`roomName: ${roomName}, roomList: ${roomList}`);
    // 동아리 채팅 정보가 있다면 이전 채팅정보 불러와주기
    // if (roomList.includes(roomName)) {
    //   const chats = await Club_chat.findAll({
    //     where: { clubChat: roomName },
    //   });
    // }
    // console.log("socket on chat >>>>", chats);
    socket.to(roomName).emit("notice", `${userName}님이 입장하셨습니다`);

    //채팅방 목록 갱신
    // if (!roomList.includes(roomName)) {
    //   roomList.push(roomName);
    //   //갱신된 목록은 전체가 봐야함 <=== 나와 상대방만 봐야해서 이제 바꿔야함
    //   io.emit("roomList", roomList);
    // }
    // const usersInRoom = getUsersInRoom(roomName);
    // io.to(roomName).emit("userList", usersInRoom);
    cb();
  });
  //================ 위 까지 방만들기 =======================
  socket.on("sendMessage", (message) => {
    console.log("CclubSocket sendMessage > ", message);

    io.to(socket.room).emit("newMessage", message.message, message.nick, false);
    const newClubChat = Club_chat.create({
      userid_num: message.userid_num,
      from_name: message.nick,
      content: message.message,
      club_id: message.roomName,
    });
  });

  socket.on("disconnect", () => {
    if (socket.room) {
      socket.leave(socket.room);
    }
  });

  // function getUsersInRoom(room) { <== 귓속말 기능은 필요 없기 때문에 제거
  //     const users = [];
  //     //채팅룸에 접속한 socket.id값을 찾아야함
  //     const clients = io.sockets.adapter.rooms.get(room);
  //     //console.log(clients);
  //     if (clients) {
  //         clients.forEach((socketId) => {
  //             //io.sockets.sockets: socket.id가 할당한 변수들의 객체값
  //             const userSocket = io.sockets.sockets.get(socketId);
  //             //개별 사용자에게 메세지를 보내기 위해서 객체형태로 변경
  //             //key: 소켓아이디, name:이름
  //             const info = { name: userSocket.user, key: socketId };
  //             users.push(info);
  //         });
  //     }
  //     return users;
  // }
};