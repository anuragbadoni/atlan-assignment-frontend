import React, { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { githubLight } from "@uiw/codemirror-theme-github";
import Papa from "papaparse";
import useEditorStore from "../store/editorStore";

const QueryEditor = ({ tab }) => {
  const { updateTabQuery, updateTabResult, addToHistory, setQueryLoading } =
    useEditorStore();
  const setExecutionTime = useEditorStore((state) => state.setExecutionTime);
  const handleRunQuery = async () => {
    setQueryLoading(true);
    let result = [];
    try {
      const startTime = performance.now();
      let tableName;
      if (tab.query.toLowerCase().includes("from customers")) {
        tableName = "customers.csv";
      } else if (tab.query.toLowerCase().includes("from orders")) {
        tableName = "orders_details.csv";
      } else tableName = "products.csv";
      const response = await fetch(tableName);
      const csvText = await response.text();
      console.log(response);
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          result = results.data;
          setQueryLoading(false);
          updateTabResult(tab.id, result);
          addToHistory(tab.query);
          const endTime = performance.now();
          setExecutionTime(endTime - startTime);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setQueryLoading(false);
          setExecutionTime(0);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV:", error);
      setQueryLoading(false);
      setExecutionTime(0);
    }
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
