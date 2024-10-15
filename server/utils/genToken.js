import jwt from "jsonwebtoken";

const genToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.COOKIE_SECRET, { expiresIn: '1h' });

  res.cookie("jwt", token, {
    maxAge: 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export default genToken;