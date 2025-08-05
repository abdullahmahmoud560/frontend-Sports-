import React, { useEffect, useState } from "react";
import "./Players.css";
import { useFormik } from "formik";
import axios from "axios";

const positions = [
  "مهاجم",
  "وسط",
  "مدافع",
  "حارس مرمى",
  "ظهير أيسر",
  "ظهير أيمن",
  "جناح",
  "صانع ألعاب",
  "اختر المركز",
];

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showPassport, setShowPassport] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [showPlayerImage, setShowPlayerImage] = useState(false);
  const [selectedPlayerImage, setSelectedPlayerImage] = useState(null);
  const [categoriesPlayers, setCategoriesPlayers] = useState([]);

  
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Get-Categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCategoriesPlayers(response.data);
      } catch (error) {
        // Error handling
      }
    };
  


  const allPlayers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Player-By-Id`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPlayers(response.data);
    } catch (error) {
      // Error handling
    }
  };

  const addPlayer = async () => {
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.keys(addPlayerFormik.values).forEach((key) => {
        if (
          addPlayerFormik.values[key] !== null &&
          addPlayerFormik.values[key] !== undefined
        ) {
          if (key === "URLImage " || key === "URLPassport ") {
            if (addPlayerFormik.values[key]) {
              formData.append(key, addPlayerFormik.values[key]);
            }
          } else {
            formData.append(key, addPlayerFormik.values[key]);
          }
        }
      });
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Players`,
        addPlayerFormik.values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      allPlayers();
      onCloseAdd();
    } catch (error) {
      // Error handling
    }
  };

  const editPlayer = async (values) => {
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.keys(values).forEach((key) => {
        if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          if (key === "URLImage" || key === "URLPassport") {
            if (values[key]) {
              formData.append(key, values[key]);
            }
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Update-Player/${editingPlayer.playerID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      allPlayers();
      onCloseEdit();
    } catch (error) {
      // Error handling
    }
  };

  const deletePlayer = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/Delete-Player/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      allPlayers();
    } catch (error) {
      // Error handling
    }
  };

  const handleEditClick = (player) => {
    setEditingPlayer(player);
    // Pre-fill the edit form with player data
    editPlayerFormik.setValues({
      pLayerName: player.pLayerName || "",
      academyName: player.academyName || "",
      category: player.category || "",
      possition: player.possition || "",
      numberShirt: player.numberShirt || "",
      nationality: player.nationality || "",
      birthDate: player.birthDate || "",
      URLImage: null,
      URLPassport: null,
    });
    setShowEdit(true);
  };

  const handlePassportClick = (player) => {
    setSelectedPassport(player.urlPassport);
    setShowPassport(true);
  };

  const handlePlayerImageClick = (player) => {
    setSelectedPlayerImage(player.urlImage);
    setShowPlayerImage(true);
  };

  const onCloseAdd = () => {
    setShowAdd(false);
    addPlayerFormik.resetForm();
  };

  const onCloseEdit = () => {
    setShowEdit(false);
    setEditingPlayer(null);
    editPlayerFormik.resetForm();
  };

  const onClosePassport = () => {
    setShowPassport(false);
    setSelectedPassport(null);
  };

  const onClosePlayerImage = () => {
    setShowPlayerImage(false);
    setSelectedPlayerImage(null);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filtered = players.filter((player) => player.category === category);
    setFilteredPlayers(filtered);
  };

  const handleAddPlayerToCategory = (category) => {
    setSelectedCategory(category);
    addPlayerFormik.setFieldValue("category", category);
    setShowAdd(true);
  };

  useEffect(() => {
    allPlayers();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = players.filter(
        (player) => player.category === selectedCategory
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [players, selectedCategory]);

  const addPlayerFormik = useFormik({
    initialValues: {
      pLayerName: "",
      nationality: "",
      birthDate: "",
      category: "",
      possition: "",
      numberShirt: "",
      URLImage: null,
      URLPassport: null,
    },
    onSubmit: addPlayer,
  });

  const editPlayerFormik = useFormik({
    initialValues: {
      pLayerName: "",
      academyName: "",
      category: "",
      possition: "",
      numberShirt: "",
      goals: "",
      yellowCards: "",
      redCards: "",
      nationality: "",
      birthDate: "",
      URLImage: null,
      URLPassport: null,
    },
    onSubmit: editPlayer,
  });

  const categories = ["12", "14", "16"];

  return (
    <div className="players-page">
      {/* Cards for Age Categories */}
      <div className="categories-container">
        {categoriesPlayers.map((category) => (
          <>
            {category.under12 && (
              <div
                key="12"
                className={`category-card ${selectedCategory === "12" ? "active" : ""}`}
                onClick={() => handleCategoryClick("12")}
              >
                <div className="category-header">
                  <h3 className="category-title">فئة 12 سنة</h3>
                  <div className="player-count">
                    {players.filter((player) => player.category === "12").length}{" "}
                    لاعب
                  </div>
                </div>
                <div className="category-actions">
                  <button
                    className="add-player-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddPlayerToCategory("12");
                    }}
                  >
                    إضافة لاعب +
                  </button>
                </div>
              </div>
            )}

            {category.under14 && (
              <div
                key="14" 
                className={`category-card ${selectedCategory === "14" ? "active" : ""}`}
                onClick={() => handleCategoryClick("14")}
              >
                <div className="category-header">
                  <h3 className="category-title">فئة 14 سنة</h3>
                  <div className="player-count">
                    {players.filter((player) => player.category === "14").length}{" "}
                    لاعب
                  </div>
                </div>
                <div className="category-actions">
                  <button
                    className="add-player-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddPlayerToCategory("14");
                    }}
                  >
                    إضافة لاعب +
                  </button>
                </div>
              </div>
            )}

            {category.under16 && (
              <div
                key="16"
                className={`category-card ${selectedCategory === "16" ? "active" : ""}`}
                onClick={() => handleCategoryClick("16")}
              >
                <div className="category-header">
                  <h3 className="category-title">فئة 16 سنة</h3>
                  <div className="player-count">
                    {players.filter((player) => player.category === "16").length}{" "}
                    لاعب
                  </div>
                </div>
                <div className="category-actions">
                  <button
                    className="add-player-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddPlayerToCategory("16");
                    }}
                  >
                    إضافة لاعب +
                  </button>
                </div>
              </div>
            )}
          </>
        ))}

        {/* {categories.map((category) => (
          <>
          <div
            key={category}
            className={`category-card ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-header">
              <h3 className="category-title">فئة {category} سنة</h3>
              <div className="player-count">
                {
                  players.filter((player) => player.category === category)
                    .length
                }{" "}
                لاعب
              </div>
            </div>
            <div className="category-actions">
              <button
                className="add-player-category-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddPlayerToCategory(category);
                }}
              >
                إضافة لاعب +
              </button>
            </div>
          </div>
          </>
        ))} */}
      </div>

      {/* Players Cards for Selected Category */}
      {selectedCategory && (
        <div className="selected-category-section">
          <div className="category-header-section">
            <h2 className="selected-category-title">
              لاعبي فئة {selectedCategory} سنة
            </h2>
            <button
              className="add-player-btn"
              onClick={() => handleAddPlayerToCategory(selectedCategory)}
            >
              إضافة لاعب جديد +
            </button>
          </div>

          <div className="players-cards-container">
            {filteredPlayers.map((player, idx) => (
              <div key={idx} className="player-card">
                <div className="player-image-container">
                  <img
                    src={player.urlImage || "/default-player.png"}
                    alt={player.pLayerName}
                    className="player-image"
                    onError={(e) => {
                      e.target.src = "/default-player.png";
                    }}
                  />
                  <div className="player-number">{player.numberShirt}</div>
                </div>

                <div className="player-info">
                  <h3 className="player-name">{player.pLayerName}</h3>
                  <div className="player-details">
                    <div className="detail-item">
                      <span className="detail-label">الأكاديمية:</span>
                      <span className="detail-value">{player.academyName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">المركز:</span>
                      <span className="detail-value">{player.possition}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">الجنسية:</span>
                      <span className="detail-value">{player.nationality}</span>
                    </div>
                  </div>

                  <div className="player-stats">
                    <div className="stat-item">
                      <span className="stat-label">رقم القميص</span>
                      <span className="stat-value goals">
                        {player.numberShirt || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">المركز</span>
                      <span className="stat-value goals">
                        {player.possition || 0}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">تاريخ الميلاد</span>
                      <span className="stat-value red-cards">
                        {player.birthDate || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="player-actions">
                  <button
                    className="action-btn image-btn"
                    onClick={() => handlePlayerImageClick(player)}
                    title="عرض صورة اللاعب"
                  >
                    <i className="fas fa-image"></i>
                    عرض الصورة
                  </button>
                  <button
                    className="action-btn passport-btn"
                    onClick={() => handlePassportClick(player)}
                    title="عرض الباسبور"
                  >
                    <i className="fas fa-passport"></i>
                    عرض الباسبور
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditClick(player)}
                    title="تعديل"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deletePlayer(player.playerID)}
                    title="حذف"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header bg-[#ef4343]">
              <span className="text-white bg-[#ef4343] p-2 rounded-md">
                إضافة لاعب جديد - فئة {selectedCategory} سنة
              </span>
              <button className="close-btn" onClick={onCloseAdd}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={addPlayerFormik.handleSubmit}
            >
              <div className="form-row">
                <input
                  className={`form-input ${
                    !addPlayerFormik.values.pLayerName ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="اسم اللاعب"
                  value={addPlayerFormik.values.pLayerName}
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("pLayerName", e.target.value)
                  }
                  required
                />
                <label>اسم اللاعب *</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الجنسية"
                  value={addPlayerFormik.values.nationality}
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("nationality", e.target.value)
                  }
                  required
                />
                <label>الجنسية *</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="date"
                  value={addPlayerFormik.values.birthDate}
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("birthDate", e.target.value)
                  }
                  required
                />
                <label>تاريخ الميلاد *</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  value={addPlayerFormik.values.category}
                  disabled
                />
                <label>الفئة</label>
              </div>

              <div className="form-row">
                <select
                  className="form-input"
                  value={addPlayerFormik.values.possition}
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("possition", e.target.value)
                  }
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                <label>المركز (اختياري)</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="رقم القميص"
                  value={addPlayerFormik.values.numberShirt}
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("numberShirt", e.target.value)
                  }
                  required
                />
                <label>رقم القميص *</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue("URLImage", e.target.files[0])
                  }
                />
                <label>صورة اللاعب</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    addPlayerFormik.setFieldValue(
                      "URLPassport",
                      e.target.files[0]
                    )
                  }
                />
                <label>جواز السفر</label>
              </div>

              <button className="update-btn" type="submit">
                إضافة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Player Image Modal */}
      {showPlayerImage && (
        <div className="modal-overlay">
          <div className="modal-content image-modal">
            <div className="modal-header">
              <span>عرض صورة اللاعب</span>
              <button className="close-btn" onClick={onClosePlayerImage}>
                ×
              </button>
            </div>
            <div className="image-content">
              {selectedPlayerImage ? (
                <img
                  src={selectedPlayerImage}
                  alt="صورة اللاعب"
                  className="player-detail-image"
                  onError={(e) => {
                    e.target.src = "/default-player.png";
                  }}
                />
              ) : (
                <div className="no-image">
                  <i className="fas fa-image"></i>
                  <p>لا توجد صورة متاحة</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Passport Modal */}
      {showPassport && (
        <div className="modal-overlay">
          <div className="modal-content passport-modal">
            <div className="modal-header">
              <span>عرض جواز السفر</span>
              <button className="close-btn" onClick={onClosePassport}>
                ×
              </button>
            </div>
            <div className="passport-content">
              {selectedPassport ? (
                <img
                  src={selectedPassport}
                  alt="جواز السفر"
                  className="passport-image"
                  onError={(e) => {
                    e.target.src = "/default-passport.png";
                  }}
                />
              ) : (
                <div className="no-passport">
                  <i className="fas fa-passport"></i>
                  <p>لا يوجد جواز سفر متاح</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Edit Player Modal */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <span>تعديل بيانات لاعب</span>
              <button className="close-btn" onClick={onCloseEdit}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={editPlayerFormik.handleSubmit}
            >
              {/* Current Images Section */}
              <div className="current-images-section">
                <div className="current-image-item">
                  <h4>الصورة الحالية:</h4>
                  <img
                    src={editingPlayer?.urlImage || "/default-player.png"}
                    alt="الصورة الحالية"
                    className="current-image-preview"
                    onError={(e) => {
                      e.target.src = "/default-player.png";
                    }}
                  />
                </div>
                <div className="current-image-item">
                  <h4>صورة الباسبور الحالية:</h4>
                  <img
                    src={editingPlayer?.urlPassport || "/default-passport.png"}
                    alt="صورة الباسبور الحالية"
                    className="current-image-preview"
                    onError={(e) => {
                      e.target.src = "/default-passport.png";
                    }}
                  />
                </div>
              </div>

              {/* Player Information Fields */}
              <div className="form-row">
                <input
                  className={`form-input ${
                    !editPlayerFormik.values.pLayerName ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="اسم اللاعب"
                  value={editPlayerFormik.values.pLayerName}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("pLayerName", e.target.value)
                  }
                  required
                />
                <label>اسم اللاعب</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الأكاديمية"
                  value={editPlayerFormik.values.academyName}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "academyName",
                      e.target.value
                    )
                  }
                  required
                />
                <label>الأكاديمية</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="date"
                  value={editPlayerFormik.values.birthDate}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("birthDate", e.target.value)
                  }
                />
                <label>تاريخ الميلاد</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="المركز"
                  value={editPlayerFormik.values.possition}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("possition", e.target.value)
                  }
                  required
                />
                <label>المركز</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="رقم القميص"
                  value={editPlayerFormik.values.numberShirt}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "numberShirt",
                      e.target.value
                    )
                  }
                  required
                />
                <label>رقم القميص</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الجنسية"
                  value={editPlayerFormik.values.nationality}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "nationality",
                      e.target.value
                    )
                  }
                />
                <label>الجنسية</label>
              </div>

              {/* Image Upload Fields */}
              <div className="form-row">
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "URLImage",
                      e.target.files[0]
                    )
                  }
                />
                <label>تعديل صورة اللاعب</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "URLPassport",
                      e.target.files[0]
                    )
                  }
                />
                <label>تعديل صورة الباسبور</label>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  className="update-btn"
                  style={{ background: "#eee", color: "#222" }}
                  onClick={onCloseEdit}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="update-btn"
                  style={{ background: "#2563eb" }}
                >
                  تعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;