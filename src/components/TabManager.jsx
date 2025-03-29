import React, { useState, useCallback, useMemo, lazy, Suspense } from "react";
import { Tabs, Tab, Box, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import useEditorStore from "../store/editorStore";
const QueryEditor = lazy(() => import("./QueryEditor"));
const ResultTable = lazy(() => import("./ResultTable"));
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

  const handleAddTab = useCallback(() => {
    const newTab = {
      id: uuidv4(),
      name: `Query ${openTabs.length + 1}`,
      query: "",
      result: [],
    };
    openNewTab(newTab);
  }, [openTabs.length, openNewTab]);

  const handleRenameTab = useCallback(
    (tabId) => {
      const tab = openTabs.find((t) => t.id === tabId);
      setNewTabName(tab.name);
      setEditingTabId(tabId);
    },
    [openTabs]
  );

  const handleSaveTab = useCallback(
    (tabId) => {
      const updatedTab = openTabs.find((t) => t.id === tabId);
      updatedTab.name = newTabName;
      addSavedQuery(updatedTab);
      setEditingTabId(null);
      setNewTabName("");
    },
    [newTabName, addSavedQuery, openTabs]
  );

  // 🔁 Memoizing tab components
  const renderedTabs = useMemo(
    () =>
      openTabs.map((tab) => (
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
      )),
    [
      openTabs,
      editingTabId,
      newTabName,
      handleRenameTab,
      handleSaveTab,
      closeTab,
    ]
  );

  const renderedTabContent = useMemo(() => {
    return openTabs.map((tab) =>
      tab.id === activeTabId ? (
        <Box key={tab.id}>
          <Suspense fallback={<div>Loading editor...</div>}>
            <QueryEditor tab={tab} />
            <ResultTable tab={tab} />
          </Suspense>
        </Box>
      ) : null
    );
  }, [openTabs, activeTabId]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs
          value={activeTabId}
          onChange={(e, newValue) => switchTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {renderedTabs}
        </Tabs>
        <IconButton onClick={handleAddTab}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>{renderedTabContent}</Box>
    </Box>
  );
};

export default TabManager;
