import { Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Create Ad</Typography>
      </FlexBetween>
      <a
        href="https://waiwai.com.np"
        target="blank"
        style={{ color: "medium", textDecoration: "none" }}
      >
        <img
          width="100%"
          height="auto"
          alt="advert"
          src="http://localhost:3001/assets/waiwai.jpg"
          style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
        />
      </a>

      <FlexBetween>
        <Typography color={main}>Wai Wai instant noodles</Typography>
        <a
          href="https://waiwai.com.np"
          target="blank"
          style={{ color: "medium", textDecoration: "none" }}
        >
          waiwai.com
        </a>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Enjoy Wai Wai noodles with your friends and family cooked or uncooked
        and get absolutely lost in the flavours.
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
