import React, { useEffect, useState, useMemo } from "react";
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
} from "@mui/icons-material";
import useEditorStore from "../store/editorStore";

const convertToCSV = (rows) => {
  const header = Object.keys(rows[0]).join(",");
  const body = rows.map((row) => Object.values(row).join(",")).join("\n");
  return `${header}\n${body}`;
};

const downloadCSV = (rows) => {
  const csv = convertToCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "query-results.csv");
};

const ResultTable = ({ tab }) => {
  const rows = useMemo(() => tab.result || [], [tab.result]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { executionTime } = useEditorStore();
  const [time, setTime] = useState(executionTime);

  useEffect(() => {
    setTime(executionTime);
  }, [executionTime]);

  const totalPages = useMemo(
    () => Math.ceil(rows.length / pageSize),
    [rows.length, pageSize]
  );

  const startRow = useMemo(
    () => (currentPage - 1) * pageSize,
    [currentPage, pageSize]
  );
  const endRow = useMemo(() => startRow + pageSize, [startRow, pageSize]);

  const displayedRows = useMemo(() => {
    return rows.slice(startRow, endRow);
  }, [rows, startRow, endRow]);

  const columns = useMemo(() => {
    if (!rows.length) return [];
    return [
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
  }, [rows, currentPage, pageSize]);

  const handleResultsPerPageChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (!rows.length) {
    return <div>No data to display. Run a query!</div>;
  }

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
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
            sx={{ marginRight: 2 }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
          <IconButton
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            sx={{ marginRight: 1 }}
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

      <Box sx={{ height: 500, width: "100%", overflowY: "auto" }}>
        <DataGrid
          rows={displayedRows.map((r, i) => ({ ...r, id: i }))}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20, 50]}
          pagination
          paginationMode="client"
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          disableSelectionOnClick
          rowBuffer={10}
        />
      </Box>
    </Box>
  );
};

export default ResultTable;
