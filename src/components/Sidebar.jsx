import React, { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useEditorStore from "../store/editorStore";
import { v4 as uuidv4 } from "uuid";
import { Suspense, lazy } from "react";

const TablesSchema = lazy(() => import("./Tables")); // for Lazy load

const Sidebar = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [rawFilter, setRawFilter] = useState(""); // for the actual input box
  const [filter, setFilter] = useState(""); // debounced state

  const { savedQueries, queryHistory, openNewTab } = useEditorStore();

  const handleQueryClick = (queryObj) => {
    openNewTab({
      id: uuidv4(),
      name: queryObj.name,
      query: queryObj.query,
      result: [],
    });
  };

  // Debounce filter input for 300ms to avoid excessive re-renders
  const debouncedFilterUpdate = useMemo(
    () =>
      debounce((value) => {
        setFilter(value);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedFilterUpdate(rawFilter);
    return () => debouncedFilterUpdate.cancel(); // cleanup
  }, [rawFilter, debouncedFilterUpdate]);

  const filteredSaved = useMemo(() => {
    return savedQueries.filter((q) =>
      q.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [savedQueries, filter]);

  const filteredHistory = useMemo(() => {
    return queryHistory.filter((q) =>
      q.toLowerCase().includes(filter.toLowerCase())
    );
  }, [queryHistory, filter]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 300,
        [`& .MuiDrawer-paper`]: {
          width: 300,
          top: 64,
          boxSizing: "border-box",
        },
      }}
    >
      <Tabs
        value={tabIndex}
        onChange={(e, v) => setTabIndex(v)}
        variant="fullWidth"
      >
        <Tab label="Saved" />
        <Tab label="History" />
        <Tab label="Tables" />
      </Tabs>

      {tabIndex <=1 && (
        <Box p={1}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search..."
            value={rawFilter}
            onChange={(e) => setRawFilter(e.target.value)}
          />
        </Box>
      )}

      {tabIndex === 2 ? (
        <Suspense fallback={<div>Loading schema...</div>}>
          <TablesSchema />
        </Suspense>
      ) : (
        <List dense>
          {(tabIndex === 0 ? filteredSaved : filteredHistory).map(
            (item, idx) => (
              <ListItem
                style={{ cursor: "pointer" }}
                key={idx}
                onClick={() =>
                  handleQueryClick(
                    tabIndex === 0
                      ? item
                      : { name: `History ${idx + 1}`, query: item }
                  )
                }
              >
                <ListItemText primary={tabIndex === 0 ? item.name : item} />
              </ListItem>
            )
          )}
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
