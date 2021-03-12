const jwt = require("jsonwebtoken");
exports.AUTH_MIDDLEWARE = function  auth(req,res,next) {
    try {
  const token = req.header('Authorization');
  if (!token || !token.startsWith('Bearer')) return res.send('Not authorized');
  const decoded = jwt.decode(token.split(' ')[1]);
  if (!decoded) return res.send('Invalid Token')
  next();
    }
    catch (error) {
        console.log(error)
    }
}