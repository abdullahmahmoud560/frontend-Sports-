"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Info.css";

function Info() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  console.log(process.env.REACT_APP_API_URL);

  const ageCategories = [12, 14, 16];

  // Schema للتحقق من صحة البيانات
  const validationSchema = Yup.object({
    AdditionalPhoneNumber: Yup.string()
      .min(8, "رقم الهاتف الإضافي يجب أن يكون 8 أرقام على الأقل")
      .matches(/^[0-9+\-\s()]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
    AdditionalEmail: Yup.string().email("البريد الإلكتروني الإضافي غير صحيح"),
    under12: Yup.boolean(),
    under14: Yup.boolean(),
    under16: Yup.boolean(),
    TShirtColor: Yup.string().required("يجب تحديد لون التيشيرت الأساسي"),
    ShortColor: Yup.string().required("يجب تحديد لون الشورت الأساسي"),
    ShoesColor: Yup.string().required("يجب تحديد لون الحذاء الأساسي"),
    AdditionalTShirtColor: Yup.string(),
    AdditionalShortColor: Yup.string(),
    AdditionalShoesColor: Yup.string(),
  });
  const handleSave = async (values) => {
    // التحقق من الفئات العمرية
    console.log(values);
    setIsLoading(true);
    setIsSuccess(false);

    try {
      // تحضير البيانات للإرسال حسب البنية الجديدة
      const updateData = {
        AdditionalPhoneNumber: values.AdditionalPhoneNumber || "",
        AdditionalEmail: values.AdditionalEmail || "",
        under12: values.under12,
        under14: values.under14,
        under16: values.under16,
        // ألوان الطقم الأساسي
        TShirtColor: values.TShirtColor,
        ShortColor: values.ShortColor,
        ShoesColor: values.ShoesColor,
        // ألوان الطقم الاحتياطي
        AdditionalTShirtColor: values.AdditionalTShirtColor,
        AdditionalShortColor: values.AdditionalShortColor,
        AdditionalShoesColor: values.AdditionalShoesColor,
      };

      // استخراج معرف الأكاديمية من التوكن - محاولة عدة احتمالات
      let academyId = tokenData.Id;
      // إرسال طلب التحديث إلى API
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Update-Academy/${academyId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      setIsSuccess(true);

      // إنشاء رسالة النجاح مع الفئات المختارة
      const selectedCategories = [];
      if (values.under12) selectedCategories.push(12);
      if (values.under14) selectedCategories.push(14);
      if (values.under16) selectedCategories.push(16);

      toast.success(
        `تم تحديث معلومات الأكاديمية بنجاح! الفئات المختارة: ${selectedCategories.join(
          "، "
        )} سنة`
      );

      // إعادة تعيين حالة النجاح بعد 3 ثوانٍ
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating academy data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // رسائل خطأ أكثر تفصيلاً
      let errorMessage = "حدث خطأ أثناء تحديث البيانات";

      if (error.response?.status === 401) {
        errorMessage =
          "غير مصرح لك بتحديث هذه البيانات. يرجى التأكد من تسجيل الدخول.";
      } else if (error.response?.status === 404) {
        errorMessage = "لم يتم العثور على الأكاديمية المطلوبة.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "بيانات غير صحيحة: " +
          (error.response?.data?.message || "يرجى التحقق من البيانات المدخلة");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // إنشاء formik
  const formik = useFormik({
    initialValues: {
      AdditionalPhoneNumber: "",
      AdditionalEmail: "",
      TShirtColor: "#ffffff",
      ShortColor: "#ffffff",
      ShoesColor: "#ffffff",
      under12: false,
      under14: false,
      under16: false,
      AdditionalTShirtColor: "#ffffff",
      AdditionalShortColor: "#ffffff",
      AdditionalShoesColor: "#ffffff",
    },
    validationSchema,
    onSubmit: handleSave,
  });

  // استخراج معلومات الأكاديمية من التوكن
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setTokenData(decoded);
        // طباعة بنية التوكن لفهم الحقول المتاحة
        console.log("Full token data:", decoded);

        // تعيين الفئات العمرية من التوكن إذا كانت موجودة
        formik.setFieldValue("under12", decoded.under12 || false);
        formik.setFieldValue("under14", decoded.under14 || false);
        formik.setFieldValue("under16", decoded.under16 || false);

        console.log("Token data:", decoded);

        // استخراج معرف الأكاديمية لتحميل البيانات الحالية
        const academyId = decoded.Id || ""; // المعرف الثابت كحل بديل

        // تحميل البيانات الحالية من API
        if (academyId) {
          loadCurrentData(academyId);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // دالة لتحميل البيانات الحالية من API
  const loadCurrentData = async (academyId) => {
    try {
      setIsLoadingData(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Academy/${academyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Current academy data:", response.data);

      // تحديث البيانات المحلية بالبيانات من API
      const academyData = response.data;
      if (academyData) {
        // تحديث formik values
        const categories = [];
        if (academyData.under12) categories.push(12);
        if (academyData.under14) categories.push(14);
        if (academyData.under16) categories.push(16);

        formik.setValues({
          AdditionalPhoneNumber: academyData.additionalPhoneNumber || "",
          AdditionalEmail: academyData.additionalEmail || "",
          TShirtColor: academyData.tShirtColor || "#ffffff",
          ShortColor: academyData.shortColor || "#ffffff",
          ShoesColor: academyData.shoesColor || "#ffffff",
          under12: categories.includes(12),
          under14: categories.includes(14),
          under16: categories.includes(16),
          AdditionalTShirtColor: academyData.additionalTShirtColor || "#ffffff",
          AdditionalShortColor: academyData.additionalShortColor || "#ffffff",
          AdditionalShoesColor: academyData.additionalShoesColor || "#ffffff",
        });

        toast.info(
          `تم تحميل البيانات المحفوظة مسبقاً. الفئات: ${categories.join(
            "، "
          )} سنة`
        );
      }
    } catch (error) {
      console.error("Error loading current data:", error);
      // لا نعرض خطأ للمستخدم لأن البيانات الأساسية متوفرة من التوكن
      toast.warn(
        "لم يتم تحميل البيانات المحفوظة مسبقاً، سيتم استخدام البيانات الأساسية من التوكن"
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCategoryChange = (category) => {
    const fieldName = `under${category}`;
    formik.setFieldValue(fieldName, !formik.values[fieldName]);
  };

  const handleKitColorChange = (fieldName, color) => {
    formik.setFieldValue(fieldName, color);
  };

  const getButtonClass = () => {
    if (isLoading) return "save-button loading";
    if (isSuccess) return "save-button success";
    return "save-button";
  };

  const getButtonText = () => {
    if (isLoading) return "جاري الحفظ...";
    if (isSuccess) return "تم الحفظ بنجاح!";
    return "حفظ المعلومات الإضافية";
  };

  const getButtonIcon = () => {
    if (isLoading) return "⏳";
    if (isSuccess) return "✅";
    return "💾";
  };

  const getButtonDescription = () => {
    if (isLoading) return "يرجى الانتظار أثناء حفظ البيانات...";
    if (isSuccess) return "تم تحديث معلومات الأكاديمية بنجاح";
    return "احفظ المعلومات الإضافية والفئات العمرية (12، 14، 16 سنة) وألوان الأطقم الأساسية والاحتياطية ومفتاح الوصول";
  };

  if (!tokenData) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>جاري تحميل معلومات الأكاديمية...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">لوحة التحكم</h1>
        <p className="dashboard-subtitle">
          عرض معلومات الأكاديمية وإدارة الإعدادات الإضافية
        </p>
        {isLoadingData && (
          <div className="loading-indicator">
            <span>🔄</span> جاري تحميل البيانات الحالية...
          </div>
        )}
      </div>

      <div className="dashboard-content">
        {/* معلومات الأكاديمية الأساسية (للقراءة فقط) */}
        <div className="dashboard-section">
          <div className="section-header">
            <span className="icon">🏫</span>
            <h3>معلومات الأكاديمية الأساسية</h3>
          </div>

          <div className="academy-info-display">
            <div className="info-item">
              <label>اسم الأكاديمية</label>
              <div className="info-value">
                {tokenData.AcademyName || tokenData.name || ""}
              </div>
            </div>

            <div className="info-item">
              <label>رقم الهاتف الأساسي</label>
              <div className="info-value">
                {tokenData.AcademyPhone || tokenData.phone || ""}
              </div>
            </div>

            <div className="info-item">
              <label>البريد الإلكتروني الأساسي</label>
              <div className="info-value">
                {tokenData.AcademyEmail || tokenData.email || ""}
              </div>
            </div>

            {tokenData.academyCountry && (
              <div className="info-item">
                <label>الدولة</label>
                <div className="info-value">{tokenData.academyCountry}</div>
              </div>
            )}

            {tokenData.academyCity && (
              <div className="info-item">
                <label>المدينة</label>
                <div className="info-value">{tokenData.academyCity}</div>
              </div>
            )}

            {tokenData.coordinator && (
              <div className="info-item">
                <label>المنسق</label>
                <div className="info-value">{tokenData.coordinator}</div>
              </div>
            )}
          </div>
        </div>

        {/* معلومات إضافية (قابلة للتعديل) */}
        <div className="dashboard-section">
          <div className="section-header">
            <span className="icon">📞</span>
            <h3>معلومات الاتصال الإضافية</h3>
            <p className="section-description">
              يمكنك إضافة رقم هاتف أو بريد إلكتروني إضافي للتواصل ومفتاح الوصول
              (اختياري)
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="academy-form">
              <div className="form-group">
                <label>رقم هاتف إضافي (اختياري)</label>
                <input
                  type="tel"
                  name="AdditionalPhoneNumber"
                  value={formik.values.AdditionalPhoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="أدخل رقم هاتف إضافي"
                  className={`form-input ${
                    formik.touched.AdditionalPhoneNumber &&
                    formik.errors.AdditionalPhoneNumber
                      ? "error"
                      : ""
                  }`}
                />
                {formik.touched.AdditionalPhoneNumber &&
                  formik.errors.AdditionalPhoneNumber && (
                    <span className="error-message">
                      {formik.errors.AdditionalPhoneNumber}
                    </span>
                  )}
              </div>

              <div className="form-group">
                <label>بريد إلكتروني إضافي (اختياري)</label>
                <input
                  type="email"
                  name="AdditionalEmail"
                  value={formik.values.AdditionalEmail}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="أدخل بريد إلكتروني إضافي"
                  className={`form-input ${
                    formik.touched.AdditionalEmail &&
                    formik.errors.AdditionalEmail
                      ? "error"
                      : ""
                  }`}
                />
                {formik.touched.AdditionalEmail &&
                  formik.errors.AdditionalEmail && (
                    <span className="error-message">
                      {formik.errors.AdditionalEmail}
                    </span>
                  )}
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <span className="icon">👥</span>
                <h3>الفئات العمرية</h3>
                <p className="section-description">
                  اختر الفئات العمرية التي تريد المشاركة فيها (12، 14، 16 سنة)
                </p>
              </div>

              <div className="age-categories">
                {ageCategories.map((category) => (
                  <div key={category} className="category-item">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={formik.values[`under${category}`]}
                      onChange={() => handleCategoryChange(category)}
                      className="category-checkbox"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="category-label"
                    >
                      <span className="category-age">{category}</span>
                      <span className="category-text">سنة</span>
                    </label>
                  </div>
                ))}
              </div>
              {!formik.values.under12 &&
                !formik.values.under14 &&
                !formik.values.under16 && (
                  <div
                    className="error-message"
                    style={{ textAlign: "center", marginTop: "1rem" }}
                  >
                    يجب اختيار فئة عمرية واحدة على الأقل (12، 14، أو 16 سنة)
                  </div>
                )}
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <span className="icon">👕</span>
                <h3>أطقم الملابس</h3>
                <p className="section-description">
                  حدد ألوان الأطقم الأساسية (إجبارية) والاحتياطية (اختيارية)
                </p>
              </div>

              <div className="kits-container">
                {/* الطقم الأساسي */}
                <div className="kit-section">
                  <h4 className="kit-title">
                    <span className="kit-icon">🏠</span>
                    الطقم الأساسي (إجباري)
                  </h4>

                  <div className="kit-items">
                    <div className="kit-item">
                      <label>تيشيرت</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.TShirtColor}
                          onChange={(e) =>
                            handleKitColorChange("TShirtColor", e.target.value)
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{ backgroundColor: formik.values.TShirtColor }}
                        ></span>
                      </div>
                    </div>

                    <div className="kit-item">
                      <label>شورت</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.ShortColor}
                          onChange={(e) =>
                            handleKitColorChange("ShortColor", e.target.value)
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{ backgroundColor: formik.values.ShortColor }}
                        ></span>
                      </div>
                    </div>

                    <div className="kit-item">
                      <label>حذاء</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.ShoesColor}
                          onChange={(e) =>
                            handleKitColorChange("ShoesColor", e.target.value)
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{ backgroundColor: formik.values.ShoesColor }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الطقم الاحتياطي */}
                <div className="kit-section">
                  <h4 className="kit-title">
                    <span className="kit-icon">✈️</span>
                    الطقم الاحتياطي (اختياري)
                  </h4>

                  <div className="kit-items">
                    <div className="kit-item">
                      <label>تيشيرت</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.AdditionalTShirtColor}
                          onChange={(e) =>
                            handleKitColorChange(
                              "AdditionalTShirtColor",
                              e.target.value
                            )
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{
                            backgroundColor:
                              formik.values.AdditionalTShirtColor,
                          }}
                        ></span>
                      </div>
                    </div>

                    <div className="kit-item">
                      <label>شورت</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.AdditionalShortColor}
                          onChange={(e) =>
                            handleKitColorChange(
                              "AdditionalShortColor",
                              e.target.value
                            )
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{
                            backgroundColor: formik.values.AdditionalShortColor,
                          }}
                        ></span>
                      </div>
                    </div>

                    <div className="kit-item">
                      <label>حذاء</label>
                      <div className="color-picker">
                        <input
                          type="color"
                          value={formik.values.AdditionalShoesColor}
                          onChange={(e) =>
                            handleKitColorChange(
                              "AdditionalShoesColor",
                              e.target.value
                            )
                          }
                          className="color-input"
                        />
                        <span
                          className="color-preview"
                          style={{
                            backgroundColor: formik.values.AdditionalShoesColor,
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(!formik.values.TShirtColor ||
                !formik.values.ShortColor ||
                !formik.values.ShoesColor) && (
                <div
                  className="error-message"
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  يجب تحديد ألوان الطقم الأساسي (تيشيرت، شورت، حذاء)
                </div>
              )}
            </div>

            {/* زر الحفظ */}
            <div className="save-section">
              <p className="save-description">{getButtonDescription()}</p>
              <button
                type="submit"
                className={getButtonClass()}
                onClick={formik.handleSubmit}
                disabled={isLoading}
              >
                <span className="save-icon">{getButtonIcon()}</span>
                {getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Info;
