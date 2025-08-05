import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Teams.css";

// Search and Filter Component
const SearchAndFilter = ({ searchTerm, setSearchTerm, sortBy, setSortBy }) => {
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
          placeholder="Search for an academy..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-box">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Sort by Name</option>
          <option value="country">Sort by Country</option>
        </select>
      </div>
    </div>
  );
};

// All Academies Display Component
const AllAcademiesDisplay = ({ academies, onAcademyClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [hoveredAcademy, setHoveredAcademy] = useState(null);

  // Filter and search academies
  const filteredAcademies = academies.filter((academy) =>
    academy.academyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    academy.academyCountry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort academies
  const sortedAcademies = [...filteredAcademies].sort((a, b) => {
    switch (sortBy) {
      case "country":
        return a.academyCountry.localeCompare(b.academyCountry);
      case "name":
      default:
        return a.academyName.localeCompare(b.academyName);
    }
  });

  // Get top 3 academies (for demonstration, using first 3)
  const topAcademies = academies.slice(0, 3);

  return (
    <div className="all-teams-container">
      {/* Display top 3 academies */}
      {searchTerm === "" && sortBy === "name" && (
        <div className="top-teams-section">
          <h2 className="section-title">🏆 Top 3 Academies</h2>
          <div className="top-teams-grid">
            {topAcademies.map((academy, index) => (
              <div
                key={academy.id}
                className={`top-team-card rank-${index + 1}`}
                onClick={() => onAcademyClick(academy)}
              >
                <div className="rank-badge">{index + 1}</div>
                <img
                  src={academy.logoURL || "https://via.placeholder.com/150x150/1e40af/ffffff?text=Academy"}
                  alt={academy.academyName}
                  className="top-team-logo"
                />
                <h3 className="top-team-name">{academy.academyName}</h3>
                <div className="top-team-score">{academy.academyCountry}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {sortedAcademies.length === 0 ? (
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
          <h3>No Results Found</h3>
          <p>Try searching with different keywords</p>
        </div>
      ) : (
        <div className="teams-grid">
          {sortedAcademies.map((academy, index) => (
            <div
              key={academy.id || index}
              className={`team-card ${
                hoveredAcademy === academy.id ? "hovered" : ""
              }`}
              onClick={() => onAcademyClick(academy)}
              onMouseEnter={() => setHoveredAcademy(academy.id)}
              onMouseLeave={() => setHoveredAcademy(null)}
            >
              <div className="team-card-header">
                <div className="team-logo-container">
                  <img
                    src={academy.logoURL || "https://via.placeholder.com/150x150/1e40af/ffffff?text=Academy"}
                    alt={academy.academyName}
                    className="team-logo"
                  />
                  <div className="team-score-badge">
                    {academy.statue ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="team-info">
                  <h3 className="team-name">{academy.academyName}</h3>
                  <div className="team-meta w-full flex flex-col justify-end items-center">
                    <span className="team-position">Country: {academy.academyCountry}</span>
                  </div>
                </div>
              </div>
              <div className="team-card-footer">
                <div className="team-stats-mini">
                  <div className="stat-mini">
                    <span className="stat-label-mini">Phone</span>
                    <span className="stat-value-mini">{academy.academyPhone}</span>
                  </div>
                  <div className="stat-mini">
                    <span className="stat-label-mini">Category</span>
                    <span className="stat-value-mini">
                      {academy.under14 ? "U14 " : ""}
                      {academy.under16 ? "U16 " : ""}
                      {academy.under18 ? "U18" : ""}
                    </span>
                  </div>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="teams-summary">
        <div className="summary-item">
          <span className="summary-label">Total Academies</span>
          <span className="summary-value">{academies.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Displayed Academies</span>
          <span className="summary-value">{sortedAcademies.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Active Academies</span>
          <span className="summary-value">
            {academies.filter(a => a.statue).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Teams() {
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAcademy, setSelectedAcademy] = useState(null);
  const [displayMode, setDisplayMode] = useState("all");

  // Fetch academies from API
  useEffect(() => {
    const fetchAcademies = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Get-All-Academies`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAcademies(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch academies");
        console.error("Error fetching academies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcademies();
  }, []);

  const showAcademyDetails = (academy) => {
    setSelectedAcademy(academy);
  };

  if (loading) {
    return (
      <div className="teams-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Academies...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teams-page">
        <div className="error-container">
          <h2>Error Loading Academies</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="teams-page">
      <div className="view-toggle-container">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${displayMode === "all" ? "active" : ""}`}
            onClick={() => setDisplayMode("all")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            View All Academies
          </button>
        </div>
      </div>

      {/* Display all academies */}
      {displayMode === "all" && (
        <AllAcademiesDisplay academies={academies} onAcademyClick={showAcademyDetails} />
      )}

      {/* Academy Details Modal */}
      {selectedAcademy && (
        <div className="modal-overlay" onClick={() => setSelectedAcademy(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <img
                src={selectedAcademy.logoURL}
                alt={selectedAcademy.academyName}
                className="modal-team-logo"
              />
              <h2>{selectedAcademy.academyName}</h2>
              <button
                className="close-button"
                onClick={() => setSelectedAcademy(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="team-stats">
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className="stat-value">
                    {selectedAcademy.statue ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Country</span>
                  <span className="stat-value">{selectedAcademy.academyCountry}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Phone</span>
                  <span className="stat-value">{selectedAcademy.academyPhone}</span>
                </div>
              </div>
              <div className="team-info-details">
                <h3>Academy Information</h3>
                <p>
                  <strong>Email:</strong> {selectedAcademy.academyEmail}
                </p>
                <p>
                  <strong>Category:</strong>
                </p>
                <ul>
                  {selectedAcademy.under14 && <li>Under 14</li> }
                  {selectedAcademy.under16 && <li>Under 16</li>}
                  {selectedAcademy.under18 && <li>Under 18</li>}
                  {selectedAcademy.statue && <li>معتمده</li>}
                  {!selectedAcademy.statue && <li>غير معتمده</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
