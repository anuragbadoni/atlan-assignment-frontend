import React, { useState } from "react";
import { Tabs, Tab, Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import useEditorStore from "../store/editorStore";
import QueryEditor from "./QueryEditor";
import ResultTable from "./ResultTable";
import { v4 as uuidv4 } from "uuid";

const TabManager = () => {
  const {
    openTabs,
    activeTabId,
    switchTab,
    closeTab,
    openNewTab,
    addSavedQuery,
  } = useEditorStore();
  const [editingTabId, setEditingTabId] = useState(null);
  const [newTabName, setNewTabName] = useState("");

  const handleAddTab = () => {
    const newTab = {
      id: uuidv4(),
      name: `Query ${openTabs.length + 1}`,
      query: "",
      result: [],
    };
    openNewTab(newTab);
  };

  const handleRenameTab = (tabId) => {
    const tab = openTabs.find((t) => t.id === tabId);
    setNewTabName(tab.name);
    setEditingTabId(tabId);
  };

  const handleSaveTab = (tabId) => {
    const updatedTab = openTabs.find((t) => t.id === tabId);
    updatedTab.name = newTabName;
    // Save updated tab to savedQueries
    addSavedQuery(updatedTab);
    setEditingTabId(null);
    setNewTabName("");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={activeTabId}
          onChange={(e, newValue) => switchTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {openTabs.map((tab) => (
            <Tab
              key={tab.id}
              label={
                editingTabId === tab.id ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      size="small"
                      value={newTabName}
                      onChange={(e) => setNewTabName(e.target.value)}
                      onBlur={() => handleSaveTab(tab.id)}
                      autoFocus
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {tab.name}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameTab(tab.id);
                      }}
                    >
                      ✏️
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )
              }
              value={tab.id}
            />
          ))}
        </Tabs>
        <IconButton onClick={handleAddTab}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        {openTabs.map((tab) =>
          tab.id === activeTabId ? (
            <Box key={tab.id}>
              <QueryEditor tab={tab} />
              <ResultTable tab={tab} />
            </Box>
          ) : null
        )}
      </Box>
    </Box>
  );
};

export default TabManager;
