import React, { useEffect, useState } from "react";
import "./Matches.css";
import axios from "axios";

// مكون عرض تفاصيل المباراة
const MatchDetailsModal = ({ match, onClose }) => {
  if (!match) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content match-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>تفاصيل المباراة</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="match-info-grid">
            <div className="match-date-time">
              <h3>📅 التاريخ والوقت</h3>
              <p className="date">{match.date}</p>
              <p className="time">{match.time}</p>
            </div>
            <div className="match-stadium">
              <h3>🏟️ الاستاد</h3>
              <p>{match.stadium}</p>
            </div>
            <div className="match-category">
              <h3>🏆 الفئة</h3>
              <p>{match.category}</p>
            </div>
            <div className="match-status">
              <h3>📊 حالة المباراة</h3>
              <span className={`status-badge ${match.status.toLowerCase()}`}>
                {match.status}
              </span>
            </div>
          </div>

          <div className="teams-details">
            <div className="team-detail">
              <h3>{match.team1.name}</h3>
              <img
                src={match.team1.logo}
                alt={match.team1.name}
                className="team-logo-large"
              />
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">عدد اللاعبين</span>
                  <span className="stat-value">
                    {match.team1.players?.length || 0}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">الكابتن</span>
                  <span className="stat-value">
                    {match.team1.captain || "غير محدد"}
                  </span>
                </div>
              </div>
            </div>

            <div className="vs-section">
              <div className="vs-badge">VS</div>
              <div className="score">
                {match.status === "مكتملة" ? (
                  <>
                    <span className="score-number">
                      {match.team1.score || 0}
                    </span>
                    <span className="score-separator">-</span>
                    <span className="score-number">
                      {match.team2.score || 0}
                    </span>
                  </>
                ) : (
                  <span className="upcoming">قريباً</span>
                )}
              </div>
            </div>

            <div className="team-detail">
              <h3>{match.team2.name}</h3>
              <img
                src={match.team2.logo}
                alt={match.team2.name}
                className="team-logo-large"
              />
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">عدد اللاعبين</span>
                  <span className="stat-value">
                    {match.team2.players?.length || 0}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">الكابتن</span>
                  <span className="stat-value">
                    {match.team2.captain || "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون اختيار الفئات العمرية
const AgeCategoriesSelector = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { id: "U12", name: "فئة 12 سنة", icon: "🏃‍♂️", color: "#3b82f6" },
    { id: "U14", name: "فئة 14 سنة", icon: "⚽", color: "#10b981" },
    { id: "U16", name: "فئة 16 سنة", icon: "🏆", color: "#f59e0b" }
  ];
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

// مكون البحث والفلترة للمباريات
const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
}) => {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <svg
          className="search-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="البحث عن فريق أو استاد..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-box">
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="filter-select"
        >
          <option value="all">جميع المباريات</option>
          <option value="upcoming">المباريات القادمة</option>
          <option value="completed">المباريات المكتملة</option>
          <option value="live">المباريات المباشرة</option>
        </select>
      </div>
    </div>
  );
};

// مكون عرض المباريات
const MatchesGrid = ({ matches, onMatchClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [hoveredMatch, setHoveredMatch] = useState(null);

  // فلترة وبحث المباريات
  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.category.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    switch (filterBy) {
      case "upcoming":
        matchesFilter = match.status === "قادمة";
        break;
      case "completed":
        matchesFilter = match.status === "مكتملة";
        break;
      case "live":
        matchesFilter = match.status === "مباشرة";
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  // ترتيب المباريات حسب التاريخ
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return dateA - dateB;
  });
  return (
    <div className="matches-container">
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      {sortedMatches.length === 0 ? (
        <div className="no-results">
          <svg
            className="no-results-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33"
            />
          </svg>
          <h3>لا توجد مباريات</h3>
          <p>جرب البحث بكلمات مختلفة أو تغيير الفلتر</p>
        </div>
      ) : (
        <div className="matches-grid">
          {sortedMatches.map((match, index) => (
            <div
              key={match.id}
              className={`match-card ${
                hoveredMatch === match.id ? "hovered" : ""
              }`}
              onClick={() => onMatchClick(match)}
              onMouseEnter={() => setHoveredMatch(match.id)}
              onMouseLeave={() => setHoveredMatch(null)}
            >
              <div className="match-header">
                <div className="match-date-time">
                  <div className="date-badge">
                    <span className="date-icon">📅</span>
                    <span className="date-text">{match.date}</span>
                  </div>
                  <div className="time-badge">
                    <span className="time-icon">🕐</span>
                    <span className="time-text">{match.time}</span>
                  </div>
                </div>
                <div className="match-status-badge">
                  <span
                    className={`status-indicator ${match.status.toLowerCase()}`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>

              <div className="match-teams">
                <div className="team-section">
                  <div className="team-logo">
                    <img src={match.team1.logo} alt={match.team1.name} />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{match.team1.name}</h3>
                    <p className="team-category">{match.category}</p>
                  </div>
                </div>

                <div className="vs-section">
                  <div className="vs-badge">VS</div>
                  {match.status === "مكتملة" && (
                    <div className="score-display">
                      <span className="score">{match.team1.score || 0}</span>
                      <span className="score-separator">-</span>
                      <span className="score">{match.team2.score || 0}</span>
                    </div>
                  )}
                </div>

                <div className="team-section">
                  <div className="team-logo">
                    <img src={match.team2.logo} alt={match.team2.name} />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">{match.team2.name}</h3>
                    <p className="team-category">{match.category}</p>
                  </div>
                </div>
              </div>

              <div className="match-footer">
                <div className="stadium-info">
                  <span className="stadium-icon">🏟️</span>
                  <span className="stadium-name">{match.stadium}</span>
                </div>
                <button className="view-match-details-btn">عرض التفاصيل</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="matches-summary">
        <div className="summary-item">
          <span className="summary-label">إجمالي المباريات</span>
          <span className="summary-value">{matches.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">المباريات المعروضة</span>
          <span className="summary-value">{sortedMatches.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">المباريات القادمة</span>
          <span className="summary-value">
            {matches.filter((m) => m.status === "قادمة").length}
          </span>
        </div>
        <div className="summary-item">
          <span className="summary-label">المباريات المكتملة</span>
          <span className="summary-value">
            {matches.filter((m) => m.status === "مكتملة").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Matches() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchMatches = async (category = "U12") => {
    console.log(category);
    try {
      setLoading(true);
      const endpoint = category 
        ? `${process.env.REACT_APP_API_URL}/Get-Matches/${category}`
        : `${process.env.REACT_APP_API_URL}/Get-Matches`;
      
      const response = await axios.get(endpoint);

      // تحويل البيانات من API إلى الشكل المطلوب
      const formattedMatches = response.data.map((match, index) => ({
        id: match.id || index + 1,
        date: match.date || "2024-01-15",
        time: match.time || "20:00",
        stadium: match.stadium || "استاد محمد بن زايد",
        category: match.category || "الدوري المحلي",
        status: match.status || "قادمة",
        team1: {
          name: match.team1Name || "الفريق الأول",
          logo:
            match.team1Logo ||
            "https://via.placeholder.com/80x80/1e40af/ffffff?text=فريق1",
          score: match.team1Score,
          captain: match.team1Captain,
          players: match.team1Players || [],
        },
        team2: {
          name: match.team2Name || "الفريق الثاني",
          logo:
            match.team2Logo ||
            "https://via.placeholder.com/80x80/dc2626/ffffff?text=فريق2",
          score: match.team2Score,
          captain: match.team2Captain,
          players: match.team2Players || [],
        },
      }));

      setMatches(formattedMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);

      setError("حدث خطأ في تحميل المباريات");
      // بيانات تجريبية في حالة فشل API
      setMatches([
        {
          id: 1,
          date: "2024-01-15",
          time: "20:00",
          stadium: "استاد محمد بن زايد",
          category: "الدوري المحلي",
          status: "قادمة",
          team1: {
            name: "العين",
            logo: "https://via.placeholder.com/80x80/1e40af/ffffff?text=العين",
            score: null,
            captain: "أحمد عبدالله",
            players: [],
          },
          team2: {
            name: "الوحدة",
            logo: "https://via.placeholder.com/80x80/dc2626/ffffff?text=الوحدة",
            score: null,
            captain: "سعيد راشد",
            players: [],
          },
        },
        {
          id: 2,
          date: "2024-01-14",
          time: "18:30",
          stadium: "استاد الشارقة",
          category: "كأس الخليج",
          status: "مكتملة",
          team1: {
            name: "الجزيرة",
            logo: "https://via.placeholder.com/80x80/059669/ffffff?text=الجزيرة",
            score: 2,
            captain: "محمد سعيد",
            players: [],
          },
          team2: {
            name: "الشارقة",
            logo: "https://via.placeholder.com/80x80/7c3aed/ffffff?text=الشارقة",
            score: 1,
            captain: "عبدالله سعيد",
            players: [],
          },
        },
        {
          id: 3,
          date: "2024-01-16",
          time: "19:45",
          stadium: "استاد الوصل",
          category: "الدوري المحلي",
          status: "مباشرة",
          team1: {
            name: "النصر",
            logo: "https://via.placeholder.com/80x80/ea580c/ffffff?text=النصر",
            score: 1,
            captain: "سعيد محمد",
            players: [],
          },
          team2: {
            name: "الوصل",
            logo: "https://via.placeholder.com/80x80/be185d/ffffff?text=الوصل",
            score: 1,
            captain: "علي سعيد",
            players: [],
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchMatches(category);
  };

  const showMatchDetails = (match) => {
    setSelectedMatch(match);
  };

  if (loading) {
    return (
      <div className="matches-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المباريات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="matches-page">
        <div className="error-container">
          <h3>خطأ في التحميل</h3>
          <p>{error}</p>
          <button onClick={fetchMatches} className="retry-btn">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-page">
      <div className="page-header">
        <h1 className="page-title">⚽ المباريات</h1>
        <p className="page-subtitle">
          عرض جميع المباريات مع تفاصيل الفريقين والتواريخ
        </p>
      </div>

      {/* مكون اختيار الفئات العمرية */}
      <AgeCategoriesSelector 
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />

      {/* عرض المباريات فقط عند اختيار فئة */}
      {selectedCategory && (
        <MatchesGrid matches={matches} onMatchClick={showMatchDetails} />
      )}

      {/* رسالة لاختيار فئة */}
      {!selectedCategory && !loading && (
        <div className="no-category-selected">
          <div className="no-category-content">
            <h3>🔽 اختر الفئة العمرية لعرض المباريات</h3>
            <p>من فضلك اختر إحدى الفئات أعلاه لعرض المباريات المخصصة لها</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
