exports.viewGetMid = (req, res) => {
    const index = Number(req.query.index);
    const query = `SELECT board.subject, user.name AS username, board.content
                      FROM board
                      JOIN user
                      ON board.author = user._id
                      WHERE board._id = ${index}
                      `;
    db.query(query, (error, result) => {
      if (error) return console.log(error);
  
      if (result) {
        res.render('board/view.html', { posting: result[0] });
      }
    });
  };