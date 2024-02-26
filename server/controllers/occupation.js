import Occupation from "../models/Occupation.js";
import Hobbies from "../models/Hobbies.js";

export const getOccupations = async (req, res) => {
  try {
    const occupations = await Occupation.find();
    res.status(200).json(occupations);
  } catch (error) {
    console.error("Error fetching occupations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createOccupation = async (req, res) => {
  try {
    const { id, name } = req.body;
    const occupation = new Occupation({ id, name });
    await occupation.save();
    res.status(200).json(occupation);
  } catch (error) {
    console.error("Error fetching occupations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getHobbies = async (req, res) => {
  try {
    const hobbies = await Hobbies.find();
    res.status(200).json(hobbies);
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createHobbies = async (req, res) => {
  try {
    const { id, name } = req.body;
    const hobbies = new Hobbies({ id, name });
    await hobbies.save();
    res.status(200).json(hobbies);
  } catch (error) {
    console.error("Error fetching hobbies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
