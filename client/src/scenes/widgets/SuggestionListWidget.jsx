import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSuggestedFriends } from "state";

const SuggestionListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const suggestedFriends = useSelector((state) => state.user.suggestedFriends);
  const friends = useSelector((state) => state.user.friends);

  const getFriendSuggestion = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${userId}/suggestfriend`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setSuggestedFriends({ friends: data }));
  };

  useEffect(() => {
    getFriendSuggestion();
  }, [friends]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggestion List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {suggestedFriends?.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default SuggestionListWidget;
