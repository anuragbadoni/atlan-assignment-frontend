import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography } from "@mui/material";
import { saveAs } from "file-saver";
import useEditorStore from "../store/editorStore";

// Function to convert the result data into CSV format
const convertToCSV = (rows) => {
  const header = Object.keys(rows[0]).join(","); // Get column headers
  const body = rows
    .map(
      (row) => Object.values(row).join(",") // Convert each row to a comma-separated string
    )
    .join("\n");
  return `${header}\n${body}`;
};

// Function to handle CSV download
const downloadCSV = (rows) => {
  const csv = convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "query-results.csv"); // Using file-saver to save the file
};

const ResultTable = ({ tab }) => {
  const rows = tab.result || [];

  const [pageSize, setPageSize] = useState(10); // Set initial page size

  const { executionTime } = useEditorStore();
  const [time, setTime] = useState(executionTime);
  useEffect(() => {
    console.log("i her", executionTime);
    setTime(executionTime);
  }, [executionTime, time]);

  if (!rows.length) {
    return <div>No data to display. Run a query!</div>;
  }

  const columns = Object.keys(rows[0]).map((key) => ({
    field: key,
    headerName: key.toUpperCase(),
    width: 150,
    sortable: true,
  }));

  return (
    <Box sx={{ height: 400, width: "100%", mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => downloadCSV(rows)}
        sx={{ mb: 2 }}
      >
        Export as CSV
      </Button>

      <DataGrid
        rows={rows.map((r, i) => ({ ...r, id: i }))}
        columns={columns}
        pageSize={pageSize} // Number of rows per page
        rowsPerPageOptions={[5, 10, 20]} // Allow the user to choose page size
        pagination
        paginationMode="client" // Client-side pagination
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // Update page size
        disableSelectionOnClick
        rowBuffer={10} // Number of rows to render before the visible ones
        autoPageSize
      />

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1">Execution Time: {time} ms</Typography>
      </Box>
    </Box>
  );
};

export default ResultTable;
