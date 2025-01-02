import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";

const columns = [
  { id: "id", label: "ID", minWidth: 50, align: "center" },
  { id: "name", label: "Name", minWidth: 130, align: "center" },
  { id: "country", label: "Country", minWidth: 130, align: "center" },
  { id: "code", label: "ISO Code", minWidth: 70, align: "center" },
  { id: "item", label: "Order Item", minWidth: 150, align: "center" },
  { id: "email", label: "Email", minWidth: 170, align: "center" },
];

const initialRows = [
  { id: 1, name: "John Doe", country: "USA", code: "US", item: "Laptop", email: "john@example.com" },
  { id: 2, name: "Jane Smith", country: "UK", code: "GB", item: "Phone", email: "jane@example.com" },
];

function CRUDTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("Add");
  const [currentRow, setCurrentRow] = useState({
    id: "",
    name: "",
    country: "",
    code: "",
    item: "",
    email: "",
  });
  const [newRowAdded, setNewRowAdded] = useState(false); // Track if a new row has been added

  // Load initial data from local storage or fallback to default rows
  useEffect(() => {
    const savedRows = JSON.parse(localStorage.getItem("rows")) || initialRows;
    console.log("Loaded rows from local storage:", savedRows); // Log to confirm
    setRows(savedRows);
  }, []);

  // Save rows to local storage on every update
  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDialogOpen = (mode, row = null) => {
    setDialogMode(mode);
    if (row) {
      setCurrentRow(row);
      setNewRowAdded(false); // Reset new row added when editing
    } else {
      setCurrentRow({ id: "", name: "", country: "", code: "", item: "", email: "" });
      setNewRowAdded(true); // Mark that a new row is being added
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setCurrentRow({ id: "", name: "", country: "", code: "", item: "", email: "" });
  };

  const handleSave = () => {
    if (dialogMode === "Add") {
      const newRow = {
        ...currentRow,
        id: rows.length ? rows[rows.length - 1].id + 1 : 1,
      };
      setRows([...rows, newRow]);
      setNewRowAdded(false); // Reset after saving
    } else if (dialogMode === "Edit") {
      setRows(rows.map((row) => (row.id === currentRow.id ? currentRow : row)));
    }
    handleDialogClose();
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentRow({ ...currentRow, [name]: value });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "10px 0" }}>
        <Button variant="contained" onClick={() => handleDialogOpen("Add")}>
          Add Row
        </Button>
      </div>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {row[column.id]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <BorderColorIcon
                        sx={{ color: "blue", cursor: "pointer", marginRight: "8px" }}
                        onClick={() => handleDialogOpen("Edit", row)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <DeleteForeverSharpIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        onClick={() => handleDelete(row.id)}
                      />
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === "Add" ? "Add Row" : "Edit Row"}</DialogTitle>
        <DialogContent>
          {columns
            .filter((column) => column.id !== "id")
            .map((column) => (
              <TextField
                key={column.id}
                margin="dense"
                label={column.label}
                name={column.id}
                value={currentRow[column.id]}
                onChange={handleInputChange}
                fullWidth
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {newRowAdded ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={handleSave}>{dialogMode === "Add" ? "Add" : "Save"}</Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CRUDTable;
