import React from "react";
import { Box } from "@mui/material";
import Summary from "./summary";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100%",
        background:
          "radial-gradient(circle at top, rgba(15, 118, 110, 0.08), transparent 24%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <Box sx={{ maxWidth: 1600, mx: "auto" }}>
        <Summary />
      </Box>
    </Box>
  );
}
