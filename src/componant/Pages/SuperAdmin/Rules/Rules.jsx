import React, { useState, useEffect } from "react";
import axios, { Axios } from "axios";
import "./Rules.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { jwtDecode } from "jwt-decode";

export default function Rules() {
  const [editingRule, setEditingRule] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({ title: "", rule: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const [rulesData, setRulesData] = useState([]);

  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.Role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const saveRuleToAPI = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Role`,
        {
          roleName: values.roleName,
          roleDescription: values.roleDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadRulesFromAPI();
    } catch (error) {
      // Error handling
    }
  };

  const loadRulesFromAPI = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Roles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRulesData(response.data);
    } catch (error) {
      console.error("Error loading rules:", error);
      // Keep default rules if API fails
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "خطأ في تحميل اللوائح";
      return { success: false, error: errorMessage };
    }
  };

  const handleEditClick = (rule) => {
    setEditingRule(rule);
    setShowEditForm(true);

    // Pre-fill the edit form with rule data
    editFormik.setValues({
      roleName: rule.roleName || "",
      roleDescription: rule.roleDescription || "",
    });
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingRule(null);
    editFormik.resetForm();
    setMessage({ type: "", text: "" });
  };

  const handleEditRule = async (values) => {
    if (!editingRule || !editingRule.id) {
      setMessage({ type: "error", text: "خطأ: لم يتم العثور على معرف اللائحة" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Update-Role/${editingRule.id}`,
        {
          roleName: values.roleName,
          roleDescription: values.roleDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      await loadRulesFromAPI();
      setMessage({ type: "success", text: "تم تحديث اللائحة بنجاح!" });
      
      // Close the modal after successful update
      setTimeout(() => {
        handleCloseEditForm();
      }, 1500);
      
    } catch (error) {
      setMessage({ type: "error", text: "خطأ في تحديث اللائحة" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRuleFromAPI = async (ruleId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/Delete-Role/${ruleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      loadRulesFromAPI();
    } catch (error) {
      // Error handling
    }
  };

  const editFormik = useFormik({
    initialValues: {
      roleName: "",
      roleDescription: "",
    },
    onSubmit: handleEditRule,
  });

  const formik = useFormik({
    initialValues: {
      roleName: "",
      roleDescription: "",
    },
    onSubmit: saveRuleToAPI,
  });

  useEffect(() => {
    loadRulesFromAPI();
  }, []);

  return (
    <div className="rules-page" dir="rtl">
      {/* Loading Indicator */}

      {/* Header */}
      <div className="rules-header">
        <div className="header-content">
          <h1 className="rules-title">
            <span className="title-icon">📋</span>
            اللوائح التنظيمية للبطولة
          </h1>
          <p className="rules-description">
            قواعد وأنظمة البطولة التي يجب على جميع المشاركين الالتزام بها
          </p>
        </div>
        <div className="header-actions">
          {(userRole === "Admin" || userRole === "admin") && (
            <button
              className="add-rule-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <span className="btn-icon">➕</span>
              {showAddForm ? "إلغاء الإضافة" : "إضافة لائحة"}
            </button>
          )}
          <button className="print-btn">
            <span className="btn-icon">🖨️</span>
            طباعة اللوائح
          </button>
          <button className="download-btn">
            <span className="btn-icon">📥</span>
            تحميل PDF
          </button>
        </div>
      </div>

      {/* Add Rule Form */}
      {showAddForm && (
        <div className="modal-overlay">
        <div className="modal-content">
        <div className="modal-header">
              <span>إضافة لائحة جديدة</span>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>
                ×
              </button>
            </div>
          <div className="add-rule-form">
            <div className="form-header">
              <h3 className="form-title">إضافة لائحة جديدة</h3>
            </div>
            <div className="form-content">
            <form onSubmit={formik.handleSubmit}>

              <div className="form-group">

                <label className="form-label">عنوان اللائحة:</label>
                <input
                  type="text"
                  className="form-input"
                  name="roleName"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="مثال: قواعد جديدة"
                  disabled={isLoading}
                  required
                />
                {formik.touched.roleName && formik.errors.roleName && (
                  <div className="error-message">{formik.errors.roleName}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">نص اللائحة:</label>
                <textarea
                  className="form-textarea"
                  name="roleDescription"
                  value={formik.values.roleDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="اكتب نص اللائحة هنا..."
                  rows="3"
                  disabled={isLoading}
                  required
                />
                {formik.touched.roleDescription &&
                  formik.errors.roleDescription && (
                    <div className="error-message">
                      {formik.errors.roleDescription}
                    </div>
                  )}
              </div>
              <div className="form-actions">
                <button className="save-btn" type="submit" disabled={isLoading}>
                  <span className="btn-icon">{isLoading ? "⏳" : "💾"}</span>
                  {isLoading ? "جاري الحفظ..." : "حفظ اللائحة"}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    formik.resetForm();
                    setMessage({ type: "", text: "" });
                  }}
                  disabled={isLoading}
                >
                  <span className="btn-icon">❌</span>
                  إلغاء
                </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="rules-tabs">
        <button
          className={`tab-btn ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <span className="tab-icon">⚽</span>
          القواعد العامة
        </button>
        <button
          className={`tab-btn ${activeTab === "technical" ? "active" : ""}`}
          onClick={() => setActiveTab("technical")}
        >
          <span className="tab-icon">🏆</span>
          القواعد الفنية
        </button>
        <button
          className={`tab-btn ${activeTab === "disciplinary" ? "active" : ""}`}
          onClick={() => setActiveTab("disciplinary")}
        >
          <span className="tab-icon">⚖️</span>
          القواعد التأديبية
        </button>
      </div>

      {/* Content */}
      <div className="rules-content">
        {rulesData.map((section, index) => (
          <div key={section.id || index} className="rules-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📌</span>
                {section.roleName}
              </h2>
              <div className="section-actions">
                {(userRole === "Admin" || userRole === "admin") && (
                  <>
                    <button
                      className="action-btn delete"
                      onClick={() => deleteRuleFromAPI(section.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() => handleEditClick(section)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="section-content">
              <p className="section-description">{section.roleDescription}</p>
            </div>
          </div>
        ))}
      </div>

      {showEditForm && (
        
        <div className="modal-overlay">
        <div className="modal-content">
        <div className="modal-header">
              <span>تعديل اللائحة</span>
              <button className="close-btn" onClick={() => setShowEditForm(false)}>
                ×
              </button>
            </div>  
        <div className="edit-rule-form">
          <div className="form-header">
            <h3 className="form-title">تعديل اللائحة</h3>
          </div>
          <div className="form-content">
            <form onSubmit={editFormik.handleSubmit} className="form-container">
              <div className="form-group">
                <label className="form-label">عنوان اللائحة:</label>
                <input
                  type="text"
                  className="form-input"
                  name="roleName"
                  value={editFormik.values.roleName}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  placeholder="مثال: قواعد جديدة"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">نص اللائحة:</label>
                <textarea
                  className="form-textarea"
                  name="roleDescription"
                  value={editFormik.values.roleDescription}
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  placeholder="اكتب نص اللائحة هنا..."
                  rows="3"
                  disabled={isLoading}
                  required
                />
                {editFormik.touched.roleDescription &&
                  editFormik.errors.roleDescription && (
                    <div className="error-message">
                      {editFormik.errors.roleDescription}
                    </div>
                  )}
              </div>
              <div className="form-actions">
                <button className="save-btn" type="submit" disabled={isLoading}>
                  <span className="btn-icon">{isLoading ? "⏳" : "💾"}</span>
                  {isLoading ? "جاري الحفظ..." : "حفظ اللائحة"}
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Footer */}
      <div className="rules-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-title">معلومات مهمة</h3>
            <p className="footer-text">
              هذه اللوائح ملزمة لجميع المشاركين في البطولة. أي مخالفة لهذه
              القواعد قد تؤدي إلى استبعاد الفريق أو اللاعب من البطولة.
            </p>
          </div>
          <div className="footer-contact">
            <h4 className="contact-title">للاستفسارات</h4>
            <p className="contact-info">📧 admin@tournament.com</p>
            <p className="contact-info">📞 +966 50 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
