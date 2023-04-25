import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassWord = await bcrypt.hashSync(password, salt);
      resolve(hashPassWord);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          //compare password
          let check = await bcrypt.compare(password, user.password);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Mật khẩu bạn đã nhập không chính xác";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `Tài khoản không tồn tại. Vui lòng thử lại sau`;
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Email bạn nhập không kết nối với tài khoản nào. Hãy thử lại với email khác.`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUSer = (data) => {
  console.log(data);
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      console.log(check);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: "Email này đã được sử dụng, Vui lòng thử lại email khác",
        });
      } else {
        let hashPassWordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPassWordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
        });
      }

      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 1,
          errMessage: "Bạn phải điền đầy đủ email và mật khẩu!",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();

        resolve({
          errCode: 0,
          errMessage: "Cập nhật thông tin người dùng thành công!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Tài khoản không tồn tại. Vui lòng thử lại sau!",
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
};

let deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "The user isn't exist",
        });
      }
      await user.destroy();

      resolve({
        errCode: 0,
        errMessage: "The user is deleted",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  createNewUSer: createNewUSer,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
