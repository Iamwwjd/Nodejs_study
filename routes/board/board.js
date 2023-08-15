exports.editGetMid = (req, res) => {
    const { _id } = req.session.user;
    const index = Number(req.query.index);
    const query = `SELECT board._id, board.subject, user.name AS username, board.content
                      FROM board
                      JOIN user
                      ON board.author = user._id
                      WHERE board._id = ${index}
                      `;
  
    db.query(query, (error, result) => {
      if (error) return console.log(error);
  
      if (result) {
        if (result[0]._id === _id) {
          res.render('board/edit.html', { posting: result[0] });
        } else {
          res.send(
            alertMove(
              `/board/view?index=${result[0]._id}`,
              '본인이 작성한 글만 수정할 수 있습니다.'
            )
          );
        }
      }
    });
  };
  
  exports.editPostMid = (req, res) => {
    let { _id } = req.body;
    _id = Number(_id);
    const { subject, content } = req.body;
  
    const query = `UPDATE board
                     SET subject="${subject}",
                         content="${content}"
                     WHERE _id=${_id}`;
  
    db.query(query, (error, result) => {
      if (error) return console.log(error);
  
      if (result) {
        res.send(alertMove(`/board/view?index=${_id}`, '글이 수정 되었습니다.'));
      }
    });
  };

  let { index } = req.query;
  index = Number(index);

  const query = `SELECT _id ,author FROM board WHERE _id = ${index}`;

  db.query(query, (error, result) => {
    if (error) return console.log(error);

    if (result) {
      const { _id } = req.session.user;
      if (result[0].author !== _id) {
        res.send(
          alertMove(
            `/board/view?index=${result[0]._id}`,
            '본인이 작성한 글만 삭제할 수 있습니다.'
          )
        );
      } else {
        const query = `DELETE FROM board WHERE _id = ${index}`;
        db.query(query, (error, result) => {
          if (error) return console.log(error);
          res.send(alertMove('/board/list', '글이 삭제 되었습니다.'));
        });
      }
    }
  });​