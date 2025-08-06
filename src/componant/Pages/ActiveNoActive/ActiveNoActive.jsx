import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import "./ActiveNoActive.css";
import { toast, Toaster } from "react-hot-toast";

const ActiveNoActive = () => {
  const [activePlayersData, setActivePlayersData] = useState([]);
  const [inactivePlayersData, setInactivePlayersData] = useState([]);
  const [selectedView, setSelectedView] = useState("active"); // 'active', 'inactive', 'both'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasDataLoaded, setHasDataLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // User role state
  const [userRole, setUserRole] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false);
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [formData, setFormData] = useState({
    PLayerName: "",
    BirthDate: "",
    Possition: "",
    NumberShirt: "",
    Nationality: "",
    category: "",
    URLPassport: null,
    URLImage: null,
  });

  // Image preview states
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [passportImagePreview, setPassportImagePreview] = useState(null);

  // Admin action states
  const [processingPlayers, setProcessingPlayers] = useState(new Set());
  const [actionError, setActionError] = useState(null);

  // Categories for filtering
  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "U12", label: "فئة 12 سنة" },
    { value: "U14", label: "فئة 14 سنة" },
    { value: "U16", label: "فئة 16 سنة" },
  ];

  // Fetch all players data from the new API
  const fetchAllPlayersData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setError("لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى.");
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Get-All-Players-By-Academy`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("All Players API Response:", data);

      // Filter players into active and inactive based on their status
      const allPlayers = data || [];
      const activePlayers = allPlayers.filter(
        (player) => player.statu === true
      );
      const inactivePlayers = allPlayers.filter(
        (player) => player.statu === false
      );

      console.log("Active Players:", activePlayers);
      console.log("Inactive Players:", inactivePlayers);

      setActivePlayersData(activePlayers);
      setInactivePlayersData(inactivePlayers);
      setHasDataLoaded(true);
    } catch (error) {
      console.error("Error fetching all players data:", error);
      setError(`خطأ في تحميل بيانات اللاعبين: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Wrapper function for refreshing data
  const fetchAllData = useCallback(async () => {
    await fetchAllPlayersData();
  }, [fetchAllPlayersData]);

  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.Role || decoded.role || "";
        setUserRole(role);
        setIsAdmin(role === "Admin" || role === "admin" || role === "ADMIN");
        console.log(
          "User role detected:",
          role,
          "Is Admin:",
          role === "Admin" || role === "admin" || role === "ADMIN"
        );
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null);
        setIsAdmin(false);
      }
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filter players based on search term and category
  const filterPlayers = (players) => {
    return players.filter((player) => {
      const matchesSearch =
        searchTerm === "" ||
        (player.PLayerName &&
          player.PLayerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.FullName &&
          player.FullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.name &&
          player.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.playerName &&
          player.playerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.Nationality &&
          player.Nationality.toLowerCase().includes(
            searchTerm.toLowerCase()
          )) ||
        (player.Possition &&
          player.Possition.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (player.NumberShirt &&
          player.NumberShirt.toString().includes(searchTerm));

      const matchesCategory =
        selectedCategory === "all" ||
        (player.category && player.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered data based on current view
  const getDisplayData = () => {
    switch (selectedView) {
      case "active":
        return {
          title: "اللاعبون النشطون",
          players: filterPlayers(activePlayersData),
          totalCount: activePlayersData.length,
          color: "#22c55e",
        };
      case "inactive":
        return {
          title: "اللاعبون غير النشطين",
          players: filterPlayers(inactivePlayersData),
          totalCount: inactivePlayersData.length,
          color: "#ef4444",
        };
      case "both":
        return {
          title: "جميع اللاعبين",
          players: [
            ...filterPlayers(activePlayersData).map((p) => ({
              ...p,
              status: "active",
            })),
            ...filterPlayers(inactivePlayersData).map((p) => ({
              ...p,
              status: "inactive",
            })),
          ],
          totalCount: activePlayersData.length + inactivePlayersData.length,
          color: "#6366f1",
        };
      default:
        return { title: "", players: [], totalCount: 0, color: "#6b7280" };
    }
  };

  const displayData = getDisplayData();

  // Refresh data
  const handleRefresh = () => {
    fetchAllData();
  };

  // Open edit modal for inactive players only
  const handleEditPlayer = (player) => {
    console.log(player);
    if (player.status === "active" || selectedView === "active") {
      return; // Don't allow editing active players
    }

    setEditingPlayer(player);
    setFormData({
      PLayerName:
        player.PLayerName ||
        player.FullName ||
        player.name ||
        player.playerName ||
        "",
      BirthDate: player.BirthDate ? player.BirthDate.split("T")[0] : "",
      Possition: player.Possition || player.position || "",
      NumberShirt: player.NumberShirt || player.number || "",
      Nationality: player.Nationality || "",
      category: player.category || "",
      URLPassport: null,
      URLImage: null,
    });

    // Set existing image previews if available
    setProfileImagePreview(player.URLImage || player.profileImageUrl || null);
    setPassportImagePreview(
      player.URLPassport || player.passportImageUrl || null
    );
    setIsEditModalOpen(true);
    setUpdateError(null);
  };

  // Close edit modal
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingPlayer(null);
    setFormData({
      PLayerName: "",
      BirthDate: "",
      Possition: "",
      NumberShirt: "",
      Nationality: "",
      category: "",
      URLPassport: null,
      URLImage: null,
    });
    setProfileImagePreview(null);
    setPassportImagePreview(null);
    setUpdateError(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file changes
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        setUpdateError("يرجى اختيار ملف صورة صحيح (JPEG, PNG, GIF)");
        return;
      }
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setUpdateError(
          "حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 5 ميجابايت"
        );
        return;
      }

      // Update form data
      setFormData((prev) => ({
        ...prev,
        [imageType]: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (imageType === "URLImage") {
          setProfileImagePreview(event.target.result);
        } else if (imageType === "URLPassport") {
          setPassportImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);

      // Clear any previous error
      setUpdateError(null);
    }
  };

  // Remove image
  const handleRemoveImage = (imageType) => {
    setFormData((prev) => ({
      ...prev,
      [imageType]: null,
    }));

    if (imageType === "URLImage") {
      setProfileImagePreview(null);
    } else if (imageType === "URLPassport") {
      setPassportImagePreview(null);
    }
  };

  // Helper function to remove player from processing set
  const removeFromProcessing = (playerId) => {
    setProcessingPlayers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(playerId);
      return newSet;
    });
  };

  const handleAcceptPlayer = async (player, notes, statu) => {
    // Add player ID to processing set
    setProcessingPlayers((prev) => new Set(prev).add(player.id));
    setActionError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/AcceptOrReject-Players`,
        {
          method: "POST",
          body: JSON.stringify({
            playerID: player.id,
            statu: statu,
            notes: notes,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      toast.success("تم قبول اللاعب بنجاح");
      // Move player from inactive to active if accepted
      if (statu === true) {
        const activatedPlayer = { ...player, statu: true };
        setInactivePlayersData((prev) =>
          prev.filter((p) => p.id !== player.id)
        );
        setActivePlayersData((prev) => [...prev, activatedPlayer]);
        console.log("تم قبول اللاعب بنجاح");
      }
    } catch (error) {
      console.error("Error processing player:", error);
    } finally {
      removeFromProcessing(player.id);
    }
  };

  // Reject player (Admin only)
  const handleRejectPlayer = async (player, notes, statu) => {


    // Add player ID to processing set
    setProcessingPlayers((prev) => new Set(prev).add(player.id));
    setActionError(null);

    try {
      const token = localStorage.getItem("token");


      // API call to reject player
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/AcceptOrReject-Players`,
        {
          method: "POST",
          body: JSON.stringify({
            playerID: player.id,
            statu: statu,
            notes: notes,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      toast.success("تم رفض اللاعب بنجاح");
      // Remove player from inactive list when rejected
      setInactivePlayersData((prev) => prev.filter((p) => p.id !== player.id));

      console.log("تم رفض اللاعب بنجاح");
    } catch (error) {
      console.error("Error rejecting player:", error);
      setActionError(`خطأ في رفض اللاعب: ${error.message}`);
    } finally {
      // Remove player ID from processing set
      removeFromProcessing(player.id);
    }
  };

  // Update player via API
  const handleUpdatePlayer = async (e) => {
    e.preventDefault();

    if (!editingPlayer || !editingPlayer.id) {
      setUpdateError("معرف اللاعب غير متوفر");
      return;
    }

    try {
      setIsUpdating(true);
      setUpdateError(null);

      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setUpdateError(
          "لم يتم العثور على رمز التحقق. يرجى تسجيل الدخول مرة أخرى."
        );
        return;
      }

      // Prepare FormData for file uploads
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("id", editingPlayer.id);
      formDataToSend.append("PLayerName", formData.PLayerName || "");
      formDataToSend.append("BirthDate", formData.BirthDate || "");
      formDataToSend.append("Possition", formData.Possition || "");
      formDataToSend.append("NumberShirt", formData.NumberShirt || "");
      formDataToSend.append("Nationality", formData.Nationality || "");
      formDataToSend.append("category", formData.category || "");

      // Add image files if selected
      if (formData.URLImage) {
        formDataToSend.append("URLImage", formData.URLImage);
      }
      if (formData.URLPassport) {
        formDataToSend.append("URLPassport", formData.URLPassport);
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/Update-Player/${editingPlayer.id}`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Don't set Content-Type header when sending FormData - browser will set it automatically with boundary
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Player updated successfully:", result);

      // Update the local data
      const updatedPlayerData = {
        ...editingPlayer,
        PLayerName: formData.PLayerName,
        BirthDate: formData.BirthDate,
        Possition: formData.Possition,
        NumberShirt: formData.NumberShirt,
        Nationality: formData.Nationality,
        category: formData.category,
        // Update image URLs if API returns them in the response
        URLImage: result.URLImage || editingPlayer.URLImage,
        URLPassport: result.URLPassport || editingPlayer.URLPassport,
      };

      // Update inactive players data - no status change since we removed isActive field
      setInactivePlayersData((prev) =>
        prev.map((p) => (p.id === editingPlayer.id ? updatedPlayerData : p))
      );

      // Close modal
      handleCloseModal();

      // Show success message (you could add a toast notification here)
      console.log("تم تحديث بيانات اللاعب بنجاح");
    } catch (error) {
      console.error("Error updating player:", error);
      setUpdateError(`خطأ في تحديث بيانات اللاعب: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !hasDataLoaded) {
    return (
      <div className="active-inactive-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>جاري تحميل بيانات اللاعبين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="active-inactive-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="fas fa-users"></i>
            إدارة اللاعبين النشطين وغير النشطين
          </h1>
          <button
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <i className={`fas fa-sync-alt ${isLoading ? "fa-spin" : ""}`}></i>
            تحديث البيانات
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card active-stat">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <h3>اللاعبون النشطون</h3>
            <p className="stat-number">{activePlayersData.length}</p>
          </div>
        </div>

        <div className="stat-card inactive-stat">
          <div className="stat-icon">
            <i className="fas fa-user-times"></i>
          </div>
          <div className="stat-content">
            <h3>اللاعبون غير النشطين</h3>
            <p className="stat-number">{inactivePlayersData.length}</p>
          </div>
        </div>

        <div className="stat-card total-stat">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>إجمالي اللاعبين</h3>
            <p className="stat-number">
              {activePlayersData.length + inactivePlayersData.length}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="view-toggle-container">
        <button
          className={`toggle-btn ${selectedView === "active" ? "active" : ""}`}
          onClick={() => setSelectedView("active")}
        >
          <i className="fas fa-user-check"></i>
          اللاعبون النشطون
        </button>
        <button
          className={`toggle-btn ${
            selectedView === "inactive" ? "active" : ""
          }`}
          onClick={() => setSelectedView("inactive")}
        >
          <i className="fas fa-user-times"></i>
          اللاعبون غير النشطين
        </button>
        <button
          className={`toggle-btn ${selectedView === "both" ? "active" : ""}`}
          onClick={() => setSelectedView("both")}
        >
          <i className="fas fa-users"></i>
          عرض الجميع
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-container">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="البحث عن لاعب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
          <button className="retry-btn" onClick={handleRefresh}>
            <i className="fas fa-redo"></i>
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Admin Action Error Display */}
      {actionError && (
        <div className="error-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {actionError}
          </div>
          <button className="retry-btn" onClick={() => setActionError(null)}>
            <i className="fas fa-times"></i>
            إغلاق
          </button>
        </div>
      )}

      {/* Players Data Display */}
      {hasDataLoaded && !error && (
        <div className="players-container">
          <div
            className="container-header"
            style={{ borderColor: displayData.color }}
          >
            <h2
              className="container-title"
              style={{ color: displayData.color }}
            >
              {displayData.title}
            </h2>
            <span
              className="players-count"
              style={{ backgroundColor: displayData.color }}
            >
              {displayData.players.length} من أصل {displayData.totalCount}
            </span>
          </div>

          {displayData.players.length === 0 ? (
            <div className="no-players-message">
              <i className="fas fa-users-slash"></i>
              <p>لا توجد لاعبين متاحين حسب المعايير المحددة</p>
            </div>
          ) : (
            <div className="players-grid">
              {displayData.players.map((player, index) => (
                <div
                  key={index}
                  className={`player-card ${player.status || selectedView}`}
                >
                  <div className="player-header">
                    <div className="player-avatar">
                      {player.URLImage || player.profileImageUrl ? (
                        <img
                          src={player.URLImage || player.profileImageUrl}
                          alt={
                            player.PLayerName ||
                            player.FullName ||
                            player.name ||
                            player.playerName ||
                            "صورة اللاعب"
                          }
                          className="player-avatar-image"
                        />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <div className="player-status-badge">
                      {selectedView === "both" ? (
                        <span className={`status-indicator ${player.status}`}>
                          <i
                            className={`fas ${
                              player.status === "active"
                                ? "fa-check-circle"
                                : "fa-times-circle"
                            }`}
                          ></i>
                          {player.status === "active" ? "نشط" : "غير نشط"}
                        </span>
                      ) : (
                        <span className={`status-indicator ${selectedView}`}>
                          <i
                            className={`fas ${
                              selectedView === "active"
                                ? "fa-check-circle"
                                : "fa-times-circle"
                            }`}
                          ></i>
                          {selectedView === "active" ? "نشط" : "غير نشط"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="player-info">
                    <h3 className="player-name">
                      {player.pLayerName}
                    </h3>

                    {player.possition && (
                      <p className="player-position">
                        <i className="fas fa-map-marker-alt"></i>
                        {player.possition}
                      </p>
                    )}

                    {player.numberShirt && (
                      <p className="player-number">
                        <i className="fas fa-hashtag"></i>
                        رقم {player.umberShirt}
                      </p>
                    )}

                    {player.nationality && (
                      <p className="player-nationality">
                        <i className="fas fa-flag"></i>
                        {player.nationality}
                      </p>
                    )}

                    {player.ageCategory && (
                      <p className="player-category">
                        <i className="fas fa-layer-group"></i>
                        {player.ageCategory}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons for Inactive Players Only */}
                  {(player.status === "inactive" ||
                    selectedView === "inactive" ||
                    (selectedView === "both" &&
                      player.status === "inactive")) && (
                    <div className="player-actions">
                      {isAdmin ? (
                        // Admin sees Accept/Reject buttons
                        <>
                          <button
                            className="accept-player-btn"
                            onClick={() =>
                              handleAcceptPlayer(
                                player,
                                "تم قبول اللاعب من قبل الإدارة",
                                true
                              )
                            }
                            disabled={processingPlayers.has(player.id)}
                            title="قبول اللاعب"
                          >
                            <i
                              className={`fas ${
                                processingPlayers.has(player.id)
                                  ? "fa-spinner fa-spin"
                                  : "fa-check"
                              }`}
                            ></i>
                            قبول
                          </button>
                          <button
                            className="reject-player-btn"
                            onClick={() =>
                              handleRejectPlayer(
                                player,
                                "تم رفض اللاعب من قبل الإدارة",
                                false
                              )
                            }
                            disabled={processingPlayers.has(player.id)}
                            title="رفض اللاعب"
                          >
                            <i
                              className={`fas ${
                                processingPlayers.has(player.id)
                                  ? "fa-spinner fa-spin"
                                  : "fa-times"
                              }`}
                            ></i>
                            رفض
                          </button>
                        </>
                      ) : (
                        // Non-admin sees Edit button
                        <button
                          className="edit-player-btn"
                          onClick={() => handleEditPlayer(player)}
                          title="تعديل بيانات اللاعب"
                        >
                          <i className="fas fa-edit"></i>
                          تعديل
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Player Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-edit"></i>
                تعديل بيانات اللاعب
              </h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUpdatePlayer} className="edit-form">
              {updateError && (
                <div className="update-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  {updateError}
                </div>
              )}

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="PLayerName">اسم اللاعب</label>
                  <input
                    type="text"
                    id="PLayerName"
                    name="PLayerName"
                    value={formData.PLayerName}
                    onChange={handleInputChange}
                    placeholder="أدخل اسم اللاعب"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="BirthDate">تاريخ الميلاد</label>
                  <input
                    type="date"
                    id="BirthDate"
                    name="BirthDate"
                    value={formData.BirthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Possition">المركز</label>
                  <select
                    id="Possition"
                    name="Possition"
                    value={formData.Possition}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">اختر المركز</option>
                    <option value="حارس مرمى">حارس مرمى</option>
                    <option value="مدافع">مدافع</option>
                    <option value="وسط ميدان">وسط ميدان</option>
                    <option value="مهاجم">مهاجم</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="NumberShirt">رقم القميص</label>
                  <input
                    type="number"
                    id="NumberShirt"
                    name="NumberShirt"
                    value={formData.NumberShirt}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم القميص"
                    min="1"
                    max="99"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Nationality">الجنسية</label>
                  <input
                    type="text"
                    id="Nationality"
                    name="Nationality"
                    value={formData.Nationality}
                    onChange={handleInputChange}
                    placeholder="أدخل جنسية اللاعب"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">الفئة العمرية</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">اختر الفئة العمرية</option>
                    <option value="U12">فئة 12 سنة</option>
                    <option value="U14">فئة 14 سنة</option>
                    <option value="U16">فئة 16 سنة</option>
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="images-section">
                <h3 className="images-title">
                  <i className="fas fa-images"></i>
                  صور اللاعب
                </h3>

                <div className="images-grid">
                  {/* URLImage - Profile Image */}
                  <div className="image-upload-group">
                    <label className="image-upload-label">
                      <i className="fas fa-user-circle"></i>
                      صورة شخصية (URLImage)
                    </label>

                    <div className="image-upload-container">
                      {profileImagePreview ? (
                        <div className="image-preview">
                          <img
                            src={profileImagePreview}
                            alt="معاينة الصورة الشخصية"
                            className="preview-image"
                          />
                          <div className="image-overlay">
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => handleRemoveImage("URLImage")}
                              title="إزالة الصورة"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <label
                              className="change-image-btn"
                              htmlFor="URLImage"
                            >
                              <i className="fas fa-edit"></i>
                              تغيير
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="URLImage"
                          className="upload-placeholder"
                        >
                          <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                          </div>
                          <p>انقر لرفع صورة شخصية</p>
                          <span className="upload-hint">
                            JPEG, PNG, GIF (أقل من 5MB)
                          </span>
                        </label>
                      )}

                      <input
                        type="file"
                        id="URLImage"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "URLImage")}
                        className="image-input"
                        hidden
                      />
                    </div>
                  </div>

                  {/* URLPassport - Passport Image */}
                  <div className="image-upload-group">
                    <label className="image-upload-label">
                      <i className="fas fa-passport"></i>
                      صورة جواز السفر (URLPassport)
                    </label>

                    <div className="image-upload-container">
                      {passportImagePreview ? (
                        <div className="image-preview">
                          <img
                            src={passportImagePreview}
                            alt="معاينة صورة جواز السفر"
                            className="preview-image"
                          />
                          <div className="image-overlay">
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => handleRemoveImage("URLPassport")}
                              title="إزالة الصورة"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <label
                              className="change-image-btn"
                              htmlFor="URLPassport"
                            >
                              <i className="fas fa-edit"></i>
                              تغيير
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="URLPassport"
                          className="upload-placeholder"
                        >
                          <div className="upload-icon">
                            <i className="fas fa-cloud-upload-alt"></i>
                          </div>
                          <p>انقر لرفع صورة جواز السفر</p>
                          <span className="upload-hint">
                            JPEG, PNG, GIF (أقل من 5MB)
                          </span>
                        </label>
                      )}

                      <input
                        type="file"
                        id="URLPassport"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "URLPassport")}
                        className="image-input"
                        hidden
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseModal}
                  disabled={isUpdating}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      حفظ التغييرات
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default ActiveNoActive;
