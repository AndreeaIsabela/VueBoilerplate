import { Document, Schema, Model, model } from "mongoose";
import { SHA256 } from "crypto-js/sha256";

import { IUser } from "../types/IUser";

export interface IUserModel extends IUser, Document{};
export const userSchema: Schema = new Schema({
  email: {
    type: String,
    validate: {
      validator: function (email) {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const gmailReg = /^(.+?)\++(.+?)@gmail.com/;
        return emailReg.test(email) || gmailReg.test(email);
      }
    },
    required:[true, "User email required"],
    unique: [true, "This email already exists"]
  },
  password: { required:true, type: String}
  });

userSchema.pre("save", (next)=> {

  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // hash the password
  const hash = SHA256(this.password);
  this.password = hash;
  next();
});

userSchema.methods.comparePassword = (candidatePassword) => {
  try {
    return SHA256(candidatePassword) == this.password;
  }
  catch (err) {
    console.log(err);
  }
}

export const UserModel: Model<IUserModel> = model<IUserModel>('User', userSchema);