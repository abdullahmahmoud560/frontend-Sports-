import { useState, useEffect } from "react";
import axios from "axios";

export const useMatchReportModel = () => {
  const [matchData, setMatchData] = useState({
    matchInfo: {
      homeTeam: "",
      awayTeam: "",
      date: "",
      time: "",
      venue: "",
      matchId: 0,
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
    setMatchData({
      matchInfo: {
        homeTeam: "فريق الأكاديمية",
        awayTeam: "الفريق المنافس",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        venue: "ملعب الأكاديمية",
        matchId: 0,
      },
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
        matchId: matchData.matchInfo.matchId || 0,
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
        "https://sports.runasp.net/api/Add-Matches-Report",
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

  // Player operations
  const updatePlayerData = (playerId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, [field]: value } : player
      ),
    }));
  };

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

  const removePlayer = (playerId) => {
    setMatchData((prev) => ({
      ...prev,
      players: prev.players.filter((player) => player.id !== playerId),
    }));
  };

  // Staff operations
  const updateStaffData = (staffId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      staff: prev.staff.map((staff) =>
        staff.id === staffId ? { ...staff, [field]: value } : staff
      ),
    }));
  };

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

  const removeStaff = (staffId) => {
    setMatchData((prev) => ({
      ...prev,
      staff: prev.staff.filter((staff) => staff.id !== staffId),
    }));
  };

  // Goals operations
  const updateGoalData = (goalId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId ? { ...goal, [field]: value } : goal
      ),
    }));
  };

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

  const removeGoal = (goalId) => {
    setMatchData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }));
  };

  // Cards operations
  const updateCardData = (cardId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      cards: prev.cards.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card
      ),
    }));
  };

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

  const removeCard = (cardId) => {
    setMatchData((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== cardId),
    }));
  };

  // Initialize on mount
  useEffect(() => {
    initializeMatchReport();
  }, []);

  return {
    // State
    matchData,
    isLoading,
    isSaving,
    error,
    success,
    
    // Actions
    saveMatchReport,
    
    // Player operations
    updatePlayerData,
    addNewPlayer,
    removePlayer,
    
    // Staff operations
    updateStaffData,
    addNewStaff,
    removeStaff,
    
    // Goals operations
    updateGoalData,
    addNewGoal,
    removeGoal,
    
    // Cards operations
    updateCardData,
    addNewCard,
    removeCard,
  };
};