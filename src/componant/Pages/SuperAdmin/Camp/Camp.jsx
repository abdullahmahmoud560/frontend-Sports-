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
import { jwtDecode } from "jwt-decode";

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
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPopulating, setIsPopulating] = useState(false);

  const addSchedule = async (values) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Camps`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Refresh the schedule after adding
      fetchSchedule();
      handleEditCancel();
    } catch (error) {
      console.error("Error adding schedule:", error);
    }
  };

  const deleteSchedule = async (id) => {
    try {
      await axios.delete(
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
      await axios.post(
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

  // Function to populate all days with sample schedule data
  const populateAllDaysWithData = async () => {
    if (!isAdmin) {
      alert("هذه الميزة متاحة للمدراء فقط. يمكنك عرض الجدول ولكن لا يمكنك إضافة أو تعديل البيانات.");
      return;
    }

    setIsPopulating(true);
    
    // Define schedules for different days based on the camp schedule
    const getScheduleForDay = (date) => {
      const commonSchedule = [
        { time: "صلاة الفجر 4:10 ص", task: "صلاة الفجر" },
        { time: "وجبة الإفطار", task: "وجبة الإفطار" },
        { time: "راحة", task: "راحة" }
      ];

      const endSchedule = [
        { time: "صلاة الظهر 12:30 م", task: "صلاة الظهر" },
        { time: "وجبة الغداء", task: "وجبة الغداء" },
        { time: "راحة", task: "راحة" },
        { time: "صلاة العصر 3:50 م", task: "صلاة العصر" },
        { time: "وجبة الغداء", task: "وجبة الغداء" }
      ];

      // Specific activities for different days
      let middleActivities = [];
      
      switch(date) {
        case "2024-07-08": // الثلاثاء 8 يوليو
          middleActivities = [
            { time: "تدريب في الصالة الرياضية (9:00 إلى 9:45 ص) فئة 14", task: "تدريب في الصالة الرياضية فئة 14" },
            { time: "تدريب في الصالة الرياضية (9:45 إلى 10:30 ص) فئة 12", task: "تدريب في الصالة الرياضية فئة 12" },
            { time: "بطولة الألعاب الإلكترونية الأكاديمية الرياضية الساعة 11:00 صباحاً", task: "بطولة الألعاب الإلكترونية" }
          ];
          break;
        case "2024-07-09": // الأربعاء 9 يوليو  
          middleActivities = [
            { time: "دورة تدريبية للمدربين 9:00 صباحاً حتى 1:00 ظهراً", task: "دورة تدريبية للمدربين" }
          ];
          break;
        case "2024-07-10": // الخميس 10 يوليو
          middleActivities = [
            { time: "بطولة الألعاب الإلكترونية الأدوار النهائية", task: "بطولة الألعاب الإلكترونية - الأدوار النهائية" }
          ];
          break;
        case "2024-07-11": // الجمعة 11 يوليو
          middleActivities = [
            { time: "نشاط جماعي بطولة الشاطئ والحديقة", task: "نشاط جماعي - بطولة الشاطئ" },
            { time: "ويل تال دوري مباشر الأكاديميات المحلية", task: "دوري الأكاديميات المحلية" }
          ];
          break;
        case "2024-07-12": // السبت 12 يوليو
          middleActivities = [
            { time: "مباريات تحديد المركز", task: "مباريات تحديد المركز" },
            { time: "إجلال لبرقة المتألقة الجولة النهائية", task: "الجولة النهائية" }
          ];
          break;
        case "2024-07-13": // الأحد 13 يوليو
          middleActivities = [
            { time: "مباراة (فئة 12 سنة) أكاديمية أولف & أكاديمية سعود الساعة 5:50", task: "مباراة فئة 12 سنة" },
            { time: "مباراة (فئة 14 سنة) أكاديمية المين & أكاديمية سعود الساعة 7:30", task: "مباراة فئة 14 سنة" }
          ];
          break;
        case "2024-07-14": // الاثنين 14 يوليو
          middleActivities = [
            { time: "بطولة الألعاب الإلكترونية الأكاديمية الرياضية الساعة 11:00 صباحاً", task: "بطولة الألعاب الإلكترونية" },
            { time: "مباراة (فئة 12 سنة) أكاديمية أولف & أكاديمية ساود الساعة 5:50", task: "مباراة فئة 12 سنة" },
            { time: "مباراة (فئة 14 سنة) أكاديمية المين & أكاديمية ساود الساعة 7:30", task: "مباراة فئة 14 سنة" }
          ];
          break;
        case "2024-07-15": // الثلاثاء 15 يوليو
          middleActivities = [
            { time: "التوجه إلى مطار الشارقة الساعة 11:10 صباحاً", task: "التوجه إلى المطار" },
            { time: "رحلة للكويت رقم G9-102", task: "رحلة العودة للكويت" }
          ];
          break;
        default:
          middleActivities = [
            { time: "نشاط حر", task: "نشاط حر" }
          ];
      }

      return [...commonSchedule, ...middleActivities, ...endSchedule];
    };

    try {
      console.log("Starting to populate all days with data...");
      
      for (const day of days) {
        console.log(`Adding schedule for ${day.label} (${day.date})`);
        
        const daySchedule = getScheduleForDay(day.date);
        
        for (const scheduleItem of daySchedule) {
          const payload = {
            date: day.date,
            time: scheduleItem.time,
            task: scheduleItem.task,
          };
          
          console.log("Sending payload:", payload);
          
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/Add-Camps`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          
          console.log("Response:", response.data);
        }
      }
      
      console.log("All data populated successfully");
      alert("تم إدراج البيانات لجميع الأيام بنجاح!");
      fetchSchedule();
    } catch (error) {
      console.error("Error populating schedule:", error);
      alert(`حدث خطأ أثناء إدراج البيانات: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsPopulating(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      date: days[selectedDay]?.date || "",
      task: "",
      time: "",
    },
    onSubmit: editingItem ? updateSchedule : addSchedule,
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
      setSchedule(response.data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.Role);
        setIsAdmin(decoded.Role === "admin");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    console.clear();
    fetchSchedule();
  }, []);

  // Update formik date when selected day changes
  useEffect(() => {
    formik.setFieldValue("date", days[selectedDay]?.date || "");
  }, [selectedDay]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!isAdmin) {
      alert("هذه الميزة متاحة للمدراء فقط. يمكنك عرض الجدول ولكن لا يمكنك إضافة أو تعديل البيانات.");
      return;
    }
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
            mb={1}
            fontFamily="Cairo"
          >
            {days[selectedDay].label} 2024
          </Typography>

          {/* مؤشر دور المستخدم */}
          {userRole && (
            <Typography
              variant="body2"
              align="center"
              mb={2}
              sx={{
                color: isAdmin ? "#4caf50" : "#ff9800",
                fontFamily: "Cairo",
                fontWeight: 600,
                bgcolor: isAdmin ? "#e8f5e8" : "#fff3e0",
                py: 0.5,
                px: 2,
                borderRadius: 1,
                display: "inline-block",
                width: "fit-content",
                margin: "0 auto 16px auto"
              }}
            >
              {isAdmin ? "مشرف - يمكن التعديل والحذف والإضافة" : `${userRole} - يمكن عرض الجدول فقط`}
            </Typography>
          )}

          {/* أزرار الإجراءات */}
          <Box sx={{ mb: 2, textAlign: "center", display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleAddNew}
              disabled={!isAdmin}
              sx={{
                fontFamily: "Cairo",
                fontWeight: 600,
                backgroundColor: isAdmin ? "#1976d2" : "#ccc",
                color: isAdmin ? "white" : "#666",
                cursor: isAdmin ? "pointer" : "not-allowed",
                "&:hover": { 
                  backgroundColor: isAdmin ? "#1565c0" : "#ccc"
                },
              }}
            >
              {isAdmin ? "إضافة نشاط جديد" : "إضافة نشاط (مدراء فقط)"}
            </Button>
            
            <Button
              variant="outlined"
              onClick={populateAllDaysWithData}
              disabled={isPopulating || !isAdmin}
              sx={{
                fontFamily: "Cairo",
                fontWeight: 600,
                borderColor: isPopulating ? "#ccc" : !isAdmin ? "#ff9800" : "#4caf50",
                color: isPopulating ? "#ccc" : !isAdmin ? "#ff9800" : "#4caf50",
                "&:hover": { 
                  backgroundColor: isPopulating ? "transparent" : !isAdmin ? "#fff3e0" : "#4caf50",
                  color: isPopulating ? "#ccc" : !isAdmin ? "#ff9800" : "white",
                  borderColor: isPopulating ? "#ccc" : !isAdmin ? "#ff9800" : "#4caf50"
                },
              }}
            >
              {isPopulating ? "جاري الإدراج..." : !isAdmin ? "ملء البيانات (مدراء فقط)" : "ملء جميع الأيام بالبيانات"}
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
                        sx={{ 
                          color: isAdmin ? "#1976d2" : "#ccc",
                          cursor: isAdmin ? "pointer" : "not-allowed"
                        }}
                        disabled={!isAdmin}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => deleteSchedule(row.id)}
                        sx={{ 
                          color: isAdmin ? "#d32f2f" : "#ccc",
                          cursor: isAdmin ? "pointer" : "not-allowed"
                        }}
                        disabled={!isAdmin}
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
            {editingItem ? "تعديل النشاط" : "إضافة نشاط جديد"}
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
