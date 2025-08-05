"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./Login.css";
import logo from "../../../Images/Logo.png";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+966",
    name: "Saudi Arabia",
    flag: "🇸🇦",
  });

  // Country data for phone codes
  const countries = [
    { code: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+971", name: "UAE", flag: "🇦🇪" },
    { code: "+973", name: "Bahrain", flag: "🇧🇭" },
    { code: "+974", name: "Qatar", flag: "🇶🇦" },
    { code: "+965", name: "Kuwait", flag: "🇰🇼" },
    { code: "+968", name: "Oman", flag: "🇴🇲" },
    { code: "+962", name: "Jordan", flag: "🇯🇴" },
    { code: "+961", name: "Lebanon", flag: "🇱🇧" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+212", name: "Morocco", flag: "🇲🇦" },
    { code: "+216", name: "Tunisia", flag: "🇹🇳" },
    { code: "+213", name: "Algeria", flag: "🇩🇿" },
    { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+33", name: "France", flag: "🇫🇷" },
    { code: "+49", name: "Germany", flag: "🇩🇪" },
    { code: "+39", name: "Italy", flag: "🇮🇹" },
    { code: "+34", name: "Spain", flag: "🇪🇸" },
    { code: "+31", name: "Netherlands", flag: "🇳🇱" },
    { code: "+32", name: "Belgium", flag: "🇧🇪" },
    { code: "+41", name: "Switzerland", flag: "🇨🇭" },
    { code: "+43", name: "Austria", flag: "🇦🇹" },
    { code: "+46", name: "Sweden", flag: "🇸🇪" },
    { code: "+47", name: "Norway", flag: "🇳🇴" },
    { code: "+45", name: "Denmark", flag: "🇩🇰" },
    { code: "+358", name: "Finland", flag: "🇫🇮" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", name: "Myanmar", flag: "🇲🇲" },
    { code: "+977", name: "Nepal", flag: "🇳🇵" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    { code: "+964", name: "Iraq", flag: "🇮🇶" },
    { code: "+963", name: "Syria", flag: "🇸🇾" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦" },
    { code: "+48", name: "Poland", flag: "🇵🇱" },
    { code: "+420", name: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", name: "Hungary", flag: "🇭🇺" },
    { code: "+30", name: "Greece", flag: "🇬🇷" },
    { code: "+351", name: "Portugal", flag: "🇵🇹" },
    { code: "+353", name: "Ireland", flag: "🇮🇪" },
    { code: "+61", name: "Australia", flag: "🇦🇺" },
    { code: "+64", name: "New Zealand", flag: "🇳🇿" },
    { code: "+81", name: "Japan", flag: "🇯🇵" },
    { code: "+82", name: "South Korea", flag: "🇰🇷" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+65", name: "Singapore", flag: "🇸🇬" },
    { code: "+60", name: "Malaysia", flag: "🇲🇾" },
    { code: "+66", name: "Thailand", flag: "🇹🇭" },
    { code: "+84", name: "Vietnam", flag: "🇻🇳" },
    { code: "+63", name: "Philippines", flag: "🇵🇭" },
    { code: "+62", name: "Indonesia", flag: "🇮🇩" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", name: "Myanmar", flag: "🇲🇲" },
    { code: "+977", name: "Nepal", flag: "🇳🇵" },
    { code: "+880", name: "Bangladesh", flag: "🇧🇩" },
    { code: "+93", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+98", name: "Iran", flag: "🇮🇷" },
    { code: "+964", name: "Iraq", flag: "🇮🇶" },
    { code: "+963", name: "Syria", flag: "🇸🇾" },
    { code: "+90", name: "Turkey", flag: "🇹🇷" },
    { code: "+7", name: "Russia", flag: "🇷🇺" },
    { code: "+380", name: "Ukraine", flag: "🇺🇦" },
  ];

  // Validation schema for registration form
  const registerValidationSchema = Yup.object({
    academyName: Yup.string()
      .min(2, "اسم الأكاديمية يجب أن يكون على الأقل حرفين")
      .required("اسم الأكاديمية مطلوب"),
    academyManagerName: Yup.string()
      .min(2, "اسم مدير الأكاديمية يجب أن يكون على الأقل حرفين")
      .required("اسم مدير الأكاديمية مطلوب"),
    academyEmail: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    academyPhone: Yup.string()
      .matches(/^[0-9\s\-()]+$/, "رقم الهاتف غير صحيح")
      .min(7, "رقم الهاتف يجب أن يكون على الأقل 7 أرقام")
      .required("رقم الهاتف مطلوب"),
    academyCountry: Yup.string()
      .min(2, "اسم الدولة يجب أن يكون على الأقل حرفين")
      .required("الدولة مطلوبة"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون على الأقل 6 أحرف")
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "كلمة المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
    logoURL: Yup.mixed().required("الشعار مطلوب"),
    termsAccepted: Yup.boolean()
      .oneOf([true], "يجب الموافقة على الشروط والأحكام")
      .required("يجب الموافقة على الشروط والأحكام"),
  });

  // Formik hook for registration form
  const registerFormik = useFormik({
    initialValues: {
      academyName: "",
      academyManagerName: "",
      academyEmail: "",
      academyPhone: "",
      academyCountry: "",
      password: "",
      confirmPassword: "",
      logoURL: null,
      termsAccepted: false,
    },
    validationSchema: registerValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append("academyName", values.academyName);
      formData.append("academyManagerName", values.academyManagerName);
      formData.append("academyEmail", values.academyEmail);
      formData.append(
        "academyPhone",
        selectedCountry.code + " " + values.academyPhone
      );
      formData.append("academyCountry", values.academyCountry);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);
      if (values.logoURL) {
        formData.append("logoURL", values.logoURL);
      }

      axios
        .post(`${process.env.REACT_APP_API_URL}/Register-Academy`, values, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          resetForm();
          setShowRegister(false);
          toast.success("تم تسجيل الأكاديمية بنجاح!");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert("حدث خطأ أثناء تسجيل الأكاديمية");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const loginValidationSchema = Yup.object({
    academyEmail: Yup.string()
      .email("البريد الإلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    academyPassword: Yup.string().required("كلمة المرور مطلوبة"),
  });

  const FormikLogin = useFormik({
    initialValues: {
      academyEmail: "",
      academyPassword: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      axios
        .post(`${process.env.REACT_APP_API_URL}/Login-Academy`, values)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("token", response.data);
            window.location.href = "/";
          }
          resetForm();
          setShowRegister(false);
          toast.success("تم تسجيل الأكاديمية بنجاح!");
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert("حدث خطأ أثناء تسجيل الأكاديمية");
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  // Terms and Conditions Content Component
  const TermsAndConditionsModal = () => (
    <div className="terms-modal-overlay" onClick={() => setShowTerms(false)}>
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-header">
          <h2>
            <i className="fas fa-file-contract"></i> الشروط والأحكام
          </h2>
          <button
            className="terms-close-btn"
            onClick={() => setShowTerms(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="terms-content">
          <div className="terms-section">
            <h3>
              <i className="fas fa-users-cog"></i> ١. الإشراف والتنسيق مع الفرق
            </h3>
            <div className="terms-text">
              <p>
                سيتم تعيين منسق اتصال مخصص لكل فريق (بحد أقصى فريقين لكل منسق
                اتصال) للتنسيق الكامل مع إدارة الفندق وتلبية احتياجات الفريق.
              </p>

              <p>
                سيُعقد اجتماع تنسيقي قبل بدء البطولة، يجمع مسؤولي الفرق، ومسؤولي
                الاتصال، ولجنة الاستقبال لتوضيح المسؤوليات، ولا سيما:
              </p>

              <ul>
                <li>
                  يجب عدم ترك اللاعبين دون إشراف؛ ويجب على مسؤول أو منسق اتصال
                  مرافقة كل مجموعة في جميع الأوقات.
                </li>
                <li>
                  الالتزام الكامل بالأنشطة والمباريات والتدريبات والاجتماعات
                  المقررة إلزامي.
                </li>
                <li>
                  يجب احترام خصوصية الضيوف؛ ويُمنع منعًا باتًا طرق الأبواب أو
                  الانتظار في المصاعد.
                </li>
                <li>يجب تجنب الضوضاء، خاصةً في الليل.</li>
                <li>
                  يجب استخدام مرافق الفندق بمسؤولية، ويجب الإبلاغ عن أي أعطال
                  فورًا.
                </li>
              </ul>

              <p>
                <strong>
                  مدير الفريق مسؤول مسؤولية مباشرة عن سلوك اللاعبين. ستؤدي
                  المخالفات المتكررة إلى إلغاء الحجز دون استرداد المبلغ المدفوع.
                </strong>
              </p>

              <p>
                يُشترط الالتزام الصارم بجدول الأنشطة المحدد (الوجبات، التدريب،
                الترفيه، إلخ).
              </p>
              <p>
                يجب اتباع جميع التعليمات الصادرة عن إدارة الفندق أو اللجنة
                المنظمة.
              </p>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-exclamation-triangle"></i> ٢. التطبيق الصارم
              للقواعد التالية
            </h3>
            <div className="terms-text">
              <p>
                <strong>يُمنع منعًا باتًا ما يلي:</strong>
              </p>
              <ul>
                <li>تجمعات الفرق في ممرات الفندق.</li>
                <li>الضوضاء الصاخبة داخل الغرف أو الممرات.</li>
                <li>إيقاف المصاعد أو إساءة استخدامها أثناء انتظار زملائهم.</li>
              </ul>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-building"></i> ٣. استخدام مرافق الفندق
            </h3>
            <div className="terms-text">
              <p>
                يُشترط التنسيق المسبق (قبل 24 ساعة على الأقل) مع لجنة الاتصال
                لاستخدام ما يلي:
              </p>
              <ul>
                <li>الملاعب الرياضية</li>
                <li>الصالة الرياضية</li>
                <li>حمام السباحة</li>
                <li>المواصلات</li>
              </ul>
              <p>
                هذا لتجنب تضارب الحجوزات مع الحجوزات الأخرى. سيتم إرسال نموذج
                إلكتروني يومي إلى الفرق لتحديد احتياجاتهم لليوم التالي.
              </p>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-info-circle"></i> ٤. التوعية قبل السفر
            </h3>
            <div className="terms-text">
              <p>
                يُطلب من كل منسق فريق عقد اجتماع داخلي مع لاعبيه قبل السفر لشرح
                هذه السياسات وضمان الالتزام الكامل بها طوال فترة الإقامة.
              </p>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-file-signature"></i> ٥. نموذج الاتفاقية
              والالتزام
            </h3>
            <div className="terms-text">
              <p>
                سيتم توزيع نموذج رسمي للشروط والأحكام، معتمد من اللجنة المنظمة
                وبالتنسيق مع إدارة الفندق. ويجب على جميع أعضاء الفريق الالتزام
                به طوال فترة إقامتهم.
              </p>
              <p>
                <strong>
                  لن يُسمح بمشاركة أي فريق في البطولة دون التوقيع على النموذج
                  المذكور.
                </strong>
              </p>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-money-bill-wave"></i> ٦. الإيداع المالي
              والتنفيذ
            </h3>
            <div className="terms-text">
              <p>
                سيتم تحصيل إيداع تأمين قدره <strong>٣٠٠٠ درهم إماراتي</strong>{" "}
                من كل فريق. سيتم خصم المبالغ في حال وجود أي مخالفات أو شكاوى،
                كما يلي:
              </p>
              <ul>
                <li>
                  <strong>المخالفة الأولى:</strong> خصم ١٠٠٠ درهم إماراتي
                </li>
                <li>
                  <strong>المخالفة الثانية:</strong> خصم ٢٠٠٠ درهم إماراتي
                </li>
                <li>
                  <strong>المخالفة الثالثة:</strong> إلغاء الحجز والاستبعاد من
                  البطولة دون استرداد المبلغ.
                </li>
              </ul>
            </div>
          </div>

          <div className="terms-section">
            <h3>
              <i className="fas fa-handshake"></i> الختام
            </h3>
            <div className="terms-text">
              <p>
                نأمل أن تحظى هذه الإجراءات بموافقتكم، ونتطلع إلى تعاونكم الكامل
                في تطبيقها، بما يضمن نجاح الفعالية وراحة جميع الضيوف وموظفي
                الفندق.
              </p>
              <p>سترسل اللجنة المنظمة نموذجًا لهيكل التوظيف لفريق الفندق.</p>
              <p>نرحب بأي تعليقات أو اقتراحات لديكم قبل اعتماد هذه السياسات.</p>
              <p>
                <strong>مع خالص التقدير والاحترام،</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="terms-modal-footer">
          <button
            className="accept-terms-btn"
            onClick={() => {
              registerFormik.setFieldValue("termsAccepted", true);
              setShowTerms(false);
            }}
          >
            <i className="fas fa-check"></i> أوافق على الشروط والأحكام
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="Quattro Logo" />
        </div>
        <h1 className="login-title">تسجيل الدخول</h1>
        <p className="login-subtitle">
          قم بتسجيل الدخول للوصول إلى لوحة التحكم
        </p>
        <form className="login-form" onSubmit={FormikLogin.handleSubmit}>
          <label className="login-label" htmlFor="email">
            البريد الإلكتروني
          </label>
          <input
            className="login-input"
            type="email"
            id="academyEmail"
            placeholder="example@email.com"
            name="academyEmail"
            value={FormikLogin.values.academyEmail}
            onChange={FormikLogin.handleChange}
            onBlur={FormikLogin.handleBlur}
            required
          />
          <label className="login-label" htmlFor="password">
            كلمة المرور
          </label>
          <input
            className="login-input"
            type="password"
            id="academyPassword"
            placeholder="••••••••"
            name="academyPassword"
            value={FormikLogin.values.academyPassword}
            onChange={FormikLogin.handleChange}
            onBlur={FormikLogin.handleBlur}
            required
          />
          {FormikLogin.isSubmitting ? (
            <div className="login-btn flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
              <span className="mr-2 text-white">جاري تسجيل الدخول...</span>
            </div>
          ) : (
            <button
              className="login-btn"
              type="submit"
              disabled={FormikLogin.isSubmitting}
            >
              <i className="fas fa-sign-in-alt login-btn-icon"></i> تسجيل الدخول
            </button>
          )}
        </form>
        <button
          className="register-btn"
          type="button"
          onClick={() => setShowRegister(true)}
        >
          <i className="fas fa-plus register-btn-icon"></i> تسجيل جديد
        </button>
      </div>

      {/* Registration Modal */}
      {showRegister && (
        <div
          className="register-modal-overlay"
          onClick={() => setShowRegister(false)}
        >
          <div
            className="register-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="register-modal-header">
              <h2>تسجيل جديد</h2>
              <button
                className="register-close-btn"
                onClick={() => setShowRegister(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form
              className="register-form"
              onSubmit={registerFormik.handleSubmit}
            >
              <div className="register-form-section">
                <h3>
                  <i className="fas fa-building"></i> معلومات الأكاديمية
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>اسم الأكاديمية *</label>
                    <input
                      type="text"
                      name="academyName"
                      value={registerFormik.values.academyName}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="أدخل اسم الأكاديمية"
                      className={
                        registerFormik.touched.academyName &&
                        registerFormik.errors.academyName
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.academyName &&
                      registerFormik.errors.academyName && (
                        <div className="error-message">
                          {registerFormik.errors.academyName}
                        </div>
                      )}
                  </div>

                  <div className="form-group">
                    <label>اسم مدير الأكاديمية *</label>
                    <input
                      required
                      type="text"
                      name="academyManagerName"
                      value={registerFormik.values.academyManagerName}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="أدخل اسم مدير الأكاديمية"
                      className={
                        registerFormik.touched.academyManagerName &&
                        registerFormik.errors.academyManagerName
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.academyManagerName &&
                      registerFormik.errors.academyManagerName && (
                        <div className="error-message">
                          {registerFormik.errors.academyManagerName}
                        </div>
                      )}
                  </div>
                  <div className="form-group">
                    <label>الدولة *</label>
                    <input
                      type="text"
                      name="academyCountry"
                      value={registerFormik.values.academyCountry}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="أدخل الدولة"
                      required
                      className={
                        registerFormik.touched.academyCountry &&
                        registerFormik.errors.academyCountry
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.academyCountry &&
                      registerFormik.errors.academyCountry && (
                        <div className="error-message">
                          {registerFormik.errors.academyCountry}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="register-form-section">
                <h3>
                  <i className="fas fa-phone-alt"></i> معلومات الاتصال
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>البريد الإلكتروني *</label>
                    <input
                      type="email"
                      name="academyEmail"
                      value={registerFormik.values.academyEmail}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="example@academy.com"
                      className={
                        registerFormik.touched.academyEmail &&
                        registerFormik.errors.academyEmail
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.academyEmail &&
                      registerFormik.errors.academyEmail && (
                        <div className="error-message">
                          {registerFormik.errors.academyEmail}
                        </div>
                      )}
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف (مفتاح الدولة) *</label>
                    <div className="phone-input-container">
                      <div className="country-code-selector">
                        <button
                          type="button"
                          className="country-code-btn"
                          onClick={() => {
                            const dropdown =
                              document.getElementById("country-dropdown");
                            dropdown.style.display =
                              dropdown.style.display === "block"
                                ? "none"
                                : "block";
                          }}
                        >
                          <span className="country-flag">
                            {selectedCountry.flag}
                          </span>
                          <span className="country-code">
                            {selectedCountry.code}
                          </span>
                          <i className="fas fa-chevron-down"></i>
                        </button>
                        <div id="country-dropdown" className="country-dropdown">
                          <div className="country-search">
                            <input
                              type="text"
                              placeholder="البحث عن دولة..."
                              onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase();
                                const options =
                                  document.querySelectorAll(".country-option");
                                options.forEach((option) => {
                                  const countryName =
                                    option.textContent.toLowerCase();
                                  option.style.display = countryName.includes(
                                    searchTerm
                                  )
                                    ? "block"
                                    : "none";
                                });
                              }}
                            />
                          </div>
                          <div className="country-options">
                            {countries.map((country, index) => (
                              <div
                                key={index}
                                className="country-option"
                                onClick={() => {
                                  setSelectedCountry(country);
                                  document.getElementById(
                                    "country-dropdown"
                                  ).style.display = "none";
                                }}
                              >
                                <span className="country-flag">
                                  {country.flag}
                                </span>
                                <span className="country-name">
                                  {country.name}
                                </span>
                                <span className="country-code">
                                  {country.code}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        type="tel"
                        name="academyPhone"
                        value={registerFormik.values.academyPhone}
                        onChange={registerFormik.handleChange}
                        onBlur={registerFormik.handleBlur}
                        placeholder="50 123 4567"
                        className={`phone-input ${
                          registerFormik.touched.academyPhone &&
                          registerFormik.errors.academyPhone
                            ? "error"
                            : ""
                        }`}
                      />
                    </div>
                    {registerFormik.touched.academyPhone &&
                      registerFormik.errors.academyPhone && (
                        <div className="error-message">
                          {registerFormik.errors.academyPhone}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="register-form-section">
                <h3>
                  <i className="fas fa-lock"></i> كلمة المرور
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>كلمة المرور *</label>
                    <input
                      type="password"
                      name="password"
                      value={registerFormik.values.password}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="كلمة المرور"
                      className={
                        registerFormik.touched.password &&
                        registerFormik.errors.password
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.password &&
                      registerFormik.errors.password && (
                        <div className="error-message">
                          {registerFormik.errors.password}
                        </div>
                      )}
                  </div>
                  <div className="form-group">
                    <label>تأكيد كلمة المرور *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerFormik.values.confirmPassword}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                      placeholder="تأكيد كلمة المرور"
                      className={
                        registerFormik.touched.confirmPassword &&
                        registerFormik.errors.confirmPassword
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.confirmPassword &&
                      registerFormik.errors.confirmPassword && (
                        <div className="error-message">
                          {registerFormik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="register-form-section">
                <h3>
                  <i className="fas fa-image"></i> شعار الأكاديمية
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>رفع شعار الأكاديمية</label>
                    <input
                      type="file"
                      name="logoURL"
                      accept="image/*"
                      onChange={(event) => {
                        registerFormik.setFieldValue(
                          "logoURL",
                          event.currentTarget.files[0]
                        );
                      }}
                      className={
                        registerFormik.touched.logoURL &&
                        registerFormik.errors.logoURL
                          ? "error"
                          : ""
                      }
                    />
                    {registerFormik.touched.logoURL &&
                      registerFormik.errors.logoURL && (
                        <div className="error-message">
                          {registerFormik.errors.logoURL}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="register-form-section">
                <h3>
                  <i className="fas fa-file-contract"></i> الشروط والأحكام
                </h3>
                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <div className="terms-agreement">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          checked={registerFormik.values.termsAccepted}
                          onChange={registerFormik.handleChange}
                          onBlur={registerFormik.handleBlur}
                          className={
                            registerFormik.touched.termsAccepted &&
                            registerFormik.errors.termsAccepted
                              ? "error"
                              : ""
                          }
                          required
                        />
                        <span className="checkmark"></span>
                        أوافق على
                        <button
                          type="button"
                          className="terms-link-btn"
                          onClick={() => setShowTerms(true)}
                        >
                          الشروط والأحكام
                        </button>
                        *
                      </label>
                      <button
                        type="button"
                        className="view-terms-btn"
                        onClick={() => setShowTerms(true)}
                      >
                        <i className="fas fa-eye"></i> عرض الشروط والأحكام
                      </button>
                    </div>
                    {registerFormik.touched.termsAccepted &&
                      registerFormik.errors.termsAccepted && (
                        <div className="error-message">
                          {registerFormik.errors.termsAccepted}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="register-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowRegister(false)}
                >
                  <i className="fas fa-times"></i> إلغاء
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={registerFormik.isSubmitting}
                >
                  {registerFormik.isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i> تسجيل الأكاديمية
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTerms && <TermsAndConditionsModal />}
    </div>
  );
};

export default Login;
