const mysql = require("mysql2");
const express = require("express");

// Initial Variables
const app = express();
app.use(express.json());

// Add CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const databaseConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "oriya1234",
  port: 3306,
  database: "FullStackProject6",
});

//const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("");
});

// Connect to the Database and running up the server
databaseConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected To The Database.");

  //GET
  app.get("/api/users", (req, res) => {
    databaseConnection.query(
      "SELECT * FROM users;",
      function (err, result, fields) {
        res.send(result);
      }
    );
  });

  app.get("/api/users/:username/password", (req, res) => {
    let name = req.params.username;
    let sql = "SELECT * FROM passwords WHERE username = ?";
    databaseConnection.query(sql, [name], function (err, result, fields) {
      res.send(result);
    });
  });

  app.get("/api/users/:id", (req, res) => {
    let userId = parseInt(req.params.id);
    let sql = "SELECT * FROM users WHERE id = ?";
    databaseConnection.query(sql, [userId], function (err, result, fields) {
      res.send(result);
    });
  });

  app.get("/api/users/:username/name", (req, res) => {
    let name = req.params.username;
    let sql = "SELECT * FROM users WHERE username = ?";
    databaseConnection.query(sql, [name], function (err, result, fields) {
      res.send(result);
    });
  });

  app.get("/api/users/:id/todos", (req, res) => {
    let userId = parseInt(req.params.id);
    let completed;

    // Check if the 'completed' query parameter exists and has a valid value
    if (
      req.query.completed &&
      (req.query.completed === "0" || req.query.completed === "1")
    ) {
      completed = parseInt(req.query.completed);
    }
    let sql = "SELECT * FROM todos WHERE userId = ?";
    let params = [userId];

    // Append the 'completed' condition to the SQL query if the parameter is provided
    if (completed !== undefined) {
      sql += " AND completed = ?";
      params.push(completed);
    }
    //let sql = "SELECT * FROM todos WHERE userId = ? AND completed = ?";
    databaseConnection.query(sql, params, function (err, result, fields) {
      res.send(result);
    });
  });

  app.get("/api/users/:id/posts", (req, res) => {
    let userId = parseInt(req.params.id);
    let sql = "SELECT * FROM posts WHERE userId = ?";
    databaseConnection.query(sql, [userId], function (err, result, fields) {
      res.send(result);
    });
  });

  app.get("/api/posts/:id/comments", (req, res) => {
    let postId = parseInt(req.params.id);
    let sql = "SELECT * FROM comments WHERE postId = ?";
    databaseConnection.query(sql, [postId], function (err, result, fields) {
      res.send(result);
    });
  });

  //POST:
  app.post("/api/users/:username/password", (req, res) => {
    const password = {
      username: req.params.username,
      password: req.body.password,
    };

    const sql = "INSERT INTO passwords (username, password) VALUES (?, ?)";
    databaseConnection.query(
      sql,
      [password.username, password.password],
      function (err, result) {
        if (err) throw err;
        res.send(password);
      }
    );
  });

  app.post("/api/users", (req, res) => {
    const user = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      website: req.body.website,
      rank: req.body.rank,
      api_key: req.body.api_key,
    };
    const sql = `INSERT INTO users (name, username, email, phone, website, \`rank\`, api_key) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    databaseConnection.query(
      sql,
      [
        user.name,
        user.username,
        user.email,
        user.phone,
        user.website,
        user.rank,
        user.api_key,
      ],
      function (err, result) {
        if (err) throw err;
        res.send(user);
      }
    );
  });

  app.post("/api/users/:id/todos", (req, res) => {
    const todo = {
      userId: req.params.id,
      title: req.body.title,
      completed: req.body.completed,
    };

    const sql = "INSERT INTO todos (userId, title, completed) VALUES (?, ?, ?)";
    databaseConnection.query(
      sql,
      [todo.userId, todo.title, todo.completed],
      function (err, result) {
        if (err) throw err;
        res.send(todo);
      }
    );
  });

  app.post("/api/users/:id/posts", (req, res) => {
    const post = {
      userId: req.params.id,
      title: req.body.title,
      body: req.body.body,
    };

    const sql = "INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)";
    databaseConnection.query(
      sql,
      [post.userId, post.title, post.body],
      function (err, result) {
        if (err) throw err;
        res.send(post);
      }
    );
  });

  app.post("/api/posts/:id/comments", (req, res) => {
    const comment = {
      postId: req.params.id,
      name: req.body.name,
      email: req.body.email,
      body: req.body.body,
    };

    const sql =
      "INSERT INTO comments (postId, name, email, body) VALUES (?, ?, ?, ?)";
    databaseConnection.query(
      sql,
      [comment.postId, comment.name, comment.email, comment.body],
      function (err, result) {
        if (err) throw err;
        res.send(comment);
      }
    );
  });

  //PUT

  app.put("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    let sql = `UPDATE todos SET`;
    const values = [];

    if (completed !== undefined) {
      sql += ` completed = ?,`;
      values.push(completed);
    }

    if (title !== undefined) {
      sql += ` title = ?,`;
      values.push(title);
    }

    // Remove the trailing comma from the SQL statement
    sql = sql.slice(0, -1);

    sql += ` WHERE id = ?`;
    values.push(id);

    databaseConnection.query(sql, values, (error, results, fields) => {
      if (error) throw error;

      // Fetch the updated todo from the database
      const selectSql = `SELECT * FROM todos WHERE id = ?`;
      databaseConnection.query(
        selectSql,
        [id],
        (selectError, selectResults) => {
          if (selectError) throw selectError;

          // Send the updated todo as a response
          res.send(selectResults[0]);
        }
      );
    });
  });

  app.put("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, body } = req.body;

    let sql = `UPDATE posts SET`;
    const values = [];

    if (body !== undefined) {
      sql += ` body = ?,`;
      values.push(body);
    }

    if (title !== undefined) {
      sql += ` title = ?,`;
      values.push(title);
    }

    // Remove the trailing comma from the SQL statement
    sql = sql.slice(0, -1);

    sql += ` WHERE id = ?`;
    values.push(id);

    databaseConnection.query(sql, values, (error, results, fields) => {
      if (error) throw error;

      // Fetch the updated todo from the database
      const selectSql = `SELECT * FROM posts WHERE id = ?`;
      databaseConnection.query(
        selectSql,
        [id],
        (selectError, selectResults) => {
          if (selectError) throw selectError;

          // Send the updated todo as a response
          res.send(selectResults[0]);
        }
      );
    });
  });

  app.put("/api/comments/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, body } = req.body;

    let sql = `UPDATE comments SET`;
    const values = [];

    if (body !== undefined) {
      sql += ` body = ?,`;
      values.push(body);
    }

    if (name !== undefined) {
      sql += ` name = ?,`;
      values.push(name);
    }

    if (email !== undefined) {
      sql += ` email = ?,`;
      values.push(email);
    }

    // Remove the trailing comma from the SQL statement
    sql = sql.slice(0, -1);

    sql += ` WHERE id = ?`;
    values.push(id);

    databaseConnection.query(sql, values, (error, results, fields) => {
      if (error) throw error;

      // Fetch the updated todo from the database
      const selectSql = `SELECT * FROM comments WHERE id = ?`;
      databaseConnection.query(
        selectSql,
        [id],
        (selectError, selectResults) => {
          if (selectError) throw selectError;

          // Send the updated todo as a response
          res.send(selectResults[0]);
        }
      );
    });
  });

  //DELETE
  app.delete("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let deletedTodos;
    const selectSql = `SELECT * FROM todos WHERE id = ?`;
    databaseConnection.query(selectSql, [id], (selectError, selectResults) => {
      if (selectError) throw selectError;
      deletedTodos = selectResults[0];
    });
    let sql = "DELETE FROM todos WHERE id = ?";
    databaseConnection.query(sql, [id], function (err, result, fields) {
      res.send(deletedTodos);
    });
  });

  app.delete("/api/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    let deletesql = "DELETE FROM comments WHERE postId = ?";
    databaseConnection.query(deletesql, [id], function (err, result, fields) {
      if (err) throw err;
    });

    let deletedPost;
    const selectSql = `SELECT * FROM posts WHERE id = ?`;
    databaseConnection.query(selectSql, [id], (selectError, selectResults) => {
      if (selectError) throw selectError;
      deletedPost = selectResults[0];
    });
    let sql = "DELETE FROM posts WHERE id = ?";
    databaseConnection.query(sql, [id], function (err, result, fields) {
      res.send(deletedPost);
    });
  });

  app.delete("/api/posts/:id/comments/:commentId", (req, res) => {
    const id = parseInt(req.params.commentId);
    let deletedComment;
    const selectSql = `SELECT * FROM comments WHERE id = ?`;
    databaseConnection.query(selectSql, [id], (selectError, selectResults) => {
      if (selectError) throw selectError;
      deletedComment = selectResults[0];
    });
    let sql = "DELETE FROM comments WHERE id = ?";
    databaseConnection.query(sql, [id], function (err, result, fields) {
      res.send(deletedComment);
    });
  });

  app.listen(port, () => {
    console.log(`Server running at localhost:3000/`);
  });
});
