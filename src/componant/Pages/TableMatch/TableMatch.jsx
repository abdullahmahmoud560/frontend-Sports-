import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import "./TableMatch.css";

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

// مكون عرض تفاصيل البطولة والفئة
const TournamentDetails = ({ selectedTournament, selectedCategory, apiData, loading }) => {
  const tournamentNames = {
    skills: { name: "بطولة المهارات", icon: "🎯" },
    esports: { name: "بطولة الألعاب الالكترونية", icon: "🎮" },
    football: { name: "بطولة كرة القدم", icon: "⚽" }
  };

  const currentTournament = tournamentNames[selectedTournament];
  
  if (!apiData || !currentTournament || loading) return null;

  // استخراج الفرق الفريدة من المباريات
  const uniqueTeams = [...new Set([
    ...apiData.map(match => match.homeTeamName),
    ...apiData.map(match => match.awayTeamName)
  ])];

  // تحويل بيانات API إلى التنسيق المطلوب
  const transformedMatches = apiData.map(match => ({
    team1: match.homeTeamName,
    team2: match.awayTeamName,
    score1: parseInt(match.homeTeamScore),
    score2: parseInt(match.awayTeamScore),
    date: new Date(match.date).toLocaleDateString('ar-SA'),
    time: match.time,
    stadium: match.stadium,
    status: match.matchStatus,
    homeLogo: match.homeLogo,
    awayLogo: match.awayLogo
  }));

  return (
    <div className="tournament-details-container">
      {/* رأس التفاصيل */}
      <div className="details-header">
        <div className="tournament-info">
          <span className="tournament-icon">{currentTournament.icon}</span>
          <h2 className="details-title">{currentTournament.name}</h2>
          <span className="category-badge">{selectedCategory}</span>
        </div>
      </div>

      {/* قائمة الفرق */}
      <div className="teams-section">
        <h3 className="section-title">🏆 الفرق المشاركة</h3>
        <div className="teams-grid">
          {uniqueTeams.map((team, index) => (
            <div key={index} className="team-item">
              <div className="team-rank">{index + 1}</div>
              <div className="team-name">{team}</div>
            </div>
          ))}
        </div>
      </div>

      {/* نتائج المباريات */}
      <div className="matches-section">
        <h3 className="section-title">⚽ نتائج المباريات</h3>
        <div className="matches-list">
          {transformedMatches.map((match, index) => (
            <div key={index} className="match-result">
              <div className="match-info">
                <div className="match-date">{match.date}</div>
                <div className="match-time">{match.time}</div>
                <div className="match-stadium">{match.stadium}</div>
                <div className={`match-status ${match.status.toLowerCase()}`}>
                  {match.status === 'Completed' ? 'انتهت' : 'قادمة'}
                </div>
              </div>
              <div className="match-teams">
                <div className="team-score">
                  {match.homeLogo && (
                    <img src={match.homeLogo} alt={match.team1} className="team-logo" onError={(e) => e.target.style.display = 'none'} />
                  )}
                  <span className="team">{match.team1}</span>
                  <span className="score">{match.score1}</span>
                </div>
                <div className="vs">VS</div>
                <div className="team-score">
                  <span className="score">{match.score2}</span>
                  <span className="team">{match.team2}</span>
                  {match.awayLogo && (
                    <img src={match.awayLogo} alt={match.team2} className="team-logo" onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* إحصائيات */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h4>عدد الفرق</h4>
              <span className="stat-value">{uniqueTeams.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚽</div>
            <div className="stat-content">
              <h4>عدد المباريات</h4>
              <span className="stat-value">{transformedMatches.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h4>البطولة</h4>
              <span className="stat-value">{currentTournament.name}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h4>الفئة</h4>
              <span className="stat-value">{selectedCategory}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TableMatch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);

  // Map URL parameters to category names
  const urlToCategory = {
    'U12': 'U12',
    'U14': 'U14',
    'U16': 'U16'
  };

  // Map category names to URL parameters
  const categoryToUrl = {
    'U12': 'U12',
    'U14': 'U14',
    'U16': 'U16'
  };

  // Initialize category from URL on component mount
  useEffect(() => {
    const ageParam = searchParams.get('age');
    if (ageParam && urlToCategory[ageParam]) {
      setSelectedCategory(urlToCategory[ageParam]);
    }
  }, [searchParams, urlToCategory]);

  // Fetch matches data from API
  const fetchMatchesData = useCallback(async (ageCategory = null) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching matches data from API...', { ageCategory });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Get-Score-Matches`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Matches API Response:', data);
      
      // Filter data by age category if specified
      let filteredData = data;
      if (ageCategory) {
        filteredData = data.filter(match => match.category === ageCategory);
      }
      
      setApiData(filteredData);
      setHasDataLoaded(true);
      
    } catch (error) {
      console.error('Error fetching matches data:', error);
      setError(`خطأ في تحميل البيانات: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament);
    setSelectedCategory(null);
    setApiData(null);
    setError(null);
    // Remove age parameter from URL when changing tournament
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('age');
    setSearchParams(newParams);
  };

  // Handle category click - fetch data only when category is clicked
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setApiData(null);
      // Remove age parameter from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('age');
      setSearchParams(newParams);
    } else {
      setSelectedCategory(category);
      // Add age parameter to URL
      const newParams = new URLSearchParams(searchParams);
      newParams.set('age', categoryToUrl[category]);
      setSearchParams(newParams);
      
      // Always fetch data for the selected category
      fetchMatchesData(category);
    }
  };

  return (
    <div className="table-match-page">
      <div className="page-header">
        <h1 className="page-title">📊 جدول المباريات</h1>
        <p className="page-subtitle">
          اختر البطولة والفئة العمرية لعرض التفاصيل والنتائج
        </p>
      </div>

      {/* مكون اختيار البطولات */}
      <TournamentsSelector 
        onTournamentSelect={handleTournamentSelect}
        selectedTournament={selectedTournament}
      />

      {/* مكون اختيار الفئات العمرية - يظهر فقط بعد اختيار البطولة */}
      <AgeCategoriesSelector 
        onCategorySelect={handleCategoryClick}
        selectedCategory={selectedCategory}
        selectedTournament={selectedTournament}
      />

      {/* حالة التحميل */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل البيانات...</p>
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
              onClick={() => {
                const currentAge = searchParams.get('age');
                fetchMatchesData(currentAge);
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}

      {/* عرض التفاصيل عند اختيار البطولة والفئة */}
      {selectedTournament && selectedCategory && !loading && !error && apiData && (
        <TournamentDetails 
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
            <p>من فضلك اختر إحدى الفئات أعلاه لعرض تفاصيل البطولة والنتائج</p>
          </div>
        </div>
      )}
    </div>
  );
}
