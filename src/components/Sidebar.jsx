import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useEditorStore from "../store/editorStore";
import { v4 as uuidv4 } from "uuid";

const Sidebar = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const { savedQueries, queryHistory, openNewTab } = useEditorStore();

  const handleQueryClick = (queryObj) => {
    openNewTab({
      id: uuidv4(),
      name: queryObj.name,
      query: queryObj.query,
      result: [],
    });
  };

  const filteredSaved = savedQueries.filter((q) =>
    q.name.toLowerCase().includes(filter.toLowerCase())
  );
  const filteredHistory = queryHistory.filter((q) =>
    q.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        [`& .MuiDrawer-paper`]: {
          width: 250,
          top: 64,
          boxSizing: "border-box",
        },
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        variant="fullWidth"
      >
        <Tab label="Saved" />
        <Tab label="History" />
      </Tabs>
      <Box p={1}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <List dense>
        {(tabIndex === 0 ? filteredSaved : filteredHistory).map((item, idx) => (
          <ListItem
            key={idx}
            button
            onClick={() =>
              handleQueryClick(
                tabIndex === 0
                  ? item
                  : { name: `History ${idx + 1}`, query: item }
              )
            }
          >
            <ListItemText primary={tabIndex === 0 ? item.name : item} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
