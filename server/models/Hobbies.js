import mongoose from "mongoose";

const hobbiesSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Hobbies = mongoose.model("hobbies", hobbiesSchema);

export default Hobbies;
