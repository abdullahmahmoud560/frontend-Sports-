import React, { useEffect, useState } from "react";
import "./TableMangments.css";

// مكون اختيار البطولات
const TournamentsSelector = ({ onTournamentSelect, selectedTournament }) => {
  const tournaments = [
    { id: "skills", name: "بطولة المهارات", icon: "🎯", color: "#a7f3d0" },
    { id: "esports", name: "بطولة الألعاب الالكترونية", icon: "🎮", color: "#a7f3d0" },
    { id: "football", name: "بطولة كرة القدم", icon: "⚽", color: "#a7f3d0" }
  ];

  return (
    <div className="tournaments-container">
      <h2 className="tournaments-title">اختر البطولة</h2>
      <div className="tournaments-grid">
        {tournaments.map((tournament) => (
          <div
            key={tournament.id}
            className={`tournament-card ${selectedTournament === tournament.id ? 'selected' : ''}`}
            onClick={() => onTournamentSelect(tournament.id)}
            style={{ backgroundColor: tournament.color }}
          >
            <div className="tournament-icon">
              {tournament.icon}
            </div>
            <h3 className="tournament-name">{tournament.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون اختيار الفئات العمرية
const AgeCategoriesSelector = ({ onCategorySelect, selectedCategory, selectedTournament }) => {
  const categories = [
    { id: "U12", name: "فئة 12 سنة", icon: "🏃‍♂️", color: "#3b82f6" },
    { id: "U14", name: "فئة 14 سنة", icon: "⚽", color: "#10b981" },
    { id: "U16", name: "فئة 16 سنة", icon: "🏆", color: "#f59e0b" }
  ];

  if (!selectedTournament) return null;

  return (
    <div className="age-categories-container">
      <h2 className="categories-title">اختر الفئة العمرية</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
            onClick={() => onCategorySelect(category.id)}
            style={{ borderColor: category.color }}
          >
            <div className="category-icon" style={{ color: category.color }}>
              {category.icon}
            </div>
            <h3 className="category-name">{category.name}</h3>
            <div className="category-code">{category.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// مكون عرض جدول الترتيب
const RankingTable = ({ selectedTournament, selectedCategory, apiData, loading }) => {
  const tournamentNames = {
    skills: { name: "بطولة المهارات", icon: "🎯" },
    esports: { name: "بطولة الألعاب الالكترونية", icon: "🎮" },
    football: { name: "بطولة كرة القدم", icon: "⚽" }
  };

  const currentTournament = tournamentNames[selectedTournament];
  
  if (!apiData || !currentTournament || loading) return null;

  // تحويل البيانات من API إلى التنسيق المطلوب
  const transformedTeams = apiData.map(team => ({
    name: team.academyName,
    played: team.matchesPlayed,
    won: team.wins,
    draw: team.draws,
    lost: team.losses,
    goalsFor: team.goalsFor,
    goalsAgainst: team.goalsAgainst,
    goalDiff: team.goalDifference,
    points: team.points
  }));

  // ترتيب الفرق حسب النقاط ثم فارق الأهداف
  const sortedTeams = [...transformedTeams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDiff - a.goalDiff;
  });

  const getRankStyle = (index) => {
    if (index === 0) return { backgroundColor: '#FFD700', color: '#000' }; // ذهبي
    if (index === 1) return { backgroundColor: '#C0C0C0', color: '#000' }; // فضي
    if (index === 2) return { backgroundColor: '#CD7F32', color: '#fff' }; // برونزي
    return { backgroundColor: '#ef4343', color: '#fff' }; // أحمر
  };

  return (
    <div className="ranking-table-container">
      {/* رأس الجدول */}
      <div className="table-header">
        <div className="tournament-info">
          <span className="tournament-icon">{currentTournament.icon}</span>
          <h2 className="table-title">جدول الترتيب - {currentTournament.name}</h2>
          <span className="category-badge">{selectedCategory}</span>
        </div>
      </div>

      {/* الجدول */}
      <div className="ranking-table">
        <div className="table-head">
          <div className="rank-header">المركز</div>
          <div className="team-header">الفريق</div>
          <div className="stats-header">لعب</div>
          <div className="stats-header">فاز</div>
          <div className="stats-header">تعادل</div>
          <div className="stats-header">خسر</div>
          <div className="stats-header">له</div>
          <div className="stats-header">عليه</div>
          <div className="stats-header">الفارق</div>
          <div className="points-header">النقاط</div>
        </div>

        <div className="table-body">
          {sortedTeams.map((team, index) => (
            <div key={team.name} className="team-row">
              <div className="rank-cell">
                <span className="rank-badge" style={getRankStyle(index)}>
                  {index + 1}
                </span>
              </div>
              <div className="team-cell">
                <span className="team-name">{team.name}</span>
              </div>
              <div className="stats-cell">{team.played}</div>
              <div className="stats-cell won">{team.won}</div>
              <div className="stats-cell draw">{team.draw}</div>
              <div className="stats-cell lost">{team.lost}</div>
              <div className="stats-cell goals-for">{team.goalsFor}</div>
              <div className="stats-cell goals-against">{team.goalsAgainst}</div>
              <div className={`stats-cell goal-diff ${team.goalDiff >= 0 ? 'positive' : 'negative'}`}>
                {team.goalDiff >= 0 ? '+' : ''}{team.goalDiff}
              </div>
              <div className="points-cell">
                <span className="points-value">{team.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات إضافية */}
      <div className="table-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h4>المتصدر</h4>
              <span className="stat-value">{sortedTeams[0]?.name}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚽</div>
            <div className="stat-content">
              <h4>أكثر تسجيلاً</h4>
              <span className="stat-value">
                {sortedTeams.reduce((max, team) => team.goalsFor > max.goalsFor ? team : max, sortedTeams[0])?.name}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-content">
              <h4>أقل استقبالاً</h4>
              <span className="stat-value">
                {sortedTeams.reduce((min, team) => team.goalsAgainst < min.goalsAgainst ? team : min, sortedTeams[0])?.name}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h4>إجمالي المباريات</h4>
              <span className="stat-value">{sortedTeams.reduce((total, team) => total + team.played, 0) / 2}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TableMangments() {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  // دالة لجلب البيانات من API
  const fetchMatchesTable = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Matches-Table/${selectedCategory}`);
      
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      console.error('Error fetching matches table:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // جلب البيانات عند تغيير الفئة العمرية
  useEffect(() => {
    if (selectedCategory) {
      fetchMatchesTable();
    }
  }, [selectedCategory]);

  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament);
    setSelectedCategory(null); // إعادة تعيين الفئة عند اختيار بطولة جديدة
    setApiData(null); // مسح البيانات السابقة
    setError(null); // مسح الأخطاء السابقة
  };

  const handleCategorySelect = (category) => {
    if (selectedCategory === category) {
      // إذا كانت نفس الفئة المحددة، قم بإلغاء التحديد
      setSelectedCategory(null);
      setApiData(null);
    } else {
      // اختر فئة جديدة وسيتم تحديث البيانات تلقائياً عبر useEffect
      setSelectedCategory(category);
    }
  };

  return (
    <div className="table-mangments-page">
      <div className="page-header">
        <h1 className="page-title">📊 جدول الترتيب</h1>
        <p className="page-subtitle">
          اختر البطولة والفئة العمرية لعرض جدول ترتيب الفرق
        </p>
      </div>

      {/* مكون اختيار البطولات */}
      <TournamentsSelector 
        onTournamentSelect={handleTournamentSelect}
        selectedTournament={selectedTournament}
      />

      {/* مكون اختيار الفئات العمرية - يظهر فقط بعد اختيار البطولة */}
      <AgeCategoriesSelector 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        selectedTournament={selectedTournament}
      />

      {/* حالة التحميل */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل جدول الترتيب...</p>
        </div>
      )}

      {/* حالة الخطأ */}
      {error && (
        <div className="error-container">
          <div className="error-content">
            <h3>❌ خطأ في تحميل البيانات</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={fetchMatchesTable}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* عرض جدول الترتيب عند اختيار البطولة والفئة */}
      {selectedTournament && selectedCategory && !loading && !error && apiData && (
        <RankingTable 
          selectedTournament={selectedTournament} 
          selectedCategory={selectedCategory}
          apiData={apiData}
          loading={loading}
        />
      )}

      {/* رسالة لاختيار بطولة */}
      {!selectedTournament && (
        <div className="no-selection">
          <div className="no-selection-content">
            <h3>🏆 اختر البطولة للبدء</h3>
            <p>من فضلك اختر إحدى البطولات أعلاه لعرض الفئات العمرية</p>
          </div>
        </div>
      )}

      {/* رسالة لاختيار فئة عمرية بعد اختيار البطولة */}
      {selectedTournament && !selectedCategory && !loading && (
        <div className="no-selection">
          <div className="no-selection-content">
            <h3>🔽 اختر الفئة العمرية</h3>
            <p>من فضلك اختر إحدى الفئات أعلاه لعرض جدول الترتيب</p>
          </div>
        </div>
      )}
    </div>
  );
}
