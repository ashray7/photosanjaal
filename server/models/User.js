import mongoose from "mongoose";
import moment from "moment";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: {
      type: Number,
      ref: "Occupation",
      required: true,
    },
    hobby: {
      type: Number,
      ref: "Hobbies",
      required: true,
    },
    viewedProfile: Number,
    dob: {
      type: String,
      default: moment().format("YYYY-MM-DD"),
      required: true,
    },
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
