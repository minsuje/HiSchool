const {
  Club,
  Club_chat,
  Club_post,
  Club_post_comment,
  Club_post_comment_like,
  Club_schedule,
} = require("../models/Index");
const { trace } = require("../routes");

// Club
// GET /clubMain : 전체 동아리 조회
exports.getClubs = async (req, res) => {
  try {
    const Clubs = await Club.findAll();
    res.render("club", { data: Clubs });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// GET /clubDetail/:club_id : 동아리 하나 상세 조회
exports.getClub = async (req, res) => {
  try {
    const club = await Club.findOne({
      where: { club_id: req.params.club_id },
    });
    res.send(club);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// GET /clubAdminMain : 동아리 관리페이지 불러오기 - 동아리 상세 페이지와 경로를 다르게 쓴다면 필요

// PATCH /clubAdminEdit/:club_id : 동아리 수정
exports.patchClub = async (req, res) => {
  try {
    const { club_id } = req.params.club_id;
    const updateClub = await Club.update(
      {
        club_name,
        leader_id,
        limit,
        location,
        field,
        keyword,
      },
      {
        where: { club_id },
      }
    );
    res.send(updateClub);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// DELETE /clubAdminEdit/:club_id : 동아리 삭제
exports.deleteClub = async (req, res) => {
  try {
    const { club_id } = req.params.club_id;
    const isDeleted = await Club.destroy({
      where: { club_id },
    });
    if (isDeleted) {
      res.send({ isDeleted: true });
    } else {
      res.send({ isDeleted: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// POST /createClub : 동아리 생성
exports.createClub = async (req, res) => {
  try {
    const { club_name, leader_id, limit, location, field, keyword } = req.body;
    const newClub = await Club.create({
      club_name,
      leader_id,
      limit,
      location,
      field,
      keyword,
    });
    res.send(newClub);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

//Club_post
// GET /myclubPostMain/:club_id : 동아리 게시글 전체 조회
exports.getClubPosts = async (req, res) => {
  try {
    const posts = await Club_post.findAll({
      where: { club_id: req.params.club_id },
    });
    res.render("clubPosts", { data: posts });
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// GET /myclubPostDetail/:club_id/:post_id : 동아리 게시글 하나 조회
// 게시글 전달할 때, 게시글마다의 댓글과 좋아요 수 함께 전달
exports.getClubPost = async (req, res) => {
  try {
    // 게시글
    const clubPost = await Club_post.findOne({
      where: {
        club_id: req.params.club_id,
        post_id: req.params.post_id,
      },
    });
    // 게시글에 달린 댓글들
    const clubPostComment = await Club_post_comment.findAll({
      where: {
        club_id: req.params.club_id,
        post_id: req.params.post_id,
      },
    });
    // 댓글마다 있는 좋아요
    const clubPostCommentLike = await Club_post_comment_like.findAll({
      where: {
        club_id: req.params.club_id,
        post_id: req.params.post_id,
      },
    });
    res.send(clubPost, clubPostComment, clubPostCommentLike);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// PATCH /myclubPostDetail/:club_id/:post_id  : 동아리 게시글 수정
exports.patchPost = async (req, res) => {
  try {
    const { club_id, post_id } = req.params;
    const updatePost = await Club_post.update(
      {
        title,
        content,
        image,
      },
      {
        where: {
          club_id: club_id,
          post_id: post_id,
        },
      }
    );
    res.send(updatePost);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// DELETE /myclubPostDetail/:club_id/:post_id  : 동아리 게시글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { club_id, post_id } = req.params;
    const isDeleted = await Club_post.destroy({
      where: {
        club_id: club_id,
        post_id: post_id,
      },
    });
    if (isDeleted) {
      res.send({ isDeleted: true });
    } else {
      res.send({ isDeleted: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// POST  /myclubPostDetail/:club_id/:post_id : 동아리 게시글 댓글 생성
exports.createPostComment = async (req, res) => {
  try {
    const { club_id, post_id } = req.params;
    const { userid, comment_name, content } = req.body;
    const newClubPostComment = await Club_post_comment.create({
      club_id: club_id,
      post_id: post_id,
      userid: userid,
      comment_name: comment_name,
      content: content,
    });
    res.send(newClubPostComment);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// PATCH /myclubPostDetail/:club_id/:post_id/:comment_id : 동아리 게시글 댓글 수정
exports.patchPostComment = async (req, res) => {
  try {
    const { comment_id, post_id, club_id } = req.params;
    const { content } = req.body.content;
    const clubPostComment = await Club_post_comment.update(
      {
        content: content,
      },
      {
        where: { club_id: club_id, post_id: post_id, comment_id, comment_id },
      }
    );
    res.send(clubPostComment);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// DELETE  /myclubPostDetail/:club_id/:post_id/:comment_id : 동아리 게시글 댓글 삭제
exports.deletePostComment = async (req, res) => {
  try {
    const { comment_id, post_id, club_id } = req.params;
    const isDeleted = await Club_post_comment.destroy({
      where: { club_id: club_id, post_id: post_id, comment_id, comment_id },
    });
    if (isDeleted) {
      res.send({ isDeleted: true });
    } else {
      res.send({ isDeleted: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// 동아리 게시글 좋아요
// POST /myclubPostDetail/:club_id/:post_id/:comment_id
exports.postClubPostCommentLike = async (req, res) => {
  try {
    const { post_id, club_id, comment_id } = req.params;
    const clubPostCommentLike = await Club_post_comment_like.create({
      club_id: club_id,
      post_id: post_id,
      comment_id: comment_id,
      like_id: like_id,
    });
    res.send(clubPostCommentLike);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// DELETE /myclubPostDetail/:club_id/:post_id/:comment_id/:like_id
exports.deleteClubPostCommentLike = async (req, res) => {
  try {
    const { club_id, post_id, comment_id, like_id } = req.params;
    const isDeleted = await Club_post_comment_like.destroy({
      where: {
        club_id: club_id,
        post_id: post_id,
        comment_id: comment_id,
        like_id: like_id,
      },
    });
    if (isDeleted) {
      res.send({ isDeleted: true });
    } else {
      res.send({ isDeleted: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// POST /myclubNewPost/:club_id : 동아리 게시글 생성
exports.createClubPost = async (req, res) => {
  try {
    const { club_id, userid, title, content, image } = req.body;
    const newPost = await Club_post.create({
      club_id: club_id,
      userid: userid,
      title: title,
      content: content,
      image: image,
    });
    res.send(newPost);
  } catch (error) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// Club_schedule
// GET /myclubSchedule/:club_id : 동아리 일정 전체 조회
exports.getClubSchedules = async (req, res) => {
  try {
    const { club_id } = req.params.club_id;
    const clubSchedules = await Club_schedule.findAll({
      where: { club_id: club_id },
    });
    res.send(clubSchedules);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// GET /myclubSchedule/:club_id/:date : 특정 날짜 동아리 일정 조회
exports.getClubSchedule = async (req, res) => {
  try {
    const { club_id, date } = req.params;
    const clubSchedule = await Club_schedule.findAll({
      where: { club_id: club_id, date: date },
    });
    res.send(clubSchedule);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// POST /myclubSchedule/:club_id/:date : 특정 날짜에 동아리 일정 추가
exports.postClubSchedule = async (req, res) => {
  try {
    const { club_id, date } = req.params.date;
    const newClubSchedule = await Club_schedule.create({
      club_id: club_id,
      date: date,
      time: time,
      title: title,
      content: content,
    });
    res.send(newClubSchedule);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// PATCH /myclubSchedule/:club_id/:date/:schedule_id : 동아리 일정 수정
/*
exports.patchClubSchedule = async (req, res) => {
  try {
    const { club_id, date, schedule_id } = req.params;
    const { newDate, time, title, content } = req.body; // newDate -> 일정의 날짜도 변경이 가능할 경우 필요
    const clubSchedule = await Club_schedule.upadate(
      {
        date: newDate,
        time: time,
        title: title,
        content: content,
      },
      {
        where: {
          club_id: club_id,
          date: date,
          schedule_id: schedule_id,
        },
      }
    );
    res.send(clubSchedule);
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};
*/

// DELETE /myclubSchedule/:club_id/:date/:schedule_id : 동아리 일정 삭제
exports.deleteClubSchedule = async (req, res) => {
  try {
    const isDeleted = await Club_schedule.destroy({
      where: {
        club_id: club_id,
        date: date,
        schedule_id: schedule_id,
      },
    });
    if (isDeleted) {
      res.send({ isDeleted: true });
    } else {
      res.send({ isDeleted: false });
    }
  } catch (err) {
    console.error(err);
    res.send("Internal Server Error!");
  }
};

// Club_chat
// GET /clubChat : 동아리 채팅방 조회