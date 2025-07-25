import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useFormik } from "formik";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Cairo, Arial, sans-serif",
  },
});

const days = [
  { label: "الثلاثاء 8 يوليو", date: "2024-07-08" },
  { label: "الأربعاء 9 يوليو", date: "2024-07-09" },
  { label: "الخميس 10 يوليو", date: "2024-07-10" },
  { label: "الجمعة 11 يوليو", date: "2024-07-11" },
  { label: "السبت 12 يوليو", date: "2024-07-12" },
  { label: "الأحد 13 يوليو", date: "2024-07-13" },
  { label: "الاثنين 14 يوليو", date: "2024-07-14" },
  { label: "الثلاثاء 15 يوليو", date: "2024-07-15" },
];

export default function Camp() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [DenimicID, setDenimicID] = useState(null);

  const addSchedule = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Camps`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      // Refresh the schedule after adding
      fetchSchedule();
      handleEditCancel();
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/deleteCamp/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchSchedule();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const updateSchedule = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/updateCamp/${DenimicID}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchSchedule();
      handleEditCancel();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      date: days[selectedDay]?.date || "",
      task: "",
      time: "",
    },
    onSubmit: updateSchedule,
  });

  // Filter schedule for selected day
  const filteredSchedule = schedule.filter(
    (item) => item.date === days[selectedDay]?.date
  );

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-All-Camps`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data);
      setSchedule(response.data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  useEffect(() => {
    console.clear();
    fetchSchedule();
  }, []);

  // Update formik date when selected day changes
  useEffect(() => {
    formik.setFieldValue("date", days[selectedDay]?.date || "");
  }, [selectedDay]);

  const handleEditClick = (item, index) => {
    setDenimicID(item.id);
    setEditingItem({ ...item, index });
    formik.setValues({
      date: days[selectedDay]?.date || "",
      task: item.task || item.activity || "",
      time: item.time || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    formik.handleSubmit();
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingItem(null);
    formik.resetForm();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    formik.setValues({
      date: days[selectedDay]?.date || "",
      task: "",
      time: "",
    });
    setEditDialogOpen(true);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          direction: "rtl",
          p: { xs: 1, md: 4 },
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            my: 4,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: 2,
            p: { xs: 2, md: 4 },
          }}
        >
          {/* شريط الأيام */}
          <Tabs
            value={selectedDay}
            onChange={(_, v) => setSelectedDay(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              mb: 3,
              borderRadius: 2,
              background: "#f1f3f6",
              minHeight: 48,
              direction: "rtl",
            }}
            TabIndicatorProps={{
              style: { background: "#1976d2", height: 4, borderRadius: 2 },
            }}
          >
            {days.map((day, idx) => (
              <Tab
                key={day.date}
                label={day.label}
                sx={{
                  fontWeight: selectedDay === idx ? 700 : 500,
                  fontSize: 16,
                  fontFamily: "Cairo",
                  minHeight: 48,
                }}
              />
            ))}
          </Tabs>
          {/* عنوان اليوم */}
          <Typography
            variant="h6"
            align="center"
            fontWeight={700}
            mb={3}
            fontFamily="Cairo"
          >
            {days[selectedDay].label} 2024
          </Typography>

          {/* زر إضافة نشاط جديد (لجميع الأيام) */}
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handleAddNew}
              sx={{
                fontFamily: "Cairo",
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              إضافة نشاط جديد
            </Button>
          </Box>

          {/* جدول اليوم */}
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 1 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f3f6" }}>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, fontFamily: "Cairo" }}
                  >
                    النشاط
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, fontFamily: "Cairo" }}
                  >
                    الوقت
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, fontFamily: "Cairo" }}
                  >
                    تعديل
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, fontSize: 18, fontFamily: "Cairo" }}
                  >
                    حذف
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSchedule.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ backgroundColor: idx % 2 === 0 ? "#fafbfc" : "#fff" }}
                  >
                    <TableCell align="center" sx={{ fontSize: 16 }}>
                      {row.task || row.activity}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: 16 }}>
                      {row.time}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEditClick(row, idx)}
                        sx={{ color: "#1976d2" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => deleteSchedule(row.id)}
                        sx={{ color: "#1976d2" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* نافذة التعديل */}
        <Dialog
          open={editDialogOpen}
          onClose={handleEditCancel}
          maxWidth="sm"
          fullWidth
          disableEnforceFocus
          disableAutoFocus
          keepMounted={false}
          aria-labelledby="edit-dialog-title"
          aria-describedby="edit-dialog-description"
        >
          <DialogTitle
            id="edit-dialog-title"
            sx={{ fontFamily: "Cairo", fontWeight: 700, textAlign: "center" }}
          >
            {editingItem?.index === filteredSchedule.length
              ? "إضافة نشاط جديد"
              : "تعديل النشاط"}
          </DialogTitle>
          <DialogContent id="edit-dialog-description">
            <Box sx={{ mt: 2 }}>
              <TextField
                name="time"
                fullWidth
                label="الوقت"
                value={formik.values.time}
                onChange={(e) => formik.setFieldValue("time", e.target.value)}
                sx={{ mb: 2, fontFamily: "Cairo" }}
                placeholder="مثال: 08:00"
                autoFocus
              />
              <TextField
                name="activity"
                fullWidth
                label="النشاط"
                value={formik.values.task}
                onChange={(e) => formik.setFieldValue("task", e.target.value)}
                sx={{ fontFamily: "Cairo" }}
                placeholder="مثال: وجبة الإفطار"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={handleEditCancel}
              sx={{ fontFamily: "Cairo", fontWeight: 600 }}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              onClick={handleEditSave}
              variant="contained"
              sx={{
                fontFamily: "Cairo",
                fontWeight: 600,
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              حفظ
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
