import React, { useEffect, useState } from "react";
import "./Acadimics.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Acadimics = () => {
  const [academies, setAcademies] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingAcademy, setEditingAcademy] = useState(null);

  const addAcademY = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Register-Academy-Admin`,
        registerFormik.values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      getAcademies();
      onClose();
    } catch (error) {}
  };

  const getAcademies = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-All-Academies`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAcademies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteAcademies = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/Delete-Academy/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      getAcademies();
    } catch (error) {}
  };

  const EditAcademies = async (values) => {
    console.log(values);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/Update-Academy/${editingAcademy.id}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      getAcademies();
      onCloseEdit();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (academy) => {
    setEditingAcademy(academy);
    // Pre-fill the edit form with academy data
    editFormik.setValues({
      academyName: academy.academyName || "",
      academyEmail: academy.academyEmail || "",
      academyPhone: academy.academyPhone || "",
      academyCountry: academy.academyCountry || "",
      logoURL: academy.logoURL || "",
      coordinator: academy.coordinator || "",
      academyCall: academy.academyCall || "",
      statue: academy.statue || false,
      under14: academy.under14 || false,
      under16: academy.under16 || false,
      under18: academy.under18 || false,
    });
    setShowEdit(true);
  };

  const onClose = () => {
    setShowAdd(false);
    registerFormik.resetForm();
  };

  const onCloseEdit = () => {
    setShowEdit(false);
    setEditingAcademy(null);
    editFormik.resetForm();
  };

  useEffect(() => {
    getAcademies();
  }, []);

  const registerFormik = useFormik({
    initialValues: {
      academyName: "",
      academyEmail: "",
      academyPhone: "",
      academyCountry: "",
      logoURL: "",
      coordinator: "",
      academyCall: "",
      statue: true,
      under14: true,
      under16: true,
      under18: true,
    },
    onSubmit: addAcademY,
  });

  const editFormik = useFormik({
    initialValues: {
      academyName: "",
      academyEmail: "",
      academyPhone: "",
      academyCountry: "",
      logoURL: "",
      coordinator: "",
      academyCall: "",
      statue: false,
      under14: false,
      under16: false,
      under18: false,
    },
    onSubmit: EditAcademies,
  });

  return (
    <div className="academies-page" dir="rtl">
      <div className="academies-header">
        <h2>إدارة الأكاديميات</h2>
        <p>يمكنك إضافة وتعديل وحذف الأكاديميات المشاركة في البطولة</p>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          إضافة أكاديمية جديدة
        </button>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{ color: "#2563eb" }}>إضافة أكاديمية جديدة</span>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={registerFormik.handleSubmit}
            >
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="اسم الأكاديمية"
                  value={registerFormik.values.academyName}
                  onChange={(e) =>
                    registerFormik.setFieldValue("academyName", e.target.value)
                  }
                  required
                />
                <label>اسم الأكاديمية</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الدولة"
                  value={registerFormik.values.academyCountry}
                  onChange={(e) =>
                    registerFormik.setFieldValue(
                      "academyCountry",
                      e.target.value
                    )
                  }
                  required
                />
                <label>الدولة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="المنسق"
                  value={registerFormik.values.coordinator}
                  onChange={(e) =>
                    registerFormik.setFieldValue("coordinator", e.target.value)
                  }
                />
                <label>المنسق</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={registerFormik.values.academyEmail}
                  onChange={(e) =>
                    registerFormik.setFieldValue("academyEmail", e.target.value)
                  }
                />
                <label>البريد الإلكتروني</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رقم الهاتف"
                  value={registerFormik.values.academyPhone}
                  onChange={(e) =>
                    registerFormik.setFieldValue("academyPhone", e.target.value)
                  }
                />
                <label>رقم الهاتف</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رقم الاتصال"
                  value={registerFormik.values.academyCall}
                  onChange={(e) =>
                    registerFormik.setFieldValue("academyCall", e.target.value)
                  }
                />
                <label>رقم الاتصال</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رابط الشعار"
                  value={registerFormik.values.logoURL}
                  onChange={(e) =>
                    registerFormik.setFieldValue("logoURL", e.target.value)
                  }
                />
                <label>رابط الشعار</label>
              </div>
              <div
                className="form-row"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0,
                }}
              >
                <label style={{ marginBottom: 4 }}>الفئات المشاركة</label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={registerFormik.values.under14}
                      onChange={(e) =>
                        registerFormik.setFieldValue(
                          "under14",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 14 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={registerFormik.values.under16}
                      onChange={(e) =>
                        registerFormik.setFieldValue(
                          "under16",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 16 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={registerFormik.values.under18}
                      onChange={(e) =>
                        registerFormik.setFieldValue(
                          "under18",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 18 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={registerFormik.values.certified}
                      onChange={(e) =>
                        registerFormik.setFieldValue(
                          "certified",
                          e.target.checked
                        )
                      }
                    />{" "}
                    معتمدة
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  className="add-btn"
                  style={{ background: "#eee", color: "#222" }}
                  onClick={onClose}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  style={{ background: "#2563eb" }}
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span style={{ color: "#2563eb" }}>تعديل أكاديمية</span>
              <button className="close-btn" onClick={onCloseEdit}>
                ×
              </button>
            </div>
            <form
              className="edit-player-form"
              onSubmit={editFormik.handleSubmit}
            >
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="اسم الأكاديمية"
                  value={editFormik.values.academyName}
                  onChange={(e) =>
                    editFormik.setFieldValue("academyName", e.target.value)
                  }
                  required
                />
                <label>اسم الأكاديمية</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="الدولة"
                  value={editFormik.values.academyCountry}
                  onChange={(e) =>
                    editFormik.setFieldValue(
                      "academyCountry",
                      e.target.value
                    )
                  }
                  required
                />
                <label>الدولة</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="المنسق"
                  value={editFormik.values.coordinator}
                  onChange={(e) =>
                    editFormik.setFieldValue("coordinator", e.target.value)
                  }
                />
                <label>المنسق</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={editFormik.values.academyEmail}
                  onChange={(e) =>
                    editFormik.setFieldValue("academyEmail", e.target.value)
                  }
                />
                <label>البريد الإلكتروني</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رقم الهاتف"
                  value={editFormik.values.academyPhone}
                  onChange={(e) =>
                    editFormik.setFieldValue("academyPhone", e.target.value)
                  }
                />
                <label>رقم الهاتف</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رقم الاتصال"
                  value={editFormik.values.academyCall}
                  onChange={(e) =>
                    editFormik.setFieldValue("academyCall", e.target.value)
                  }
                />
                <label>رقم الاتصال</label>
              </div>
              <div className="form-row">
                <input
                  className="form-input"
                  type="text"
                  placeholder="رابط الشعار"
                  value={editFormik.values.logoURL}
                  onChange={(e) =>
                    editFormik.setFieldValue("logoURL", e.target.value)
                  }
                />
                <label>رابط الشعار</label>
              </div>
              <div
                className="form-row"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0,
                }}
              >
                <label style={{ marginBottom: 4 }}>الفئات المشاركة</label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormik.values.under14}
                      onChange={(e) =>
                        editFormik.setFieldValue(
                          "under14",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 14 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormik.values.under16}
                      onChange={(e) =>
                        editFormik.setFieldValue(
                          "under16",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 16 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormik.values.under18}
                      onChange={(e) =>
                        editFormik.setFieldValue(
                          "under18",
                          e.target.checked
                        )
                      }
                    />{" "}
                    تحت 18 سنة
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={editFormik.values.statue}
                      onChange={(e) =>
                        editFormik.setFieldValue(
                          "statue",
                          e.target.checked
                        )
                      }
                    />
                    معتمدة
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  className="add-btn"
                  style={{ background: "#eee", color: "#222" }}
                  onClick={onCloseEdit}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  style={{ background: "#2563eb" }}
                >
                  تعديل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="academies-list-card">
        <div className="academies-list-title">
          قائمة الأكاديميات <span>({academies.length})</span>
        </div>
        
        {/* Desktop Table View */}
        <div className="table-wrapper">
          <table className="academies-table">
            <thead>
              <tr>
                <th>العمليات</th>
                <th>الحالة</th>
                <th>الهاتف</th>
                <th>البريد الإلكتروني</th>
                <th>الدولة</th>
                <th>الاسم</th>
              </tr>
            </thead>
            <tbody>
              {academies.map((academy, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? "row-alt" : ""}>
                  <td>
                    <button className="action-btn delete" onClick={() => DeleteAcademies(academy.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button className="action-btn edit" onClick={() => handleEditClick(academy)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                  <td>
                    <span
                      className={
                        academy.statue === true
                          ? "status status-done"
                          : "status status-pending"
                      }
                    >
                      {academy.statue === true ? "معتمدة" : "غير معتمدة"}
                    </span>
                  </td>
                  <td>{academy.academyPhone}</td>
                  <td>{academy.academyEmail}</td>
                  <td>{academy.academyCountry}</td>
                  <td>{academy.academyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="academies-mobile-cards">
          {academies.map((academy, idx) => (
            <div key={idx} className="academy-card">
              <div className="academy-card-header">
                <div className="academy-name">{academy.academyName}</div>
                <div className="academy-actions">
                  <button className="action-btn delete" onClick={() => DeleteAcademies(academy.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                  <button className="action-btn edit" onClick={() => handleEditClick(academy)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </div>
              <div className="academy-info">
                <div className="academy-info-item">
                  <div className="academy-info-label">الدولة</div>
                  <div className="academy-info-value">{academy.academyCountry}</div>
                </div>
                <div className="academy-info-item">
                  <div className="academy-info-label">البريد الإلكتروني</div>
                  <div className="academy-info-value">{academy.academyEmail}</div>
                </div>
                <div className="academy-info-item">
                  <div className="academy-info-label">الهاتف</div>
                  <div className="academy-info-value">{academy.academyPhone}</div>
                </div>
                <div className="academy-info-item">
                  <div className="academy-info-label">المنسق</div>
                  <div className="academy-info-value">{academy.coordinator || "غير محدد"}</div>
                </div>
              </div>
              <div className="academy-status">
                <span
                  className={
                    academy.statue === true
                      ? "status status-done"
                      : "status status-pending"
                  }
                >
                  {academy.statue === true ? "معتمدة" : "غير معتمدة"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Acadimics;
