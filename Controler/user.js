const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../Module/user");

const userRegister = async (req, res) => {
  console.log("hello");

  try {
    const newuser = new userModel({
      ...req.body,
    });
    await newuser.save();

    res.json({
      success: true,
      message: "user created Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "something went wrong try again later",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res.json({
        status: false,
        message: "Invalid username",
      });
    }

    const isCorrectPasword = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isCorrectPasword) {
      return res.cookie("access_token", "", { expires: new Date(0) }).json({
        status: false,
        message: "Invalid password",
      });
    }

    const expiryDate = Math.floor(new Date().getTime() / 1000) + 3600;

    const payload = {
      id: user._id,
      role: user.role,
      exp: expiryDate,
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN);

    const loginUser = await userModel.findById(user._id).select("-password");

    res.cookie("access_token", token, { httpOnly: true }).json({
      success: true,
      message: "login successfully",
      userDetails: loginUser,
      token,
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};

const userLogout = (req, res) => {
  // console.log(req);
  try {
    res.cookie("access_token", "", { expires: new Date(0) });
    res.json({
      success: true,
      message: " logout successfull ",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: false,
      message: error.message,
    });
  }
};


module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
