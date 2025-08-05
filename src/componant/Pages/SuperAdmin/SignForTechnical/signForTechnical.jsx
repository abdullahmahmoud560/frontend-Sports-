"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./signForTechnical.css";

// Updated to match the new API structure for player registration
// API expects FormData with multiple players
// Each player should have:
// - PLayerName (string)
// - Nationality (string)
// - BirthDate (string)
// - Possition (string)
// - NumberShirt (string)
// - URLImage (file)
// - URLPassport (file)
// - category (string)
// Can send multiple players as FormData array

function SignForTechnical() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showTechnicalForm, setShowTechnicalForm] = useState(false);
  const [showMultiPlayerForm, setShowMultiPlayerForm] = useState(false);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [academyNameFromToken, setAcademyNameFromToken] = useState("");
  const [players, setPlayers] = useState([
    {
      id: 1,
      playerName: "",
      nationality: "",
      birthDate: "",
      position: "",
      numberShirt: "",
      urlImage: null,
      urlPassport: null,
      category: "",
    },
  ]);

  // Function to extract academy name from token
  const getAcademyNameFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.AcademyName || decoded.academyName || "";
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
    return "";
  };

  // Extract academy name from token on component mount
  useEffect(() => {
    const academyName = getAcademyNameFromToken();
    setAcademyNameFromToken(academyName);
    console.log("Academy name from token:", academyName);
  }, []);

  // Function to handle category selection and initialize players with selected category
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    setPlayers([
      {
        id: 1,
        playerName: "",
        nationality: "",
        birthDate: "",
        position: "",
        numberShirt: "",
        urlImage: null,
        urlPassport: null,
        category: category,
      },
    ]);
    setShowCategorySelection(false);
    setShowMultiPlayerForm(true);
  };

  // Validation schema for player registration
  const playerValidationSchema = Yup.object({
    playerName: Yup.string()
      .min(2, "اسم اللاعب يجب أن يكون على الأقل حرفين")
      .required("اسم اللاعب مطلوب"),
    nationality: Yup.string()
      .min(2, "الجنسية مطلوبة")
      .required("الجنسية مطلوبة"),
    birthDate: Yup.date()
      .max(new Date(), "تاريخ الميلاد لا يمكن أن يكون في المستقبل")
      .required("تاريخ الميلاد مطلوب"),
    position: Yup.string().required("المركز مطلوب"),
    numberShirt: Yup.string().required("رقم القميص مطلوب"),
    category: Yup.string().required("الفئة العمرية مطلوبة"),
    academyName: Yup.string().required("اسم الأكاديمية مطلوب"),
    urlImage: Yup.mixed().required("الصورة الشخصية مطلوبة"),
    urlPassport: Yup.mixed().required("صورة جواز السفر مطلوبة"),
  });

  // Validation schema for technical staff registration
  const technicalValidationSchema = Yup.object({
    FullName: Yup.string()
      .min(2, "الاسم الثلاثي يجب أن يكون على الأقل حرفين")
      .required("الاسم الثلاثي مطلوب"),
    attribute: Yup.string().required("الصفة مطلوبة"),
    URLImage: Yup.mixed().required("الصورة الشخصية مطلوبة"),
    URLPassport: Yup.mixed().required("صورة جواز السفر مطلوبة"),
  });

  // Player form formik
  const playerFormik = useFormik({
    initialValues: {
      playerName: "",
      nationality: "",
      birthDate: "",
      position: "",
      numberShirt: "",
      urlImage: null,
      urlPassport: null,
      category: "",
      academyName: "",
    },
    validationSchema: playerValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setIsLoading(true);
      console.log(values);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/Add-Players`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          setIsSuccess(true);
          resetForm();
          toast.success("تم تسجيل اللاعب بنجاح!");
          setShowPlayerForm(false);
        }
      } catch (error) {
        console.error("Player registration error:", error);
        toast.error("حدث خطأ أثناء تسجيل اللاعب");
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Technical staff form formik
  const technicalFormik = useFormik({
    initialValues: {
      FullName: "",
      attribute: "",
      URLImage: null,
      URLPassport: null,
    },
    validationSchema: technicalValidationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      console.log(values);

      setIsLoading(true);
      try {
        const formData = new FormData();
        
        // Add the basic fields
        formData.append("FullName", values.FullName);
        formData.append("attribute", values.attribute);
        
        // Add image files
        if (values.URLImage) {
          formData.append("URLImage", values.URLImage);
        }
        if (values.URLPassport) {
          formData.append("URLPassport", values.URLPassport);
        }
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/Add-Technical-administrative`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              // Don't set Content-Type - browser will set it automatically with boundary
            },
          }
        );

        if (response.status === 200) {
          setIsSuccess(true);
          resetForm();
          toast.success("تم تسجيل الجهاز الفني بنجاح!");
          setShowTechnicalForm(false);
        }
      } catch (error) {
        console.error("Technical staff registration error:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(`خطأ في الخادم: ${error.response.data}`);
        } else if (error.request) {
          console.error("Error request:", error.request);
          toast.error("خطأ في الاتصال بالخادم");
        } else {
          toast.error("حدث خطأ أثناء تسجيل الجهاز الفني");
        }
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Functions for multi-player management
  const addPlayer = () => {
    const newPlayer = {
      id: players.length + 1,
      playerName: "",
      nationality: "",
      birthDate: "",
      position: "",
      numberShirt: "",
      urlImage: null,
      urlPassport: null,
      category: selectedCategory, // Use the selected category
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (playerId) => {
    if (players.length > 1) {
      setPlayers(players.filter((player) => player.id !== playerId));
    }
  };

  const updatePlayer = (playerId, field, value) => {
    setPlayers(
      players.map((player) =>
        player.id === playerId ? { ...player, [field]: value } : player
      )
    );
  };

  const validateMultiPlayers = () => {
    for (let player of players) {
      console.log("Validating player:", player);
      
      // التحقق من البيانات النصية
      if (
        !player.playerName ||
        !player.nationality ||
        !player.birthDate ||
        !player.position ||
        !player.numberShirt ||
        !player.category
      ) {
        console.log("Text validation failed for player:", player);
        return false;
      }
      
      // التحقق من الصور - يجب أن تكون ملفات صالحة
      if (!player.urlImage || !(player.urlImage instanceof File)) {
        console.log("Image validation failed - urlImage:", player.urlImage);
        return false;
      }
      
      if (!player.urlPassport || !(player.urlPassport instanceof File)) {
        console.log("Passport validation failed - urlPassport:", player.urlPassport);
        return false;
      }
    }
    return true;
  };

  const submitMultiPlayers = async () => {
    // التحقق التفصيلي مع رسائل خطأ محددة
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      
      if (!player.playerName) {
        toast.error(`اللاعب ${i + 1}: يرجى إدخال اسم اللاعب`);
        return;
      }
      if (!player.nationality) {
        toast.error(`اللاعب ${i + 1}: يرجى إدخال الجنسية`);
        return;
      }
      if (!player.birthDate) {
        toast.error(`اللاعب ${i + 1}: يرجى إدخال تاريخ الميلاد`);
        return;
      }
      if (!player.position) {
        toast.error(`اللاعب ${i + 1}: يرجى إدخال المركز`);
        return;
      }
      if (!player.numberShirt) {
        toast.error(`اللاعب ${i + 1}: يرجى إدخال رقم القميص`);
        return;
      }
      if (!player.category) {
        toast.error(`اللاعب ${i + 1}: يرجى اختيار الفئة العمرية`);
        return;
      }
      if (!player.urlImage || !(player.urlImage instanceof File)) {
        toast.error(`اللاعب ${i + 1}: يرجى رفع الصورة الشخصية`);
        return;
      }
      if (!player.urlPassport || !(player.urlPassport instanceof File)) {
        toast.error(`اللاعب ${i + 1}: يرجى رفع صورة جواز السفر`);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Create FormData for each player
      const formDataArray = players.map((player, index) => {
        const formData = new FormData();
        
        // Add player data to FormData
        formData.append(`[${index}].PLayerName`, player.playerName);
        formData.append(`[${index}].Nationality`, player.nationality);
        formData.append(`[${index}].BirthDate`, player.birthDate);
        formData.append(`[${index}].Possition`, player.position);
        formData.append(`[${index}].NumberShirt`, player.numberShirt);
        formData.append(`[${index}].category`, player.category);
        
        // Add image files
        if (player.urlImage) {
          formData.append(`[${index}].URLImage`, player.urlImage);
        }
        if (player.urlPassport) {
          formData.append(`[${index}].URLPassport`, player.urlPassport);
        }
        
        return formData;
      });

      // Combine all FormData into one
      const combinedFormData = new FormData();
      
      players.forEach((player, index) => {
        combinedFormData.append(`[${index}].PLayerName`, player.playerName);
        combinedFormData.append(`[${index}].Nationality`, player.nationality);
        combinedFormData.append(`[${index}].BirthDate`, player.birthDate);
        combinedFormData.append(`[${index}].Possition`, player.position);
        combinedFormData.append(`[${index}].NumberShirt`, player.numberShirt);
        combinedFormData.append(`[${index}].category`, player.category);
        
        if (player.urlImage) {
          combinedFormData.append(`[${index}].URLImage`, player.urlImage);
        }
        if (player.urlPassport) {
          combinedFormData.append(`[${index}].URLPassport`, player.urlPassport);
        }
      });
      
      console.log("FormData to be sent:", combinedFormData);
      
      // Log FormData contents for debugging
      for (let [key, value] of combinedFormData.entries()) {
        console.log(`${key}:`, value);
      }

      // Send FormData
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Players`,
        combinedFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // Don't set Content-Type - browser will set it automatically with boundary
          },
        }
      );

      if (response.status === 200) {
        setIsSuccess(true);
        toast.success(`تم تسجيل ${players.length} لاعب بنجاح!`);
        setShowMultiPlayerForm(false);
        // Reset players array
        setPlayers([
          {
            id: 1,
            playerName: "",
            nationality: "",
            birthDate: "",
            position: "",
            numberShirt: "",
            urlImage: null,
            urlPassport: null,
            category: "",
          },
        ]);
        setSelectedCategory("");
        setShowCategorySelection(false);
      }
    } catch (error) {
      console.error("Multi-player registration error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`خطأ في الخادم: ${error.response.data}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("خطأ في الاتصال بالخادم");
      } else {
        toast.error("حدث خطأ أثناء تسجيل اللاعبين");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <div className="header-content">
          <h1 className="registration-title">
            <span className="title-icon">👥</span>
            تسجيل اللاعبين والجهاز الإداري والفني
          </h1>
          <p className="registration-description">
            اختر نوع التسجيل المطلوب وقم بملء البيانات المطلوبة
          </p>
        </div>
      </div>

      {/* Registration Type Selection */}
      <div className="registration-options">
        <div className="option-card">
          <div className="option-header">
            <span className="option-icon">👥</span>
            <h3>تسجيل متعدد اللاعبين</h3>
          </div>
          <p className="option-description">
            تسجيل أكثر من لاعب في نفس الوقت بكفاءة
          </p>
          <button
            className="option-btn primary"
                      onClick={() => {
            setShowCategorySelection(true);
            setShowPlayerForm(false);
            setShowTechnicalForm(false);
          }}
          >
            <span className="btn-icon">👥</span>
            تسجيل متعدد
          </button>
        </div>

        <div className="option-card">
          <div className="option-header">
            <span className="option-icon">👨‍💼</span>
            <h3>تسجيل الجهاز الفني والإداري</h3>
          </div>
          <p className="option-description">
            تسجيل بيانات الجهاز الفني والإداري
          </p>
          <button
            className="option-btn secondary"
            onClick={() => {
              setShowTechnicalForm(true);
              setShowPlayerForm(false);
              setShowMultiPlayerForm(false);
            }}
          >
            <span className="btn-icon">📝</span>
            ابدأ التسجيل
          </button>
        </div>
      </div>

      {/* Category Selection Modal */}
      {showCategorySelection && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                <span className="form-icon">🏆</span>
                اختر الفئة العمرية
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowCategorySelection(false)}
              >
                ×
              </button>
            </div>

            <div className="registration-form">
              <div className="form-section">
                {/* Academy Name Display */}
                {academyNameFromToken ? (
                  <div style={{ 
                    background: "#f0f9ff", 
                    border: "2px solid #0ea5e9", 
                    borderRadius: "12px", 
                    padding: "1rem", 
                    marginBottom: "2rem", 
                    textAlign: "center" 
                  }}>
                    <h3 style={{ color: "#0c4a6e", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                      🏫 الأكاديمية: {academyNameFromToken}
                    </h3>
                    <p style={{ color: "#0369a1", margin: 0, fontSize: "0.9rem" }}>
                      سيتم تسجيل اللاعبين تلقائياً تحت هذه الأكاديمية
                    </p>
                  </div>
                ) : (
                  <div style={{ 
                    background: "#fef2f2", 
                    border: "2px solid #ef4444", 
                    borderRadius: "12px", 
                    padding: "1rem", 
                    marginBottom: "2rem", 
                    textAlign: "center" 
                  }}>
                    <h3 style={{ color: "#991b1b", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                      ⚠️ تحذير: لم يتم العثور على اسم الأكاديمية
                    </h3>
                    <p style={{ color: "#dc2626", margin: 0, fontSize: "0.9rem" }}>
                      يرجى التأكد من أن التوكن يحتوي على اسم الأكاديمية
                    </p>
                  </div>
                )}
                
                <p className="section-description" style={{ textAlign: "center", marginBottom: "2rem", color: "#64748b" }}>
                  اختر الفئة العمرية المطلوب تسجيل اللاعبين بها
                </p>
                
                <div className="registration-options" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                  <div className="option-card" style={{ textAlign: "center" }}>
                    <div className="option-header">
                      <span className="option-icon" style={{ fontSize: "2rem" }}>🏃‍♂️</span>
                      <h3>تسجيل فئة 12</h3>
                    </div>
                    <p className="option-description">
                      تحت 12 سنة
                    </p>
                    <button
                      className="option-btn primary"
                      onClick={() => handleCategorySelection("U12")}
                      style={{ 
                        width: "100%",
                        opacity: !academyNameFromToken ? 0.6 : 1,
                        cursor: !academyNameFromToken ? "not-allowed" : "pointer"
                      }}
                      disabled={!academyNameFromToken}
                    >
                      <span className="btn-icon">🏆</span>
                      تسجيل فئة 12
                    </button>
                  </div>

                  <div className="option-card" style={{ textAlign: "center" }}>
                    <div className="option-header">
                      <span className="option-icon" style={{ fontSize: "2rem" }}>⚽</span>
                      <h3>تسجيل فئة 14</h3>
                    </div>
                    <p className="option-description">
                      تحت 14 سنة
                    </p>
                    <button
                      className="option-btn primary"
                      onClick={() => handleCategorySelection("U14")}
                      style={{ 
                        width: "100%",
                        opacity: !academyNameFromToken ? 0.6 : 1,
                        cursor: !academyNameFromToken ? "not-allowed" : "pointer"
                      }}
                      disabled={!academyNameFromToken}
                    >
                      <span className="btn-icon">🏆</span>
                      تسجيل فئة 14
                    </button>
                  </div>

                  <div className="option-card" style={{ textAlign: "center" }}>
                    <div className="option-header">
                      <span className="option-icon" style={{ fontSize: "2rem" }}>🥅</span>
                      <h3>تسجيل فئة 16</h3>
                    </div>
                    <p className="option-description">
                      تحت 16 سنة
                    </p>
                    <button
                      className="option-btn primary"
                      onClick={() => handleCategorySelection("U16")}
                      style={{ 
                        width: "100%",
                        opacity: !academyNameFromToken ? 0.6 : 1,
                        cursor: !academyNameFromToken ? "not-allowed" : "pointer"
                      }}
                      disabled={!academyNameFromToken}
                    >
                      <span className="btn-icon">🏆</span>
                      تسجيل فئة 16
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Player Registration Form */}

      {/* Multi-Player Registration Form */}
      {showMultiPlayerForm && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                <span className="form-icon">👥</span>
                تسجيل متعدد اللاعبين - {selectedCategory === "U12" ? "تحت 12 سنة" : selectedCategory === "U14" ? "تحت 14 سنة" : "تحت 16 سنة"}
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowMultiPlayerForm(false)}
              >
                ×
              </button>
            </div>
            
            {/* رسالة تأكيد المتطلبات */}
            <div style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              padding: "1rem",
              margin: "1rem 0",
              color: "#92400e"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                ⚠️ متطلبات التسجيل:
              </div>
              <ul style={{ margin: 0, paddingRight: "1.5rem" }}>
                <li>جميع الحقول المميزة بـ (*) إجبارية</li>
                <li>يجب رفع صورة شخصية لكل لاعب</li>
                <li>يجب رفع صورة جواز السفر لكل لاعب</li>
                <li>يجب التأكد من صحة جميع البيانات قبل التسجيل</li>
              </ul>
            </div>

            <div className="registration-form">
              <div className="form-section">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <h3 className="section-title">
                    <span className="section-icon">📋</span>
                    اللاعبين ({players.length})
                  </h3>
                  <button
                    type="button"
                    className="btn primary"
                    onClick={addPlayer}
                    style={{ minWidth: "auto", padding: "0.5rem 1rem" }}
                  >
                    <span className="btn-icon">➕</span>
                    إضافة لاعب
                  </button>
                </div>

                {players.map((player, index) => (
                  <div
                    key={player.id}
                    style={{
                      background: "#f8fafc",
                      border: "2px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      marginBottom: "1.5rem",
                      position: "relative",
                    }}
                  >
                    {/* Player Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <h4
                        style={{
                          color: "#1e293b",
                          margin: 0,
                          fontSize: "1.1rem",
                          fontWeight: "600",
                        }}
                      >
                        🏃‍♂️ اللاعب {index + 1}
                      </h4>
                      {players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(player.id)}
                          style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Basic Information */}
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">اسم اللاعب *</label>
                        <input
                          type="text"
                          value={player.playerName}
                          onChange={(e) =>
                            updatePlayer(
                              player.id,
                              "playerName",
                              e.target.value
                            )
                          }
                          placeholder="أدخل اسم اللاعب"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">الجنسية *</label>
                        <input
                          type="text"
                          value={player.nationality}
                          onChange={(e) =>
                            updatePlayer(
                              player.id,
                              "nationality",
                              e.target.value
                            )
                          }
                          placeholder="أدخل الجنسية"
                          className="form-input"
                        />
                      </div>



                      <div className="form-group">
                        <label className="form-label">تاريخ الميلاد *</label>
                        <input
                          type="date"
                          value={player.birthDate}
                          onChange={(e) =>
                            updatePlayer(player.id, "birthDate", e.target.value)
                          }
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">المركز *</label>
                        <select
                          value={player.position}
                          onChange={(e) =>
                            updatePlayer(player.id, "position", e.target.value)
                          }
                          className="form-input"
                        >
                          <option value="">اختر المركز</option>
                          <option value="حارس مرمى">حارس مرمى</option>
                          <option value="مدافع">مدافع</option>
                          <option value="لاعب وسط">لاعب وسط</option>
                          <option value="مهاجم">مهاجم</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">رقم القميص *</label>
                        <input
                          type="number"
                          value={player.numberShirt}
                          onChange={(e) =>
                            updatePlayer(
                              player.id,
                              "numberShirt",
                              e.target.value
                            )
                          }
                          placeholder="أدخل رقم القميص"
                          min="1"
                          max="99"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">الفئة العمرية *</label>
                        <input
                          type="text"
                          value={selectedCategory === "U12" ? "تحت 12 سنة" : selectedCategory === "U14" ? "تحت 14 سنة" : "تحت 16 سنة"}
                          className="form-input"
                          readOnly
                          style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}
                        />
                      </div>
                    </div>

                    {/* File Uploads */}
                    <div className="form-grid" style={{ marginTop: "1rem" }}>
                      <div className="form-group">
                        <label className="form-label">الصورة الشخصية *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updatePlayer(
                              player.id,
                              "urlImage",
                              e.target.files[0]
                            )
                          }
                          className="form-input"
                        />
                        {player.urlImage && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#059669" }}>
                            ✅ تم رفع الصورة: {player.urlImage.name}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">صورة جواز السفر *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updatePlayer(
                              player.id,
                              "urlPassport",
                              e.target.files[0]
                            )
                          }
                          className="form-input"
                        />
                        {player.urlPassport && (
                          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#059669" }}>
                            ✅ تم رفع الصورة: {player.urlPassport.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowMultiPlayerForm(false)}
                >
                  <span className="btn-icon">✖</span>
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={submitMultiPlayers}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      تسجيل {players.length} لاعب
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Staff Registration Form */}
      {showTechnicalForm && (
        <div className="form-modal">
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                <span className="form-icon">👨‍💼</span>
                تسجيل الجهاز الفني والإداري
              </h2>
              <button
                className="close-btn"
                onClick={() => setShowTechnicalForm(false)}
              >
                ×
              </button>
            </div>

            <form
              className="registration-form"
              onSubmit={technicalFormik.handleSubmit}
            >
              {/* رسالة تأكيد المتطلبات */}
              <div style={{
                background: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "8px",
                padding: "1rem",
                margin: "1rem 0",
                color: "#92400e"
              }}>
                <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  ⚠️ متطلبات التسجيل:
                </div>
                <ul style={{ margin: 0, paddingRight: "1.5rem" }}>
                  <li>جميع الحقول المميزة بـ (*) إجبارية</li>
                  <li>يجب رفع صورة شخصية للعضو</li>
                  <li>يجب رفع صورة جواز السفر للعضو</li>
                  <li>يجب التأكد من صحة جميع البيانات قبل التسجيل</li>
                </ul>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📋</span>
                  البيانات الأساسية
                </h3>

                {/* Academy Name Display */}
                {academyNameFromToken ? (
                  <div style={{ 
                    background: "#f0f9ff", 
                    border: "2px solid #0ea5e9", 
                    borderRadius: "12px", 
                    padding: "1rem", 
                    marginBottom: "2rem", 
                    textAlign: "center" 
                  }}>
                    <h3 style={{ color: "#0c4a6e", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                      🏫 الأكاديمية: {academyNameFromToken}
                    </h3>
                    <p style={{ color: "#0369a1", margin: 0, fontSize: "0.9rem" }}>
                      سيتم تسجيل العضو تلقائياً تحت هذه الأكاديمية
                    </p>
                  </div>
                ) : (
                  <div style={{ 
                    background: "#fef2f2", 
                    border: "2px solid #ef4444", 
                    borderRadius: "12px", 
                    padding: "1rem", 
                    marginBottom: "2rem", 
                    textAlign: "center" 
                  }}>
                    <h3 style={{ color: "#991b1b", margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                      ⚠️ تحذير: لم يتم العثور على اسم الأكاديمية
                    </h3>
                    <p style={{ color: "#dc2626", margin: 0, fontSize: "0.9rem" }}>
                      يرجى التأكد من أن التوكن يحتوي على اسم الأكاديمية
                    </p>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">الاسم الثلاثي *</label>
                    <input
                      type="text"
                      name="FullName"
                      value={technicalFormik.values.FullName}
                      onChange={technicalFormik.handleChange}
                      onBlur={technicalFormik.handleBlur}
                      placeholder="أدخل الاسم الثلاثي"
                      className={`form-input ${
                        technicalFormik.touched.FullName &&
                        technicalFormik.errors.FullName
                          ? "error"
                          : ""
                      }`}
                    />
                    {technicalFormik.touched.FullName &&
                      technicalFormik.errors.FullName && (
                        <div className="error-message">
                          {technicalFormik.errors.FullName}
                        </div>
                      )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">الصفة *</label>
                    <select
                      name="attribute"
                      value={technicalFormik.values.attribute}
                      onChange={technicalFormik.handleChange}
                      onBlur={technicalFormik.handleBlur}
                      className={`form-input ${
                        technicalFormik.touched.attribute &&
                        technicalFormik.errors.attribute
                          ? "error"
                          : ""
                      }`}
                    >
                      <option value="">اختر الصفة</option>
                      <option value="مدرب">مدرب</option>
                      <option value="مدرب مساعد">مدرب مساعد</option>
                      <option value="مدير إداري">مدير إداري</option>
                      <option value="أخصائي علاج طبيعي">
                        أخصائي علاج طبيعي
                      </option>
                      <option value="طبيب">طبيب</option>
                      <option value="مدير فني">مدير فني</option>
                    </select>
                    {technicalFormik.touched.attribute &&
                      technicalFormik.errors.attribute && (
                        <div className="error-message">
                          {technicalFormik.errors.attribute}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">
                  <span className="section-icon">📷</span>
                  الوثائق المطلوبة
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">الصورة الشخصية *</label>
                    <div className="file-upload-area">
                      <input
                        type="file"
                        name="URLImage"
                        accept="image/*"
                        onChange={(event) => {
                          technicalFormik.setFieldValue(
                            "URLImage",
                            event.currentTarget.files[0]
                          );
                        }}
                        className="file-input"
                        id="URLImage"
                      />
                      <label htmlFor="URLImage" className="file-label">
                        <span className="file-icon">📷</span>
                        <span className="file-text">اختر الصورة الشخصية</span>
                      </label>
                    </div>
                    {technicalFormik.touched.URLImage &&
                      technicalFormik.errors.URLImage && (
                        <div className="error-message">
                          {technicalFormik.errors.URLImage}
                        </div>
                      )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">صورة جواز السفر *</label>
                </div>
                <div className="file-upload-area">
                  <input
                    type="file"
                    name="URLPassport"
                    accept="image/*"
                    onChange={(event) => {
                      technicalFormik.setFieldValue(
                        "URLPassport",
                        event.currentTarget.files[0]
                      );
                    }}
                    className="file-input"
                    id="URLPassport"
                  />
                  <label htmlFor="URLPassport" className="file-label">
                    <span className="file-icon">📷</span>
                    <span className="file-text">اختر صورة جواز السفر</span>
                  </label>
                </div>
                {technicalFormik.touched.URLPassport &&
                  technicalFormik.errors.URLPassport && (
                    <div className="error-message">
                      {technicalFormik.errors.URLPassport}
                    </div>
                  )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowTechnicalForm(false)}
                >
                  <span className="btn-icon">✖</span>
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={isLoading || technicalFormik.isSubmitting || !academyNameFromToken}
                  style={{ 
                    opacity: !academyNameFromToken ? 0.6 : 1,
                    cursor: !academyNameFromToken ? "not-allowed" : "pointer"
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      تسجيل العضو
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="success-message">
          <div className="success-content">
            <span className="success-icon">✅</span>
            <h3>تم التسجيل بنجاح!</h3>
            <p>تم حفظ البيانات بنجاح في النظام</p>
            <button className="btn primary" onClick={() => setIsSuccess(false)}>
              موافق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignForTechnical;
