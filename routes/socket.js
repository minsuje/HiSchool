const Ccontroller = require("../controller/CclubSocket");

exports.startClubSocket = (io) => {
  io.on("connection", (socket) => {
    Ccontroller.connection(io, socket);
  });
};
