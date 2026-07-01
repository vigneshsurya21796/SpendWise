const Apiresponse = require("../utils/Apiresponse");
const sendtoken = (User, statusCode, res) => {
  // Token
  const token = User.getJwtToken();
  // *options
  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json(new Apiresponse(statusCode, User));
};
module.exports = sendtoken;
