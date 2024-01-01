const Data = require("../models/dataModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//----------------------user---------------------------------------
exports.signUp = async (req, res) => {
  console.log("Request received for signup:", req.body);

  try {
    const isEmailExist = await User.findOne({ username: req.body.username });
    console.log(req.body);
    if (isEmailExist === null) {
      const newData = await User.create(req.body);
      return res.status(200).json(newData);
    } else {
      return res
        .status(204)
        .json({ message: " user with this email already exist" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.Login = async (req, res) => {
  const { username, password } = req.body;
  const secretKey = process.env.secretKey || "defaultSecretKey";
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "2 days",
        algorithm: "HS256",
      });
      return res.json({
        token,
        username: user.username,
      });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.verifyUser = async (req, res) => {
  const tokenHeader = req.headers["authorization"] || null;
  const token = (tokenHeader && tokenHeader.split(" ")[1]) || null;
  console.log("token gheader", tokenHeader);
  console.log("token", token);
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey, { algorithm: "HS256" });
    req.user = decodedToken;
    console.log({ decodedToken });
    return res.status(200).send(true);
  } catch (error) {
    console.log(error);
    return res.status(401).send(false);
  }
};
//-----------------------data--------------------------------------
exports.getTasks = async (req, res) => {
  console.log(req.user.username);

  try {
    const tasks = await Data.find({ username: req.user.username });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  req.body.username = req.user.username;
  console.log(req.user);
  const newTask = new Data(req.body);
  try {
    console.log(newTask);
    await newTask.save();
    res.status(200).json(newTask);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Data.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Data.findByIdAndDelete(id);
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
