import React, { useEffect, useCallback, useMemo } from "react";
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

  // 🔁 useCallback to prevent re-creating function on each render
  const handleRunQuery = useCallback(async () => {
    setQueryLoading(true);
    let result = [];
    try {
      const startTime = performance.now();
      let tableName;
      const lowerQuery = tab.query.toLowerCase();

      if (lowerQuery.includes("from customers")) {
        tableName = "customers.csv";
      } else if (lowerQuery.includes("from orders")) {
        tableName = "order_details.csv";
      } else {
        tableName = "products.csv";
      }

      const response = await fetch(tableName);
      const csvText = await response.text();

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
  }, [
    tab.query,
    tab.id,
    setQueryLoading,
    updateTabResult,
    addToHistory,
    setExecutionTime,
  ]);

  // 🔁 Memoizing extensions array
  const codeMirrorExtensions = useMemo(() => [sql()], []);


  const handleKeyDown = useCallback(
    (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleRunQuery();
      }
    },
    [handleRunQuery]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Box mb={2}>
      <CodeMirror
        value={tab.query}
        height="200px"
        theme={githubLight}
        extensions={codeMirrorExtensions}
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
