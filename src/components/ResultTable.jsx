import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

const ResultTable = ({ tab }) => {
  const rows = tab.result || [];

  if (!rows.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Run a query to see results here.
      </Typography>
    );
  }

  const columns = Object.keys(rows[0]).map((key) => ({
    field: key,
    headerName: key.toUpperCase(),
    width: 150,
    sortable: true,
  }));

  return (
    <Box sx={{ height: 400, width: "100%", mt: 2 }}>
      <DataGrid
        rows={rows.map((row, i) => ({ id: i, ...row }))}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
    </Box>
  );
};

export default ResultTable;
