import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Bạn cần nhập đủ email và password!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);
  //check email exist
  //password nhap vao ko dung
  //return userInfor
  // access_token :JWT json web token

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUSer(req.body);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let message = await userService.updateUserData(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }
  let message = await userService.deleteUserById(req.body.id);
  return res.status(200).json(message);
};

module.exports = {
  handleLogin: handleLogin,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
};
