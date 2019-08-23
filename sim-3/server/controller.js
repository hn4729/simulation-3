const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get("db");

    const result = await db.existing_user([username]);
    const existingUser = result[0];

    if (existingUser) {
      res.status(409).send("Username taken.");
    } else {
      const hash = await bcrypt.hash(password, 10);
      const registeredUser = await db.register_user([username, hash]);
      const user = registeredUser[0];
      req.session.user = {
        id: user.user_id,
        username: user.username
      };
      res.status(200).send(req.session.user);
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.get("db");

    const foundUser = await db.get_user([username]);
    const user = foundUser[0];

    if (!user) {
      res.status(401).send("Incorrect username or password");
    }

    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (!isAuthenticated) {
      res.status(403).send("Incorrect password");
    }

    req.session.user = {
      id: user.user_id,
      username: user.username
    };

    res.status(200).send(req.session.user);
  },

  logout: (req, res) => {
    req.session.destroy();
  },

  createPost: (req, res) => {
    const { post_text } = req.body;
    const { id } = req.session.user;
    const db = req.app.get("db");

    db.create_post([+id, post_text]);
    res.sendStatus(200);
  },

  getUserPosts: async (req, res) => {
    console.log(req.query);
    const { muddaAssHoe } = req.query;
    const db = req.app.get("db");
    const result = await db.get_user_posts([muddaAssHoe]);
    res.status(200).send(result);
  }
};
