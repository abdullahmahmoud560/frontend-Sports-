import React, { useState, useEffect } from "react";
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

const EditPlayerModal = ({ show, onClose, player, onChange, onUpdate }) => {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span>تعديل بيانات لاعب</span>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form className="edit-player-form" onSubmit={onUpdate}>
          <div className="form-row">
            <input
              className={`form-input ${!player.name ? "input-error" : ""}`}
              type="text"
              placeholder="اسم اللاعب"
              value={player.name}
              onChange={(e) => onChange({ ...player, name: e.target.value })}
              required
            />
            <label>اسم اللاعب</label>
          </div>
          <div className="form-row">
            <select
              className="form-input"
              value={player.academy}
              onChange={(e) => onChange({ ...player, academy: e.target.value })}
            >
              <option value="">اختر الأكاديمية</option>
              <option value="ttt">ttt</option>
              <option value="hjhjhj">hjhjhj</option>
            </select>
            <label>الأكاديمية</label>
          </div>
          <div className="form-row">
            <select
              className="form-input"
              value={player.category}
              onChange={(e) =>
                onChange({ ...player, category: e.target.value })
              }
            >
              <option value="">اختر الفئة</option>
              <option value="تحت 16 سنة">تحت 16 سنة</option>
              <option value="ظهير أيسر">ظهير أيسر</option>
            </select>
            <label>الفئة</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="date"
              value={player.birthDate}
              onChange={(e) =>
                onChange({ ...player, birthDate: e.target.value })
              }
            />
            <label>تاريخ الميلاد</label>
          </div>
          <div className="form-row">
            <select
              className="form-input"
              value={player.position}
              onChange={(e) =>
                onChange({ ...player, position: e.target.value })
              }
            >
              <option value="">اختر المركز</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <label>المركز</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="number"
              placeholder="رقم القميص"
              value={player.shirtNumber}
              onChange={(e) =>
                onChange({ ...player, shirtNumber: e.target.value })
              }
            />
            <label>رقم القميص</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="number"
              placeholder="الأهداف"
              value={player.goals}
              onChange={(e) => onChange({ ...player, goals: e.target.value })}
            />
            <label>الأهداف</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="number"
              placeholder="البطاقات الصفراء"
              value={player.yellowCards}
              onChange={(e) =>
                onChange({ ...player, yellowCards: e.target.value })
              }
            />
            <label>البطاقات الصفراء</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="number"
              placeholder="البطاقات الحمراء"
              value={player.redCards}
              onChange={(e) =>
                onChange({ ...player, redCards: e.target.value })
              }
            />
            <label>البطاقات الحمراء</label>
          </div>
          <div className="form-row">
            <input
              className="form-input"
              type="text"
              placeholder="الجنسية"
              value={player.nationality}
              onChange={(e) =>
                onChange({ ...player, nationality: e.target.value })
              }
            />
            <label>الجنسية</label>
          </div>
          <button className="update-btn" type="submit">
            تحديث
          </button>
        </form>
      </div>
    </div>
  );
};

const MangeMatches = () => {
  const [players, setPlayers] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [id, setId] = useState(null);
  // Fetch players from API
  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Matches-By-Academy `,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPlayers(response.data);
    } catch (error) {
      // Fallback to static data if API fails
    }
  };

  const addMatch = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Match`,
        addMatchFormik.values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPlayers();
      onCloseAdd();
    } catch (error) {
      // Error handling
    }
  };

  const editPlayer = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Update-Match/${id}`,
        editPlayerFormik.values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPlayers();

    } catch (error) {
      // Error handling
    }
  };

  const deletePlayer = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/Delete-Match/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPlayers();
    } catch (error) {
      // Error handling
    }
  };

  const handleEditClick = (player) => {
    setEditingPlayer(player)
    setId(player.id);
    // Pre-fill the edit form with player data
    editPlayerFormik.setValues({
      Category: player.category || "",
      HomeTeamName: player.homeTeamName || "",
      AwayTeamName: player.awayTeamName || "",
      Date: player.date || "",
      Time: player.time || "",
      Stadium: player.stadium || "",
      MatchStatus: player.matchStatus || "",
      HomeTeamScore: player.homeTeamScore || "",
      AwayTeamScore: player.awayTeamScore || "",
    });
    setShowEdit(true);
  };

  const onCloseAdd = () => {
    setShowAdd(false);
    addMatchFormik.resetForm();
  };

  const onCloseEdit = () => {
    setShowEdit(false);
    setEditingPlayer(null);
    editPlayerFormik.resetForm();
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const addMatchFormik = useFormik({
    initialValues: {
      Category: "",
      HomeTeamName: "",
      AwayTeamName: "",
      Date: "",
      Time: "",
      Stadium: "",
      MatchStatus: "",
      HomeTeamScore: "",
      AwayTeamScore: "",
    },
    onSubmit: addMatch,
  });

  const editPlayerFormik = useFormik({
    initialValues: {
      Category: "",
      HomeTeamName: "",
      AwayTeamName: "",
      Date: "",
      Time: "",
      Stadium: "",
      MatchStatus: "",
      HomeTeamScore: "",
      AwayTeamScore: "",
    },
    onSubmit: editPlayer,
  });

  return (
    <div className="players-page">
      {/* زر إضافة لاعب */}
      <div className="header-bar">
        <button className="add-player-btn" onClick={() => setShowAdd(true)}>
          إضافة مباراة +
        </button>
      </div>

      {/* الفلاتر وحقل البحث */}
      <div className="filters-bar">
        <select className="filter-select">
          <option>جميع الأكاديميات</option>
        </select>
        <select className="filter-select">
          <option>جميع الفئات</option>
        </select>
        <select className="filter-select">
          <option>تصفية حسب الأكاديمية</option>
        </select>
        <select className="filter-select">
          <option>تصفية حسب الفئة</option>
        </select>
        <input className="search-input" placeholder="ابحث باسم الفريق" />
      </div>

      {/* نافذة إضافة لاعب جديد */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>إضافة مباراة جديدة</span>
              <button className="close-btn" onClick={onCloseAdd}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={addMatchFormik.handleSubmit}
            >
              <div className="form-row">
                <select
                  className={`form-input ${
                    !addMatchFormik.values.Category ? "input-error" : ""
                  }`}
                  value={addMatchFormik.values.Category}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("Category", e.target.value)
                  }
                  required
                >
                  <option value="">اختر الفئة العمرية</option>
                  <option value="U12">فئة 12</option>
                  <option value="U14">فئة 14</option>
                  <option value="U16">فئة 16</option>
                </select>
                <label>الفئة العمرية</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الملعب"
                  value={addMatchFormik.values.Stadium}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("Stadium", e.target.value)
                  }
                  required
                />
                <label>الملعب</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الفريق المنزلي"
                  value={addMatchFormik.values.HomeTeamName}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("HomeTeamName", e.target.value)
                  }
                  required
                />
                <label>الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الفريق الضيف"
                  value={addMatchFormik.values.AwayTeamName}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("AwayTeamName", e.target.value)
                  }
                  required
                />
                <label>الفريق الضيف</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="date"
                  placeholder="تاريخ المباراة"
                  value={addMatchFormik.values.Date}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("Date", e.target.value)
                  }
                  required
                />
                <label>تاريخ المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="time"
                  placeholder="الوقت"
                  value={addMatchFormik.values.Time}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("Time", e.target.value)
                  }
                  required
                />
                <label>الوقت</label>
              </div>
              <div className="form-row">
                <select
                  className="form-input"
                  value={addMatchFormik.values.MatchStatus}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("MatchStatus", e.target.value)
                  }
                  required
                >
                  <option value="">اختر حالة المباراة</option>
                  <option value="قادمة">قادمة</option>
                  <option value="جارية">جارية</option>
                  <option value="منتهية">منتهية</option>
                  <option value="ملغية">ملغية</option>
                </select>
                <label>حالة المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="أهداف الفريق المنزلي"
                  value={addMatchFormik.values.HomeTeamScore}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("HomeTeamScore", e.target.value)
                  }
                />
                <label>أهداف الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="أهداف الفريق الضيف"
                  value={addMatchFormik.values.AwayTeamScore}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("AwayTeamScore", e.target.value)
                  }
                />
                <label>أهداف الفريق الضيف</label>
              </div>
              <button className="update-btn" type="submit">
                إضافة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* جدول اللاعبين */}
      <div className="players-table-container">
        <table className="players-table">
          <thead>
            <tr>
              <th>الفئة</th>
              <th>الملعب</th>
              <th>الفريق المنزلي</th>
              <th>الفريق الضيف</th>
              <th>تاريخ المباراة</th>
              <th>الوقت</th>
              <th>حالة المباراة</th>
              <th>أهداف الفريق المنزلي</th>
              <th>أهداف الفريق الضيف</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr key={idx}>
                <td>{player.category}</td>
                <td>{player.stadium}</td>
                <td>{player.homeTeamName}</td>
                <td>{player.awayTeamName}</td>
                <td>{formatDate(player.date)}</td>
                <td>{player.time}</td>
                <td>{player.matchStatus}</td>
                <td>{player.homeTeamScore}</td>
                <td>{player.awayTeamScore}</td>
                <td>
                  <button
                    className="action-btn delete"
                    onClick={() => deletePlayer(player.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => handleEditClick(player)}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة التعديل */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>تعديل بيانات المباراة</span>
              <button className="close-btn" onClick={onCloseEdit}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={editPlayerFormik.handleSubmit}
            >
              <div className="form-row">
                <select
                  className={`form-input ${
                    !editPlayerFormik.values.Category ? "input-error" : ""
                  }`}
                  value={editPlayerFormik.values.Category}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("Category", e.target.value)
                  }
                  required
                >
                  <option value="">اختر الفئة العمرية</option>
                  <option value="U12">فئة 12</option>
                  <option value="U14">فئة 14</option>
                  <option value="U16">فئة 16</option>
                </select>
                <label>الفئة العمرية</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الملعب"
                  value={editPlayerFormik.values.Stadium}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                        "Stadium",
                      e.target.value
                    )
                  }
                  required
                />
                <label>الملعب</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الفريق الضيف"
                  value={editPlayerFormik.values.AwayTeamName}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("AwayTeamName", e.target.value)
                  }
                  required
                />
                <label>الفريق الضيف</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الفريق المنزلي"
                  value={editPlayerFormik.values.HomeTeamName}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("HomeTeamName", e.target.value)
                  }
                  required
                />
                <label>الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="date"
                  value={editPlayerFormik.values.Date}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("Date", e.target.value)
                  }
                  required
                />
                <label>تاريخ المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="time"
                  placeholder="الوقت"
                  value={editPlayerFormik.values.Time}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("Time", e.target.value)
                  }
                  required
                />
                <label>الوقت</label>
              </div>
              <div className="form-row">
                <select
                  className="form-input"
                  value={editPlayerFormik.values.MatchStatus}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("MatchStatus", e.target.value)
                  }
                  required
                >
                  <option value="">اختر حالة المباراة</option>
                  <option value="قادمة">قادمة</option>
                  <option value="جارية">جارية</option>
                  <option value="منتهية">منتهية</option>
                  <option value="ملغية">ملغية</option>
                </select>
                <label>حالة المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="أهداف الفريق المنزلي"
                  value={editPlayerFormik.values.HomeTeamScore}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("HomeTeamScore", e.target.value)
                  }
                />
                <label>أهداف الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="أهداف الفريق الضيف"
                  value={editPlayerFormik.values.AwayTeamScore}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("AwayTeamScore", e.target.value)
                  }
                />
                <label>أهداف الفريق الضيف</label>
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

export default MangeMatches;
