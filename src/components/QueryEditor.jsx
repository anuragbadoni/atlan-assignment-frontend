import React from "react";
import { Box, Button, Stack } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { githubLight } from "@uiw/codemirror-theme-github";
import useEditorStore from "../store/editorStore";
import customers from "../data/customers.json"; // we would use the logic to fetch the data from the database in the actual implementation
import orders from "../data/orders.json"; // we would use the logic to fetch the data from the database in the actual implementation

const QueryEditor = ({ tab }) => {
  const { updateTabQuery, updateTabResult, addToHistory } = useEditorStore();

  const runQuery = () => {
    let result = [];

    if (tab.query.toLowerCase().includes("from customers")) {
      result = customers;
    } else if (tab.query.toLowerCase().includes("from orders")) {
      result = orders;
    }

    updateTabResult(tab.id, result);
    addToHistory(tab.query);
  };

  return (
    <Box mb={2}>
      <CodeMirror
        value={tab.query}
        height="200px"
        extensions={[sql()]}
        theme={githubLight}
        onChange={(value) => updateTabQuery(tab.id, value)}
      />
      <Stack direction="row" spacing={2} mt={1}>
        <Button variant="contained" onClick={runQuery}>
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
