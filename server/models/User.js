import mongoose from "mongoose";

const SubcribedUsersSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  profileUrl: String,
}, { _id : false });
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: function() {
        return this.name.replace(/\s/g, '');
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profileUrl: {
      type: String,
      default: "",
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedUsers: {
      type: [SubcribedUsersSchema],
    },
    pwd: {
      type: String,
    },
    signWithGoogle: {
      type: Boolean,
      required: true,
      default: false,
    },
    banner: {
      type: String,
      required: false,
      default: "",
    }
  },
  { timestamps: true },
);



export default mongoose.model("User", UserSchema);
