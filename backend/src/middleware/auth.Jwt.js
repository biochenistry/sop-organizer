import jwt from 'jsonwebtoken';
import ResultSet from 'mysql/lib/protocol/ResultSet.js';
import config from '../config/auth.config.js';
import db from '../models/db.js';
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  try {
    let privilege = connection.query(
      `SELECT privilege FROM users WHERE email = '${email}'`,
      function (err, result) {
        if (err) throw err;
        return result.privilege;
      }
    );

    if (privilege == 1) {
      return next();
    }

    return res.status(403).send({
      message: 'Require Admin Role!',
    });
  } catch (error) {
    return res.status(500).send({
      message: 'Unable to validate User role!',
    });
  }
};

const authJwt = {
  verifyToken,
  isAdmin,
};
export default authJwt;
