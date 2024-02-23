import Occupation from "../models/Occupation.js";
import User from "../models/User.js";

const calculateMutualFriends = async (id, user) => {
  let mutualFriends = [];

  if (id !== user?.id) {
    try {
      const personal = await User.findById(id);

      // Calculate mutual friends
      let set1 = new Set(user?.friends);
      let set2 = new Set(personal?.friends);

      // Find the intersection of the two sets (common friends)
      mutualFriends = [...set1].filter((friend) => set2?.has(friend));

      // Return the numerical value
      return mutualFriends?.length;
    } catch (error) {
      console.error("Error calculating mutual friends:", error);
      throw new Error("Failed to calculate mutual friends");
    }
  }

  // Return 0 if the IDs are the same
  return 0;
};

const calculateAge = (dob) => {
  const dobDate = new Date(dob);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in years
  const age = currentDate.getFullYear() - dobDate.getFullYear();

  // Adjust the age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < dobDate.getMonth() ||
    (currentDate.getMonth() === dobDate.getMonth() &&
      currentDate.getDate() < dobDate.getDate())
  ) {
    return age - 1;
  }

  return age;
};

const cosineSimilarity = (vectorA, vectorB) => {
  if (vectorA.length !== vectorB.length) {
    throw new Error(
      "Vectors must have the same length for cosine similarity calculation."
    );
  }

  // Calculate dot product
  const dotProduct = vectorA.reduce(
    (acc, val, index) => acc + val * vectorB[index],
    0
  );

  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val ** 2, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val ** 2, 0));

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  // Calculate cosine similarity
  const similarity = dotProduct / (magnitudeA * magnitudeB);

  return similarity;
};

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const occupation = await Occupation.findOne({ id: user?.occupation });

    // Include the number of mutual friends and occupation name inside the user data
    const newUserData = {
      ...user.toObject(),
      noOfMutualFriends: await calculateMutualFriends(req?.user?.id, user),
      occupation: occupation?.name || "No Occupation", // handle case where occupation is null
    };

    res.status(200).json(newUserData);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = await Promise.all(
      friends.map(
        async ({
          _id,
          firstName,
          lastName,
          occupation: friendOccupationId, // Use a different variable name to avoid conflicts
          location,
          picturePath,
          dob,
        }) => {
          const friendOccupation = await Occupation.findOne({
            id: friendOccupationId,
          });
          return {
            _id,
            firstName,
            lastName,
            occupation: friendOccupation?.name || "No Occupation",
            location,
            picturePath,
            dob,
          };
        }
      )
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriendSuggestions = async (req, res) => {
  try {
    // Get all users from the database
    const allUsers = await User.find();

    // Get the personal profile of the logged-in user
    const personalUser = await User.findById(req.user.id);

    // Exclude the personal user from the list of all users
    const otherUsers = allUsers.filter(
      (user) => user._id.toString() !== req.user.id
    );

    // Calculate cosine similarity scores
    const similarityScores = await Promise.all(
      otherUsers.map(async (otherUser) => {
        const mutualFriends = await calculateMutualFriends(
          personalUser?.id,
          otherUser
        );

        return {
          _id: otherUser._id,
          name: otherUser.name,
          similarity: cosineSimilarity(
            [
              personalUser.occupation,
              mutualFriends,
              calculateAge(personalUser?.dob),
            ],
            [
              otherUser.occupation,
              await calculateMutualFriends(otherUser?.id, personalUser),
              calculateAge(otherUser?.dob),
            ]
          ),
        };
      })
    );

    // Sort users by similarity in descending order
    const sortedSuggestions = similarityScores.sort(
      (a, b) => b.similarity - a.similarity
    );

    const filteredSuggestions = similarityScores.filter(
      (suggestion) => !personalUser.friends.includes(suggestion._id.toString())
    );

    const top5Suggestions = filteredSuggestions.slice(0, 5);

    const friendsSuggestion = await Promise.all(
      top5Suggestions.map((id) => User.findById(id))
    );

    const formattedFriends = await Promise.all(
      friendsSuggestion.map(
        async ({
          _id,
          firstName,
          lastName,
          occupation: friendOccupationId, // Use a different variable name to avoid conflicts
          location,
          picturePath,
          dob,
        }) => {
          const friendOccupation = await Occupation.findOne({
            id: friendOccupationId,
          });
          return {
            _id,
            firstName,
            lastName,
            occupation: friendOccupation?.name || "No Occupation",
            location,
            picturePath,
            dob,
          };
        }
      )
    );
    res.status(200).json(formattedFriends);
  } catch (error) {
    console.error("Error fetching friend suggestions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
        dob,
      }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
          dob,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
