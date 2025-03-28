import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { saveAs } from "file-saver";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"; // Import Material UI icons
import useEditorStore from "../store/editorStore"; // Assuming your store

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
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  const { executionTime } = useEditorStore();
  const [time, setTime] = useState(executionTime);

  useEffect(() => {
    setTime(executionTime); // Sync execution time with the global store
  }, [executionTime]);

  const totalPages = Math.ceil(rows.length / pageSize); // Calculate total pages
  const startRow = (currentPage - 1) * pageSize;
  const endRow = startRow + pageSize;
  const displayedRows = rows.slice(startRow, endRow); // Slice rows for pagination

  const handleResultsPerPageChange = (event) => {
    setPageSize(Number(event.target.value)); // Change page size
    setCurrentPage(1); // Reset to first page when the page size changes
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value)); // Change current page
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1); // Next page
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1); // Previous page
  };

  if (!rows.length) {
    return <div>No data to display. Run a query!</div>;
  }

  const columns = [
    {
      field: "rowNumber",
      headerName: "Row No.",
      width: 100,
      renderCell: (params) => {
        const rowNumber = (currentPage - 1) * pageSize + params.row.id + 1;
        return <span>{rowNumber}</span>;
      },
    },
    ...Object.keys(rows[0]).map((key) => ({
      field: key,
      headerName: key.toUpperCase(),
      width: 150,
      sortable: true,
    })),
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      {/* Query Summary with Controls at the Top */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: "8px 16px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Total Rows: {rows.length}
          </Typography>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Execution Time: {(time / 1000).toFixed(2)} s
          </Typography>

          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Results per page:
          </Typography>
          <Select
            value={pageSize}
            onChange={handleResultsPerPageChange}
            sx={{
              marginRight: 2,
              backgroundColor: "inherit",
              cursor: "pointer",
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>

          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            sx={{
              marginRight: 1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Page
          </Typography>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            style={{
              width: "60px",
              padding: "4px",
              textAlign: "center",
              marginRight: "8px",
            }}
          />
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            of {totalPages}
          </Typography>
          <IconButton
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => downloadCSV(rows)}
        >
          Export as CSV
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 500, width: "100%", overflowY: "auto" }}>
        <DataGrid
          rows={displayedRows.map((r, i) => ({ ...r, id: i }))}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20, 50]} // Allow user to select from multiple page sizes
          pagination
          paginationMode="client" // Client-side pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // Update page size dynamically
          disableSelectionOnClick
          rowBuffer={10} // Number of rows to render before the visible ones
        />
      </Box>
    </Box>
  );
};

export default ResultTable;
