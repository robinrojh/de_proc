// eslint-disable-next-line no-unused-vars
import { authService, dbService } from "./fbase";
import { validateSignUpData, validateLoginData } from "../util/validators";

export const signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    nickname: req.body.nickname,
  };
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) {
    return res.status(400).json(errors);
  }

  let token, userId;
  dbService.doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
      return authService
        .createUserWithEmailAndPassword(newUser.email, newUser.password);
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        email: newUser.email,
        nickname: newUser.nickname,
        userId,
      };
      return dbService.doc(`/users/${newUser.email}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res
          .status(500)
          .json({ general: "Something went wrong, please try again" });
      }
    });
};

export const login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);
  if (!valid) {
    return res.status(400).json(errors);
  }
  
  authService
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);

      return res
        .status(403)
        .json({ general: "Wrong credentials, please try again" });
    });
};
