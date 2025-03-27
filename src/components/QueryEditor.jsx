import React, { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { githubLight } from "@uiw/codemirror-theme-github";
import useEditorStore from "../store/editorStore";
import customers from "../data/customers.json"; // Example dummy data
import orders from "../data/orders.json";

const QueryEditor = ({ tab }) => {
  const { updateTabQuery, updateTabResult, addToHistory } = useEditorStore();

  const handleRunQuery = () => {
    let result = [];

    if (tab.query.toLowerCase().includes("from customers")) {
      result = customers;
    } else if (tab.query.toLowerCase().includes("from orders")) {
      result = orders;
    }

    updateTabResult(tab.id, result);
    addToHistory(tab.query);
  };

  // Handle keyboard shortcuts for Ctrl + Enter or Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleRunQuery(); // Run the query if Ctrl + Enter is pressed
      }
    };

    // Add event listener on mount
    window.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tab.query]); // Depend on the query to re-attach listener when query changes

  return (
    <Box mb={2}>
      <CodeMirror
        value={tab.query}
        height="200px"
        theme={githubLight}
        extensions={[sql()]}
        onChange={(value) => updateTabQuery(tab.id, value)}
      />
      <Stack direction="row" spacing={2} mt={1}>
        <Button variant="contained" onClick={handleRunQuery}>
          Run
        </Button>
        <Button variant="outlined" onClick={() => updateTabQuery(tab.id, "")}>
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default QueryEditor;
