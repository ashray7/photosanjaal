import Occupation from "../models/Occupation.js";

export const getOccupations = async (req, res) => {
    try {
        const occupations = await Occupation.find();
        res.status(200).json(occupations);
    } catch (error) {
        console.error('Error fetching occupations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createOccupation = async (req, res) => {
    try {
        const {id, name} = req.body;
      const occupation = new Occupation({ id, name });
      await occupation.save();
      res.status(200).json(occupation);
    } catch (error) {
        console.error('Error fetching occupations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };