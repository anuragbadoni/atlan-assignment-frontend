import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Example demo tables schema component 
const TablesSchema = () => {
  const [openTables, setOpenTables] = useState([]); // Tracking multiple expanded tables
  const tableData = [
    {
      tableName: "customers",
      columns: [
        { name: "customerID", type: "string" },
        { name: "companyName", type: "string" },
        { name: "contactName", type: "string" },
        { name: "contactTitle", type: "string" },
        { name: "address", type: "string" },
        { name: "city", type: "string" },
        { name: "region", type: "string" },
        { name: "postalCode", type: "integer" },
        { name: "country", type: "string" },
        { name: "phone", type: "integer" },
        { name: "fax", type: "integer" },
      ],
    },
    {
      tableName: "order_details",
      columns: [
        { name: "orderID", type: "integer" },
        { name: "productID", type: "integer" },
        { name: "unitPrice", type: "integer" },
        { name: "quantity", type: "integer" },
        { name: "discount", type: "integer" },
      ],
    },
  ];

  const handleClick = (tableName) => {
    setOpenTables(
      (prev) =>
        prev.includes(tableName)
          ? prev.filter((name) => name !== tableName) // Closing the table if already open
          : [...prev, tableName] // Open the table if it's closed
    );
  };

  return (
    <Box>
      {tableData.map((table) => (
        <Box key={table.tableName} sx={{ marginBottom: 2 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleClick(table.tableName)}
          >
            <IconButton>
              {openTables.includes(table.tableName) ? (
                <ExpandMoreIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: "bold", flexGrow: 1 }}>
              {table.tableName}
            </Typography>
          </Box>

          <Collapse
            in={openTables.includes(table.tableName)}
            timeout="auto"
            unmountOnExit
          >
            <List sx={{ paddingLeft: 3 }}>
              {table.columns.map((column, index) => (
                <ListItem key={index} sx={{ padding: 0 }}>
                  <ListItemText
                    primary={column.name}
                    secondary={column.type}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 0.5,
                      marginRight: 2,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};

export default TablesSchema;
