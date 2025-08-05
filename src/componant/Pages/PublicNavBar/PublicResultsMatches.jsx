import React, { useState, useEffect } from 'react';
import './PublicTeams.css'; // Using existing CSS file for consistency

const PublicResultsMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatchResults();
  }, []);

  const fetchMatchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Get-Score-Matches`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch match results');
      }
      
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>جاري تحميل نتائج المباريات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>حدث خطأ في تحميل البيانات</h3>
          <p>{error}</p>
          <button onClick={fetchMatchResults} className="retry-btn">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-results-container">
      <div className="results-header">
        <h1 className="page-title">نتائج المباريات</h1>
        <div className="results-count">
          عدد المباريات: {matches.length}
        </div>
      </div>

      <div className="matches-grid">
        {matches.map((match, index) => (
          <div key={index} className="match-card">
            <div className="match-header">
              <div className="category-badge">
                {match.category}
              </div>
              <div className="match-status completed">
                {match.matchStatus === 'Completed' ? 'انتهت' : match.matchStatus}
              </div>
            </div>

            <div className="match-content">
              <div className="teams-section">
                <div className="team home-team">
                  <div className="team-logo">
                    <img 
                      src={match.homeLogo} 
                      alt={match.homeTeamName}
                      onError={(e) => {
                        e.target.src = '/logo192.png'; // Fallback logo
                      }}
                    />
                  </div>
                  <div className="team-name">{match.homeTeamName}</div>
                  <div className="team-score winner">{match.homeTeamScore}</div>
                </div>

                <div className="vs-divider">
                  <span>VS</span>
                </div>

                <div className="team away-team">
                  <div className="team-score">{match.awayTeamScore}</div>
                  <div className="team-name">{match.awayTeamName}</div>
                  <div className="team-logo">
                    <img 
                      src={match.awayLogo} 
                      alt={match.awayTeamName}
                      onError={(e) => {
                        e.target.src = '/logo192.png'; // Fallback logo
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="match-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">{formatDate(match.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕐</span>
                  <span className="detail-text">{formatTime(match.time)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏟️</span>
                  <span className="detail-text">{match.stadium}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <h3>لا توجد نتائج مباريات متاحة حالياً</h3>
          <p>سيتم عرض النتائج فور توفرها</p>
        </div>
      )}
    </div>
  );
};

export default PublicResultsMatches;
