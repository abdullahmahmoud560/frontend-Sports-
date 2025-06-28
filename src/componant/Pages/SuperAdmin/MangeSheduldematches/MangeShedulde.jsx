import React, { useEffect, useState } from "react";
import "./MangeShedulde.css";
import axios from "axios";

const MangeShedulde = () => {
  const [matches, setMatches] = useState([]);
  const getMatches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/Get-Matches`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMatches(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMatches();
  }, []);
  return (
    <div className="schedule-page" dir="rtl">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h2 className="schedule-title">
            <span role="img" aria-label="cup">
              🏆
            </span>{" "}
            إدارة المباريات
          </h2>
          <p className="schedule-desc">عرض وإدارة جميع مباريات البطولة</p>
        </div>
        <div className="schedule-filters">
          <button className="refresh-btn">
            تحديث <span className="refresh-icon">⟳</span>
          </button>
          <select className="filter-select">
            <option>جميع الحالات</option>
          </select>
          <select className="filter-select">
            <option>جميع الفئات</option>
          </select>
        </div>
      </div>
      {/* Matches List */}
      {matches.map((match) => (
      <div className="matches-list">
        <div className="match-card match-card--active">
          
            <div>
            <div className="match-status">
              <span className="status-badge status-badge--active">
                {match.matchStatus}
              </span>
            </div>
          <div className="match-info">
            <div className="match-title">
              {match.homeTeam} vs {match.awayTeam}
            </div>
            <div className="match-details">
              <span className="match-location">
                <span className="icon">📍</span> {match.stadium}
              </span>
              <span className="match-time">
                  <span className="icon">⏰</span> {match.time}
              </span>
              <span className="match-date">
                <span className="icon">�</span> {match.date}
              </span>
            </div>
          </div>
          </div>
          
        </div>
      </div>
      ))}
    </div>
  );
};

export default MangeShedulde;
