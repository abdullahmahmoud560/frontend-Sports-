import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoalsPublic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [goalsData, setGoalsData] = useState({
    'فئة 12 سنة': [],
    'فئة 14 سنة': [],
    'فئة 16 سنة': []
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState(new Set());

  // Map URL parameters to category names
  const urlToCategory = {
    'U12': 'فئة 12 سنة',
    'U14': 'فئة 14 سنة',
    'U16': 'فئة 16 سنة'
  };

  // Map category names to URL parameters
  const categoryToUrl = {
    'فئة 12 سنة': 'U12',
    'فئة 14 سنة': 'U14',
    'فئة 16 سنة': 'U16'
  };

  const fetchGoalsData = useCallback(async (ageCategory = null) => {
    try {
      setIsLoading(true);
      setError(null);

      // Build URL with age parameter if provided
      let apiUrl = `${process.env.REACT_APP_API_URL}/Public-Goals-Report`;
      if (ageCategory) {
        apiUrl += `/${ageCategory}`;
      }

      console.log('Fetching goals data from API...', { url: apiUrl, ageCategory });
      const response = await fetch(apiUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Goals API Response:', data);
      
      // Process and organize the data by age categories
      const organizedData = organizeGoalsByAge(data, ageCategory);
      console.log('Organized Goals Data:', organizedData);
      setGoalsData(prev => ({...prev, ...organizedData}));
      setHasDataLoaded(true);
      
      // Mark this category as loaded
      if (ageCategory) {
        setLoadedCategories(prev => new Set([...prev, ageCategory]));
      }
      
    } catch (error) {
      console.error('Error fetching goals data:', error);
      setError(`خطأ في تحميل البيانات: ${error.message}`);
      // Set fallback data for testing
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize category from URL on component mount
  useEffect(() => {
    const ageParam = searchParams.get('age');
    if (ageParam && urlToCategory[ageParam]) {
      setSelectedCategory(urlToCategory[ageParam]);
    }
  }, [searchParams, urlToCategory]);

  // Handle category click - fetch data only when category is clicked
  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
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
      const ageParam = categoryToUrl[category];
      fetchGoalsData(ageParam);
    }
  };
  // Function to organize API data by age categories
  const organizeGoalsByAge = (apiData, targetCategory = null) => {
    const organizedData = {};
    
    // Initialize only the target category if specified
    if (targetCategory) {
      const categoryName = urlToCategory[targetCategory];
      if (categoryName) {
        organizedData[categoryName] = [];
      }
    } else {
      // Initialize all categories if no target specified
      organizedData['فئة 12 سنة'] = [];
      organizedData['فئة 14 سنة'] = [];
      organizedData['فئة 16 سنة'] = [];
    }

    // Handle different data structures
    let dataArray = [];
    
    if (Array.isArray(apiData)) {
      dataArray = apiData;
    } else if (apiData && typeof apiData === 'object') {
      // If it's an object, try to extract array from common properties
      if (apiData.data && Array.isArray(apiData.data)) {
        dataArray = apiData.data;
      } else if (apiData.results && Array.isArray(apiData.results)) {
        dataArray = apiData.results;
      } else if (apiData.players && Array.isArray(apiData.players)) {
        dataArray = apiData.players;
      } else {
        console.warn('Cannot find array in API response:', apiData);
        return organizedData;
      }
    } else {
      console.warn('API data is not in expected format:', apiData);
      return organizedData;
    }

    console.log('Processing data array:', dataArray);

    // Organize data by age category
    dataArray.forEach((item, index) => {
      console.log(`Processing item ${index}:`, item);
      
      // Map the API response to your component's data structure
      const playerData = {
        id: item.id || item.playerId || index + 1,
        playerName: item.playerName || item.name || item.player || `لاعب ${index + 1}`,
        team: item.academyName || item.team || item.teamName || item.club || 'فريق غير محدد',
        goals: parseInt(item.goalsCount || item.goals || item.numberOfGoals || 0),
        goalsCount: parseInt(item.goalsCount || item.goals || item.numberOfGoals || 0),
        assists: parseInt(item.assists || item.numberOfAssists || 0),
        matches: parseInt(item.matches || item.matchesPlayed || item.gamesPlayed || 0),
        goalType: item.goalType || item.playerType || item.type || 'لاعب',
        academyName: item.academyName || item.team || item.teamName || 'أكاديمية غير محددة',
        position: item.position || item.pos || 'مركز غير محدد',
        numberShirt: item.numberShirt || item.shirtNumber || 'غير محدد'
      };

      // If targetCategory is specified, add all data to that category
      if (targetCategory) {
        const categoryName = urlToCategory[targetCategory];
        if (categoryName && organizedData[categoryName]) {
          organizedData[categoryName].push(playerData);
        }
      } else {
        // Original logic for when no target category is specified
        const ageCategory = item.ageCategory || item.category || item.age || item.ageGroup;
        
        if (ageCategory === 'U12' || ageCategory === '12' || ageCategory === 12 || 
            (typeof ageCategory === 'string' && ageCategory.includes('12'))) {
          organizedData['فئة 12 سنة']?.push(playerData);
        } else if (ageCategory === 'U14' || ageCategory === '14' || ageCategory === 14 || 
                   (typeof ageCategory === 'string' && ageCategory.includes('14'))) {
          organizedData['فئة 14 سنة']?.push(playerData);
        } else if (ageCategory === 'U16' || ageCategory === '16' || ageCategory === 16 || 
                   (typeof ageCategory === 'string' && ageCategory.includes('16'))) {
          organizedData['فئة 16 سنة']?.push(playerData);
        } else {
          // If no age category is specified, add to U12 as default
          console.log(`No age category found for item, adding to U12. Item:`, item);
          organizedData['فئة 12 سنة']?.push(playerData);
        }
      }
    });

    return organizedData;
  };

  const getPlayerTypeColor = (type) => {
    switch (type) {
      case 'هداف البطولة': return 'goal-gold';
      case 'هدافة البطولة': return 'goal-gold';
      case 'هداف الفريق': return 'goal-blue';
      case 'هدافة الفريق': return 'goal-blue';
      case 'صانع ألعاب': return 'goal-green';
      case 'لاعب مميز': return 'goal-purple';
      case 'لاعبة مميزة': return 'goal-purple';
      case 'لاعب شامل': return 'goal-orange';
      default: return 'goal-gray';
    }
  };

  const calculateAverage = (goals, matches) => {
    return matches > 0 ? (goals / matches).toFixed(1) : '0.0';
  };

  if (isLoading) {
    return (
      <div className="goals-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل إحصائيات الأهداف...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">إحصائيات الأهداف</h1>
            <p className="page-subtitle">عرض وتتبع أهداف ومساعدات اللاعبين حسب الفئات العمرية</p>
          </div>
          <button 
            onClick={() => {
              const currentAge = searchParams.get('age');
              fetchGoalsData(currentAge);
            }}
            disabled={isLoading}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontSize: '14px'
            }}
          >
            {isLoading ? 'جاري التحميل...' : 'تحديث البيانات'}
          </button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="error-container" style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            margin: '16px 0',
            color: '#dc2626'
          }}>
            <p>{error}</p>
            <button 
              onClick={() => {
                const currentAge = searchParams.get('age');
                fetchGoalsData(currentAge);
              }} 
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>

      {/* Age Categories Container */}
      <div className="goals-categories-container">
        <h2 className="categories-title">اختر الفئة العمرية</h2>
        <div className="categories-grid">
          {Object.entries(goalsData).map(([category, players], index) => {
            const colors = ['#3b82f6', '#10b981', '#f59e0b'];
            const icons = ['🏃‍♂️', '⚽', '🏆'];
            const totalGoals = hasDataLoaded ? players.reduce((sum, player) => sum + player.goalsCount, 0) : 0;
            const totalAssists = hasDataLoaded ? players.reduce((sum, player) => sum + player.assists, 0) : 0;
            const topScorer = hasDataLoaded && players.length > 0 ? players.reduce((prev, current) => 
              prev.goalsCount > current.goalsCount ? prev : current) : null;
            
            return (
              <div 
                key={category} 
                className={`category-card ${selectedCategory === category ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category)}
                style={{ borderColor: colors[index] }}
              >
                <div className="category-icon" style={{ color: colors[index] }}>
                  {icons[index]}
                </div>
                <h3 className="category-name">{category}</h3>
                <div className="goals-stats">
                  <div className="stat-item">
                    <span className="stat-number">{totalGoals}</span>
                    <span className="stat-text">هدف</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{totalAssists}</span>
                    <span className="stat-text">مساعدة</span>
                  </div>
                </div>
                {hasDataLoaded && topScorer && (
                  <div className="top-scorer">
                    الهداف: {topScorer.playerName} ({topScorer.goalsCount} هدف)
                  </div>
                )}
                {!hasDataLoaded && (
                  <div className="top-scorer" style={{ color: '#666', fontStyle: 'italic' }}>
                    اضغط لعرض الإحصائيات
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Table */}
      {selectedCategory && (
        <div className="goals-table-container">
          <div className="table-header">
            <h3>إحصائيات لاعبي {selectedCategory}</h3>
            <button 
              className="close-button"
              onClick={() => setSelectedCategory(null)}
            >
              إغلاق
            </button>
          </div>

          {goalsData[selectedCategory].length === 0 ? (
            <div className="no-data">
              <div className="no-data-icon">⚽</div>
              <p>لا توجد إحصائيات في هذه الفئة</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="goals-table">
                <thead>
                  <tr>
                    <th>اسم اللاعب</th>
                    <th>الفريق</th>
                    <th>الأهداف</th>
                  </tr>
                </thead>
                <tbody>
                  {goalsData[selectedCategory]
                    .sort((a, b) => b.goalsCount - a.goalsCount)
                    .map((player, index) => (
                    <tr key={player.id}>
                      <td>
                        <div className="player-info">
                          <div className="player-rank">
                            {index + 1}
                          </div>
                          <div className="player-avatar">
                            {player.playerName.charAt(0)}
                          </div>
                          <span>{player.playerName}</span>
                        </div>
                      </td>
                      <td>{player.academyName}</td>
                      <td>
                        <div className="goals-cell">
                          <span className="goals-number">{player.goalsCount}</span>
                          <span className="goals-icon">⚽</span>
                        </div>
                      </td>
                     
                     
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalsPublic;