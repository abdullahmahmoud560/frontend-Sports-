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
      console.log(response.data);
      setPlayers(response.data);
    } catch (error) {
      console.log(error);
      // Fallback to static data if API fails
    }
  };

  const addMatch = async () => {
    console.log(addMatchFormik.values);
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
      console.log(response);
      fetchPlayers();
      onCloseAdd();
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
    }
  };

  const handleEditClick = (player) => {
    setEditingPlayer(player)
    setId(player.id);
    // Pre-fill the edit form with player data
    editPlayerFormik.setValues({
      category: player.category || "",
      homeTeam: player.homeTeam || "",
      awayTeam: player.awayTeam || "",
      date: player.date || "",
      time: player.time || "",
      stadium: player.stadium || "",
      matchStatus: player.matchStatus || "",
      homeTeamScore: player.homeTeamScore || "",
      awayTeamScore: player.awayTeamScore || "",
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

  useEffect(() => {
    fetchPlayers();
  }, []);

  const addMatchFormik = useFormik({
    initialValues: {
      category: "",
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      stadium: "",
      matchStatus: "",
      homeTeamScore: "",
      awayTeamScore: "",
    },
    onSubmit: addMatch,
  });

  const editPlayerFormik = useFormik({
    initialValues: {
      category: "",
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      stadium: "",
      matchStatus: "",
      homeTeamScore: "",
      awayTeamScore: "",
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
        <input className="search-input" placeholder="ابحث باسم اللاعب" />
      </div>

      {/* نافذة إضافة لاعب جديد */}
      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>إضافة لاعب جديد</span>
              <button className="close-btn" onClick={onCloseAdd}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={addMatchFormik.handleSubmit}
            >
              <div className="form-row">
                <input
                  className={`form-input ${
                    !addMatchFormik.values.pLayerName ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="الفئة"
                  value={addMatchFormik.values.category}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("category", e.target.value)
                  }
                  required
                />
                <label>الفئة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الملعب"
                  value={addMatchFormik.values.stadium}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("stadium", e.target.value)
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
                  value={addMatchFormik.values.homeTeam}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("homeTeam", e.target.value)
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
                  value={addMatchFormik.values.awayTeam}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("awayTeam", e.target.value)
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
                  value={addMatchFormik.values.date}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("date", e.target.value)
                  }
                />
                <label>تاريخ المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="time"
                  placeholder="الوقت"
                  value={addMatchFormik.values.time}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("time", e.target.value)
                  }
                  required
                />
                <label>الوقت</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="اهداف الفريق الضيف"
                  value={addMatchFormik.values.awayTeamScore}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue(
                      "awayTeamScore",
                      e.target.value
                    )
                  }
                />
                <label>اهداف الفريق الضيف</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="اهداف الفريق المنزلي"
                  value={addMatchFormik.values.homeTeamScore}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue(
                      "homeTeamScore",
                      e.target.value
                    )
                  }
                />
                <label>اهداف الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الحاله"
                  value={addMatchFormik.values.matchStatus}
                  onChange={(e) =>
                    addMatchFormik.setFieldValue("matchStatus", e.target.value)
                  }
                />
                <label>الحاله</label>
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
              <th>اهداف الفريق الضيف</th>
              <th>اهداف الفريق المنزلي</th>
              <th>الحاله</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, idx) => (
              <tr key={idx}>
                <td>{player.category}</td>
                <td>{player.stadium}</td>
                <td>{player.homeTeam}</td>
                <td>{player.awayTeam}</td>
                <td>{player.date}</td>
                <td>{player.time}</td>
                <td>{player.homeTeamScore}</td>
                <td>{player.awayTeamScore}</td>
                <td>{player.matchStatus}</td>
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
              <span>تعديل بيانات لاعب</span>
              <button className="close-btn" onClick={onCloseEdit}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={editPlayerFormik.handleSubmit}
            >
              <div className="form-row">
                <input
                  className={`form-input ${
                    !editPlayerFormik.values.category ? "input-error" : ""
                  }`}
                  type="text"
                  placeholder="الفئة"
                  value={editPlayerFormik.values.category}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("category", e.target.value)
                  }
                  required
                />
                <label>الفئة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الملعب"
                  value={editPlayerFormik.values.stadium}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                        "stadium",
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
                  value={editPlayerFormik.values.awayTeam}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("awayTeam", e.target.value)
                  }
                />
                <label>الفريق الضيف</label>
              </div>

              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الفريق المنزلي"
                  value={editPlayerFormik.values.homeTeam}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("homeTeam", e.target.value)
                  }
                  required
                />
                <label>الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="date"
                  value={editPlayerFormik.values.date}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("date", e.target.value)
                  }
                />
                <label>تاريخ المباراة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="time"
                  placeholder="الوقت"
                  value={editPlayerFormik.values.time}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("time", e.target.value)
                  }
                  required
                />
                <label>الوقت</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="اهداف الفريق الضيف"
                  value={editPlayerFormik.values.awayTeamScore}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "awayTeamScore",
                      e.target.value
                    )
                  }
                  required
                />
                <label>اهداف الفريق الضيف</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="number"
                  placeholder="اهداف الفريق المنزلي"
                  value={editPlayerFormik.values.homeTeamScore}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue("homeTeamScore", e.target.value)
                  }
                />
                <label>اهداف الفريق المنزلي</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الحاله"
                  value={editPlayerFormik.values.matchStatus}
                  onChange={(e) =>
                    editPlayerFormik.setFieldValue(
                      "matchStatus",
                      e.target.value
                    )
                  }
                />
                <label>الحاله</label>
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
