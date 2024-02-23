import mongoose from "mongoose";

const occupationSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Occupation = mongoose.model("Occupation", occupationSchema);

export default Occupation;