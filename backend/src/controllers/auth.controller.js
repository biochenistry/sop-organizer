import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connection from '../models/db.js';
import authConfig from '../config/auth.config.js';
import validateEmail from 'email-validator';

const signin = (req, res) => {
  connection.query(
    `SELECT * FROM users WHERE email = ${connection.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'Email or password is incorrect!',
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.status(401).send({
              msg: 'Email or password is incorrect!',
            });
          }
          if (bResult) {
            const token = jwt.sign({ id: result[0].id }, authConfig.secret, {
              expiresIn: '1h',
            });
            return res.status(200).send({
              msg: 'Logged in.',
              token,
              user: {
                name: result[0].name,
                email: result[0].email,
                privilege: result[0].privilege,
              },
            });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!',
          });
        }
      );
    }
  );
};
const signout = (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: 'You\'ve been signed out!',
    });
  } catch (err) {
    this.next(err);
  }
};

const changePermission = (req, res) => {
  try {
    connection.query(
      `SELECT email FROM users WHERE email = '${email}'`,
      function (err, result) {
        if (err) throw err;
        if (result.length < 1) {
          return res.status(409).send('User does not exist with that email.');
        } else {
          connection.query(
            `UPDATE users
        SET privilege = ${req.body.newprivilege}
        WHERE email = ${req.body.email};`,
            function (err, result) {
              if (err) throw err;
              return res.send('user privilege updated.');
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const register = (req, res) => {
  let pwd = bcrypt.hashSync(req.body.password, 8);
  const email = req.body.email;
  if (!validateEmail.validate(email)) {
    return res.status(409).send('Not a valid email.');
  }
  try {
    connection.query(
      `SELECT email FROM users WHERE email = '${email}'`,
      function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
          return res.status(409).send('User already registered.');
        } else {
          connection.query(
            `INSERT INTO users (id, name, email, password, privilege)
           VALUES (0, '${req.body.name}', '${email}', '${pwd}', 0)`,
            function (err, result) {
              if (err) throw err;
              return res.send('record inserted.');
            }
          );
        }
      }
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
export default { signin, signout, register };
