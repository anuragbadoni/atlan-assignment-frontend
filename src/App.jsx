import React from "react";
import Box from "@mui/material/Box";
import AppBarHeader from "./components/AppBarHeader";
import Sidebar from "./components/Sidebar";
import TabManager from "./components/TabManager";

const App = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBarHeader />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 2  }}>
        <TabManager />
      </Box>
    </Box>
  );
};

export default App;
