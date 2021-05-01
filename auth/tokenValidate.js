const jsonWebToken = require("jsonwebtoken");
const appError = require("../exception/appError");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jsonWebToken.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            throw new appError('invalid token', 400);
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
        throw new appError('access denied! unauthorized user', 400);
    }
  }
};