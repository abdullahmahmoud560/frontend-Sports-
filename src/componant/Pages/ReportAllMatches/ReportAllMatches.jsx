import React, { useState, useEffect } from "react";
import "./ReportAllMatches.css";
import axios from "axios";

export default function ReportAllMatches({
  matchId,
  matchData: initialMatchData,
  onClose,
}) {
  const [matchData, setMatchData] = useState({
    matchInfo: {
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      venue: "",
      matchId: matchId || 0,
    },
    players: [],
    goals: [],
    cards: [],
    staff: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize match report data
  const initializeMatchReport = () => {
    // استخدام بيانات المباراة المرسلة أو البيانات الافتراضية
    const matchInfo = initialMatchData
      ? {
          homeTeam:
            initialMatchData.homeTeam ||
            initialMatchData.team1Name ||
            "فريق الأكاديمية",
          awayTeam:
            initialMatchData.awayTeam ||
            initialMatchData.team2Name ||
            "الفريق المنافس",
          date: initialMatchData.date
            ? new Date(initialMatchData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          time:
            initialMatchData.time ||
            new Date().toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          venue:
            initialMatchData.venue ||
            initialMatchData.location ||
            "ملعب الأكاديمية",
          matchId: matchId || initialMatchData.id || 0,
        }
      : {
          homeTeam: "فريق الأكاديمية",
          awayTeam: "الفريق المنافس",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("ar-SA", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          venue: "ملعب الأكاديمية",
          matchId: matchId || 0,
        };

    setMatchData({
      matchInfo,
      players: [],
      goals: [],
      cards: [],
      staff: [
        {
          id: 1,
          techName: "المدرب الرئيسي",
          role: "المدرب الرئيسي",
          notes: "",
        },
        {
          id: 2,
          techName: "المدرب المساعد",
          role: "المدرب المساعد",
          notes: "",
        },
        { id: 3, techName: "الطبيب", role: "الطبيب", notes: "" },
      ],
    });
    setIsLoading(false);
  };

  // Save/Update match report using Add-Matches-Report API
  const saveMatchReport = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(false);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error(
          "لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى."
        );
      }

      // Prepare data according to API structure
      const reportData = {
        matchId: matchId || matchData.matchInfo.matchId || 0,
        players: matchData.players.map((player) => ({
          playerName: player.name || player.pLayerName || "",
          position: player.position || "",
          essential: player.basic || "",
          reserve: player.reserve || "",
          notes: player.matchNotes || "",
        })),
        goals: matchData.goals || [],
        cards: matchData.cards || [],
        staff: matchData.staff.map((staffMember) => ({
          techName: staffMember.techName || staffMember.name || "",
          role: staffMember.role || staffMember.position || "",
          notes: staffMember.notes || "",
        })),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/Add-Matches-Report`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setSuccess(true);
        // Update matchData with response if needed
        if (response.data.matchId && !matchData.matchInfo.matchId) {
          setMatchData((prev) => ({
            ...prev,
            matchInfo: {
              ...prev.matchInfo,
              matchId: response.data.matchId,
            },
          }));
        }

        // Show success message for 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving match report:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "خطأ في حفظ تقرير المباراة"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle field updates - removed updateMatchInfo as we only edit tables

  // Update player data
  const updatePlayerData = (playerId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, [field]: value } : player
      ),
    }));
  };

  // Update staff data
  const updateStaffData = (staffId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      staff: prev.staff.map((staff) =>
        staff.id === staffId ? { ...staff, [field]: value } : staff
      ),
    }));
  };

  // Update goals data
  const updateGoalData = (goalId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId ? { ...goal, [field]: value } : goal
      ),
    }));
  };

  // Update cards data
  const updateCardData = (cardId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }));
  };

  // Add new player
  const addNewPlayer = () => {
    const newId =
      Math.max(
        ...(matchData.players.length > 0
          ? matchData.players.map((p) => p.id)
          : [0]),
        0
      ) + 1;
    const newPlayer = {
      id: newId,
      name: "",
      position: "",
      basic: "",
      reserve: "",
      matchNotes: "",
    };
    setMatchData((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  // Remove player
  const removePlayer = (playerId) => {
    setMatchData((prev) => ({
      ...prev,
      players: prev.players.filter((player) => player.id !== playerId),
    }));
  };

  // Add new staff member
  const addNewStaff = () => {
    const newId = Math.max(...matchData.staff.map((s) => s.id), 0) + 1;
    const newStaff = {
      id: newId,
      techName: "",
      role: "",
      notes: "",
    };
    setMatchData((prev) => ({
      ...prev,
      staff: [...prev.staff, newStaff],
    }));
  };

  // Remove staff member
  const removeStaff = (staffId) => {
    setMatchData((prev) => ({
      ...prev,
      staff: prev.staff.filter((staff) => staff.id !== staffId),
    }));
  };

  // Add new goal
  const addNewGoal = () => {
    const newId =
      Math.max(
        ...(matchData.goals.length > 0
          ? matchData.goals.map((g) => g.id)
          : [0]),
        0
      ) + 1;
    const newGoal = {
      id: newId,
      playerName: "",
      acadamyName: "",
      minute: "",
      notes: "",
    };
    setMatchData((prev) => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  };

  // Remove goal
  const removeGoal = (goalId) => {
    setMatchData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }));
  };

  // Add new card
  const addNewCard = () => {
    const newId =
      Math.max(
        ...(matchData.cards.length > 0
          ? matchData.cards.map((c) => c.id)
          : [0]),
        0
      ) + 1;
    const newCard = {
      id: newId,
      playerName: "",
      acadamyName: "",
      cardType: "",
      notes: "",
    };
    setMatchData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
  };

  // Remove card
  const removeCard = (cardId) => {
    setMatchData((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));
  };

  useEffect(() => {
    initializeMatchReport();
  }, [matchId, initialMatchData]); // إضافة التبعيات

  if (isLoading) {
    return (
      <div className="report-matches-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل تقرير المباريات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-matches-page">
      {/* Header */}
      <div className="page-header">
        {onClose && (
          <button className="back-btn" onClick={onClose}>
            <i className="back-icon">←</i>
            العودة إلى قائمة المباريات
          </button>
        )}
        <h1 className="page-title">تقرير المباراة</h1>
        {initialMatchData && (
          <div className="match-info-header">
            <span className="teams">
              {matchData.matchInfo.homeTeam} vs {matchData.matchInfo.awayTeam}
            </span>
            <span className="match-date">{matchData.matchInfo.date}</span>
          </div>
        )}
        <p className="page-subtitle">
          تعديل جميع بيانات اللاعبين والجهاز الفني/الإداري - إضافة وحذف وتعديل
        </p>

        {/* Status Messages */}
        {error && (
          <div className="error-message">
            <i className="error-icon">⚠️</i>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <i className="success-icon">✅</i>
            تم حفظ جميع التعديلات بنجاح!
          </div>
        )}
      </div>
      {/* Match Info */}

      {/* Players Table */}
      <div className="players-section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="section-icon">👥</i>
            قائمة اللاعبين (Players)
          </h3>
          <button
            className="add-section-button players-add"
            onClick={addNewPlayer}
          >
            <i className="add-icon">➕</i>
            إضافة لاعب
          </button>
        </div>
        <div className="table-container players-table-container">
          <table className="data-table players-table">
            <thead>
              <tr>
                <th>م</th>
                <th>playerName</th>
                <th>position</th>
                <th>essential</th>
                <th>reserve</th>
                <th>notes</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matchData.players.map((player, index) => (
                <tr key={player.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={player.name}
                      onChange={(e) =>
                        updatePlayerData(player.id, "name", e.target.value)
                      }
                      placeholder="اسم اللاعب"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={player.position}
                      onChange={(e) =>
                        updatePlayerData(player.id, "position", e.target.value)
                      }
                      placeholder="المركز"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={player.basic}
                      onChange={(e) =>
                        updatePlayerData(player.id, "basic", e.target.value)
                      }
                      placeholder="أساسي"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={player.reserve}
                      onChange={(e) =>
                        updatePlayerData(player.id, "reserve", e.target.value)
                      }
                      placeholder="احتياطي"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={player.matchNotes}
                      onChange={(e) =>
                        updatePlayerData(
                          player.id,
                          "matchNotes",
                          e.target.value
                        )
                      }
                      placeholder="ملاحظات"
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removePlayer(player.id)}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {matchData.players.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    لا توجد لاعبين - اضغط "إضافة لاعب" لإضافة بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goals Table */}
      <div className="goals-section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="section-icon">⚽</i>
            الأهداف (Goals)
          </h3>
          <button className="add-section-button goals-add" onClick={addNewGoal}>
            <i className="add-icon">➕</i>
            إضافة هدف
          </button>
        </div>
        <div className="table-container goals-table-container">
          <table className="data-table goals-table">
            <thead>
              <tr>
                <th>م</th>
                <th>playerName</th>
                <th>acadamyName</th>
                <th>minute</th>
                <th>notes</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matchData.goals.map((goal, index) => (
                <tr key={goal.id}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      className="table-select"
                      value={goal.playerName}
                      onChange={(e) =>
                        updateGoalData(goal.id, "playerName", e.target.value)
                      }
                    >
                      <option value="">اختر اللاعب</option>
                      {matchData.players.map((player) => (
                        <option key={player.id} value={player.name}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={goal.acadamyName}
                      onChange={(e) =>
                        updateGoalData(goal.id, "acadamyName", e.target.value)
                      }
                      placeholder="اسم الأكاديمية"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="table-input minute-input"
                      value={goal.minute}
                      onChange={(e) =>
                        updateGoalData(goal.id, "minute", e.target.value)
                      }
                      placeholder="الدقيقة"
                      min="1"
                      max="120"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={goal.notes}
                      onChange={(e) =>
                        updateGoalData(goal.id, "notes", e.target.value)
                      }
                      placeholder="ملاحظات"
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeGoal(goal.id)}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {matchData.goals.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    لا توجد أهداف - اضغط "إضافة هدف" لإضافة بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Table */}
      <div className="cards-section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="section-icon">🟨</i>
            البطاقات (Cards)
          </h3>
          <button className="add-section-button cards-add" onClick={addNewCard}>
            <i className="add-icon">➕</i>
            إضافة بطاقة
          </button>
        </div>
        <div className="table-container cards-table-container">
          <table className="data-table cards-table">
            <thead>
              <tr>
                <th>م</th>
                <th>playerName</th>
                <th>acadamyName</th>
                <th>cardType</th>
                <th>notes</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matchData.cards.map((card, index) => (
                <tr key={card.id}>
                  <td>{index + 1}</td>
                  <td>
                    <select
                      className="table-select"
                      value={card.playerName}
                      onChange={(e) =>
                        updateCardData(card.id, "playerName", e.target.value)
                      }
                    >
                      <option value="">اختر اللاعب</option>
                      {matchData.players.map((player) => (
                        <option key={player.id} value={player.name}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={card.acadamyName}
                      onChange={(e) =>
                        updateCardData(card.id, "acadamyName", e.target.value)
                      }
                      placeholder="اسم الأكاديمية"
                    />
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={card.cardType}
                      onChange={(e) =>
                        updateCardData(card.id, "cardType", e.target.value)
                      }
                    >
                      <option value="">نوع البطاقة</option>
                      <option value="yellow">صفراء</option>
                      <option value="red">حمراء</option>
                      <option value="second_yellow">صفراء ثانية</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={card.notes}
                      onChange={(e) =>
                        updateCardData(card.id, "notes", e.target.value)
                      }
                      placeholder="ملاحظات"
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeCard(card.id)}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {matchData.cards.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-state">
                    لا توجد بطاقات - اضغط "إضافة بطاقة" لإضافة بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Table */}
      <div className="staff-section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="section-icon">👨‍⚕️</i>
            الطاقم الفني (Staff)
          </h3>
          <button
            className="add-section-button staff-add"
            onClick={addNewStaff}
          >
            <i className="add-icon">➕</i>
            إضافة عضو
          </button>
        </div>
        <div className="table-container staff-table-container">
          <table className="data-table staff-table">
            <thead>
              <tr>
                <th>م</th>
                <th>techName</th>
                <th>role</th>
                <th>notes</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {matchData.staff.map((staff, index) => (
                <tr key={staff.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={staff.techName}
                      onChange={(e) =>
                        updateStaffData(staff.id, "techName", e.target.value)
                      }
                      placeholder="اسم العضو"
                    />
                  </td>
                  <td>
                    <select
                      className="table-select"
                      value={staff.role}
                      onChange={(e) =>
                        updateStaffData(staff.id, "role", e.target.value)
                      }
                    >
                      <option value="">اختر الدور</option>
                      <option value="main_coach">مدرب رئيسي</option>
                      <option value="assistant_coach">مدرب مساعد</option>
                      <option value="goalkeeper_coach">مدرب حراس</option>
                      <option value="doctor">طبيب</option>
                      <option value="physiotherapist">أخصائي علاج طبيعي</option>
                      <option value="manager">مدير</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="table-input"
                      value={staff.notes}
                      onChange={(e) =>
                        updateStaffData(staff.id, "notes", e.target.value)
                      }
                      placeholder="ملاحظات"
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeStaff(staff.id)}
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Section */}
      <div className="submit-section">
        <div className="submit-container">
          <div className="submit-info">
            <h4>إرسال تقرير المباراة</h4>
            <p>تأكد من إدخال جميع البيانات المطلوبة قبل الإرسال</p>
          </div>
          <button
            className="submit-report-btn"
            onClick={saveMatchReport}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <i className="loading-spinner">⏳</i>
                جاري الإرسال...
              </>
            ) : (
              <>
                <i className="submit-icon">🚀</i>
                إرسال التقرير
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Footer */}
      <div className="report-footer">
        <div className="footer-info">
          <p>تم إنشاء التقرير في: {new Date().toLocaleDateString("ar-SA")}</p>
          <p>التوقيت: {new Date().toLocaleTimeString("ar-SA")}</p>
        </div>
        <div className="signatures">
          <div className="signature-box">
            <span>توقيع المدرب</span>
            <div className="signature-line"></div>
          </div>
          <div className="signature-box">
            <span>توقيع الحكم</span>
            <div className="signature-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
