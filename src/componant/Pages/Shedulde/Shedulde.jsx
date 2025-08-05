import React, { useState, useEffect } from "react";
import "./Shedulde.css";

export default function Shedulde() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playersData, setPlayersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [filterAcademy, setFilterAcademy] = useState("all");

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const PlayerDetailsModal = ({ player, onClose }) => {
    if (!player) return null;
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="player-avatar">
              <span className="player-number">{player.numberShirt}</span>
            </div>
            <h2>{player.pLayerName}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <div className="player-stats">
              <div className="stat-item">
                <span className="stat-label">الأكاديمية</span>
                <span className="stat-value">{player.academyName}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">الفئة العمرية</span>
                <span className="stat-value">{player.category}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">المركز</span>
                <span className="stat-value">{player.possition}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">رقم القميص</span>
                <span className="stat-value">{player.numberShirt}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">الأهداف</span>
                <span className="stat-value">{player.goals || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">البطاقات الصفراء</span>
                <span className="stat-value">{player.yellowCards || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">البطاقات الحمراء</span>
                <span className="stat-value">{player.redCards || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">الجنسية</span>
                <span className="stat-value">{player.nationality}</span>
              </div>
            </div>
            <div className="player-info-details">
              <h3>معلومات اللاعب</h3>
              <p><strong>تاريخ الميلاد:</strong> {new Date(player.birthDate).toLocaleDateString('ar-SA')}</p>
              <p><strong>العمر:</strong> {calculateAge(player.birthDate)} سنة</p>
              <p><strong>معرف اللاعب:</strong> {player.id}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchPlayersData();
  }, []);

  const fetchPlayersData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/Get-All-Players`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      
      // Transform API data to match our component structure
      const transformedData = transformApiData(data);
      setPlayersData(transformedData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players data:', err);
    } finally {
      setLoading(false);
    }
  };

  const transformApiData = (apiData) => {
    return apiData.map(player => ({
      id: player.id,
      pLayerName: player.pLayerName,
      academyName: player.academyName,
      category: player.category,
      birthDate: player.birthDate,
      possition: player.possition,
      numberShirt: player.numberShirt,
      goals: player.goals,
      yellowCards: player.yellowCards,
      redCards: player.redCards,
      nationality: player.nationality,
      academyId: player.academyId,
      logo: `https://via.placeholder.com/150x150/${getRandomColor()}/ffffff?text=${encodeURIComponent(player.pLayerName.charAt(0))}`
    }));
  };

  const getRandomColor = () => {
    const colors = ['1e40af', 'dc2626', '059669', '7c3aed', 'ea580c', 'be185d', '0891b2', '16a34a', '9333ea', 'c2410c', '0d9488', 'be123c'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const showPlayerDetails = (player) => {
    setSelectedPlayer(player);
  };

  // Filter players based on search and filters
  const filteredPlayers = playersData.filter(player => {
    const matchesSearch = player.pLayerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.academyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === "all" || player.possition === filterPosition;
    const matchesAcademy = filterAcademy === "all" || player.academyName === filterAcademy;
    
    return matchesSearch && matchesPosition && matchesAcademy;
  });

  // Get unique positions and academies for filters
  const uniquePositions = [...new Set(playersData.map(player => player.possition))];
  const uniqueAcademies = [...new Set(playersData.map(player => player.academyName))];

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
      <div className="error-container">
        <div className="error-message">خطأ في تحميل البيانات: {error}</div>
        <button onClick={fetchPlayersData} className="retry-button">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="players-page">
      {/* Header Section */}
      <div className="players-header">
        <h1 className="page-title">قائمة اللاعبين</h1>
        <p className="page-subtitle">استكشف جميع اللاعبين المسجلين في الأكاديميات</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            className="search-input"
            placeholder="البحث عن لاعب أو أكاديمية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <select
            className="filter-select"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="all">جميع المراكز</option>
            {uniquePositions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
          
          <select
            className="filter-select"
            value={filterAcademy}
            onChange={(e) => setFilterAcademy(e.target.value)}
          >
            <option value="all">جميع الأكاديميات</option>
            {uniqueAcademies.map(academy => (
              <option key={academy} value={academy}>{academy}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Players Summary */}
      <div className="players-summary">
        <div className="summary-item">
          <span className="summary-label">إجمالي اللاعبين</span>
          <span className="summary-value">{playersData.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">عدد الأكاديميات</span>
          <span className="summary-value">{uniqueAcademies.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">النتائج المعروضة</span>
          <span className="summary-value">{filteredPlayers.length}</span>
        </div>
      </div>

      {/* Players Grid */}
      <div className="players-container">
        {filteredPlayers.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">👥</div>
            <h3>لا توجد نتائج</h3>
            <p>جرب تغيير معايير البحث أو الفلترة</p>
          </div>
        ) : (
          <div className="players-grid">
            {filteredPlayers.map((player, index) => (
              <div key={player.id} className="player-card" onClick={() => showPlayerDetails(player)}>
                <div className="player-card-header">
                  <div className="player-logo-container">
                    <img src={player.logo} alt={player.pLayerName} className="player-logo" />
                    <div className="player-number-badge">{player.numberShirt}</div>
                  </div>
                  <div className="player-info">
                    <h3 className="player-name">{player.pLayerName}</h3>
                    <div className="player-meta">
                      <span className="player-position">{player.possition}</span>
                      <span className="player-academy">{player.academyName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="player-card-footer">
                  <div className="player-stats-mini">
                    <div className="stat-mini">
                      <span className="stat-label-mini">أهداف</span>
                      <span className="stat-value-mini">{player.goals || 0}</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-label-mini">أصفر</span>
                      <span className="stat-value-mini yellow">{player.yellowCards || 0}</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-label-mini">أحمر</span>
                      <span className="stat-value-mini red">{player.redCards || 0}</span>
                    </div>
                  </div>
                  
                  <div className="player-details-mini">
                    <span className="player-age">العمر: {calculateAge(player.birthDate)} سنة</span>
                    <span className="player-nationality">{player.nationality}</span>
                  </div>
                  
                  <button className="view-details-btn">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
