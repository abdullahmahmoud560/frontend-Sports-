# ActiveNoActive Component

## Overview
The `ActiveNoActive` component is a comprehensive React component designed to manage and display both active and inactive players data from a single API that gets all players. It provides a user-friendly interface for viewing, filtering, and managing player status information by automatically separating players into active and inactive categories on the frontend.

## APIs Used

### 1. Get All Players API
- **Endpoint**: `https://sports.runasp.net/api/Get-All-Players-By-Academy`
- **Method**: GET
- **Authentication**: Bearer Token (from localStorage)
- **Description**: Fetches data for all players from the academy
- **Data Processing**: Frontend filters players into active and inactive based on status fields

### 2. Update Player API
- **Endpoint**: `https://sports.runasp.net/api/Update-Player/{id}`
- **Method**: POST (changed from PUT)
- **Authentication**: Bearer Token (from localStorage)
- **Content-Type**: multipart/form-data (for file uploads)
- **Description**: Updates player information using player ID
- **Fields**: Updates these specific fields:
  - `PLayerName`: Player's name
  - `BirthDate`: Date of birth
  - `Possition`: Playing position
  - `NumberShirt`: Jersey number
  - `Nationality`: Player's nationality
  - `category`: Age category
  - `URLImage`: Profile image file
  - `URLPassport`: Passport image file

## Features

### 📊 Statistics Dashboard
- **Active Players Count**: Real-time count of active players
- **Inactive Players Count**: Real-time count of inactive players
- **Total Players**: Combined count of all players
- **Visual Statistics Cards**: Color-coded cards with icons and animations

### 🔍 Filtering & Search
- **Text Search**: Search players by name, team name, or other attributes
- **Category Filter**: Filter by age categories (U12, U14, U16, All)
- **Real-time Filtering**: Instant results as you type or select filters

### 👁️ View Modes
- **Active Only**: Display only active players
- **Inactive Only**: Display only inactive players
- **Combined View**: Display all players with status indicators

### ✏️ Edit Functionality (Inactive Players Only)
- **Edit Modal**: Professional modal form for editing player details
- **Complete Player Fields**: Edit all essential player information:
  - **PLayerName**: Player's name
  - **BirthDate**: Date of birth
  - **Possition**: Playing position (goalkeeper, defender, midfielder, forward)
  - **NumberShirt**: Jersey/shirt number (1-99)
  - **Nationality**: Player's nationality
  - **category**: Age category (U12, U14, U16)
  - **URLImage**: Profile image upload
  - **URLPassport**: Passport image upload
- **Image Upload**: Upload and edit profile and passport images
- **Image Preview**: Real-time image preview with edit/remove options
- **File Validation**: Image type and size validation (max 5MB)
- **Real-time Updates**: Immediate UI updates after successful API calls
- **Validation**: Form validation and error handling
- **Responsive Form**: Mobile-friendly edit interface

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **RTL Support**: Full right-to-left language support for Arabic
- **Modern UI**: Clean, professional design with smooth animations
- **Status Indicators**: Visual badges showing player status
- **Loading States**: Spinner and loading messages during data fetch
- **Error Handling**: User-friendly error messages with retry options

## Component Structure

```
ActiveNoActive/
├── ActiveNoActive.jsx    # Main component file
├── ActiveNoActive.css    # Styling and responsive design
└── README.md            # Documentation (this file)
```

## Props
This component doesn't require any props as it manages its own state and data fetching.

## State Management

### Data States
- `activePlayersData`: Array of active players
- `inactivePlayersData`: Array of inactive players
- `hasDataLoaded`: Boolean indicating if initial data load is complete

### UI States
- `selectedView`: Current view mode ('active', 'inactive', 'both')
- `searchTerm`: Current search filter text
- `selectedCategory`: Current category filter
- `isLoading`: Loading state indicator
- `error`: Error message if API calls fail

### Edit States
- `isEditModalOpen`: Controls edit modal visibility
- `editingPlayer`: Currently selected player for editing
- `formData`: Edit form data state with fields:
  - `PLayerName`: Player's name
  - `BirthDate`: Date of birth
  - `Possition`: Playing position
  - `NumberShirt`: Jersey number
  - `Nationality`: Player's nationality
  - `category`: Age category
  - `URLImage`: Profile image file
  - `URLPassport`: Passport image file
- `isUpdating`: Loading state for update operation
- `updateError`: Error message for update operations
- `profileImagePreview`: Preview URL for URLImage
- `passportImagePreview`: Preview URL for URLPassport

## API Integration

### Authentication
The component uses JWT token authentication stored in localStorage:
```javascript
const token = localStorage.getItem('token');
```

### Error Handling
- **Network Errors**: Displays user-friendly error messages
- **Authentication Errors**: Prompts for re-login if token is missing/invalid
- **API Errors**: Shows specific error messages with retry options

### Data Processing
The component handles various data formats and safely accesses player properties:
- Supports both `name` and `playerName` fields
- Handles missing or null values gracefully
- Provides fallbacks for undefined properties

### Player Status Filtering
The component automatically filters players from the single API response:
- **Active Players**: `player.isActive === true` OR `player.status === 'active'` OR `player.active === true`
- **Inactive Players**: `player.isActive === false` OR `player.status === 'inactive'` OR `player.active === false` OR players with no status field
- **Frontend Processing**: All filtering happens on the client side for better performance

### Edit Functionality
The edit feature is restricted to inactive players only:
- **Player Selection**: Edit button appears only for inactive players
- **Form Pre-population**: All existing player data is loaded into the form
- **Image Handling**: 
  - Supports profile and passport image uploads
  - Real-time image preview with edit/remove options
  - File validation (JPEG, PNG, GIF, max 5MB)
  - FormData submission for file uploads
- **Real-time Updates**: Local state updates immediately upon successful API call
- **Status Change**: Players can be moved from inactive to active status
- **Validation**: Form validation ensures data integrity before submission

## Usage Example

```jsx
import ActiveNoActive from './componant/Pages/ActiveNoActive/ActiveNoActive';

function App() {
  return (
    <div>
      <ActiveNoActive />
    </div>
  );
}
```

## Styling Classes

### Main Container
- `.active-inactive-page`: Main container with RTL direction
- `.page-header`: Header section with title and refresh button
- `.stats-container`: Statistics cards container

### Interactive Elements
- `.toggle-btn`: View mode toggle buttons
- `.search-input`: Search input field
- `.category-select`: Category filter dropdown

### Data Display
- `.players-grid`: Responsive grid for player cards
- `.player-card`: Individual player card
- `.status-indicator`: Player status badge
- `.player-actions`: Container for edit button
- `.edit-player-btn`: Edit button for inactive players

### Modal & Form
- `.modal-overlay`: Background overlay for modal
- `.edit-modal`: Main modal container
- `.modal-header`: Modal header with title and close button
- `.edit-form`: Form container
- `.form-grid`: Responsive form grid layout
- `.form-group`: Individual form field container
- `.checkbox-group`: Checkbox field styling
- `.modal-actions`: Modal action buttons container

### Image Upload
- `.images-section`: Image upload section container
- `.images-grid`: Grid layout for image upload fields
- `.image-upload-group`: Individual image upload container
- `.upload-placeholder`: Upload area when no image is selected
- `.image-preview`: Container for image preview
- `.image-overlay`: Overlay with edit/remove buttons on hover
- `.remove-image-btn`: Button to remove uploaded image
- `.change-image-btn`: Button to change/replace image

### States
- `.loading-container`: Loading state display
- `.error-container`: Error message container
- `.no-players-message`: Empty state message

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Support for high contrast preferences
- **Reduced Motion**: Respects user's motion preferences
- **Focus Indicators**: Clear focus outlines for interactive elements

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **IE**: Not supported (uses modern JavaScript features)

## Performance Considerations

- **Lazy Loading**: Component loads data only when mounted
- **Debounced Search**: Search filtering is optimized for performance
- **Memoized Callbacks**: Prevents unnecessary re-renders
- **Efficient Filtering**: Client-side filtering for responsive user experience

## Future Enhancements

### Potential Features
- **Export Functionality**: Export player data to PDF/Excel
- **Advanced Filters**: Additional filtering options (position, team, etc.)
- **Sorting Options**: Sort by name, team, date, etc.
- **Player Details Modal**: Detailed view for individual players
- **Bulk Actions**: Select multiple players for batch operations
- **Real-time Updates**: WebSocket integration for live updates

### Performance Improvements
- **Virtual Scrolling**: For large datasets (1000+ players)
- **Infinite Scroll**: Load players in batches
- **Caching**: Local storage caching for offline support
- **Optimistic Updates**: Immediate UI updates with API sync

## Troubleshooting

### Common Issues

#### 1. "No token found" Error
**Solution**: Ensure user is logged in and token is stored in localStorage

#### 2. Players Not Loading
**Possible Causes**:
- Network connectivity issues
- API server downtime
- Invalid authentication token
- CORS issues

**Solutions**:
- Check network connection
- Verify API endpoints are accessible
- Re-authenticate the user
- Check browser console for CORS errors

#### 3. Search Not Working
**Check**:
- Ensure data has loaded successfully
- Verify player objects have searchable fields (name, playerName, teamName)
- Check for JavaScript errors in console

#### 4. Responsive Issues
**Solutions**:
- Clear browser cache
- Check CSS media queries
- Verify viewport meta tag is present
- Test on different devices/screen sizes

## Development Notes

### Code Style
- **ESLint**: Follows project ESLint configuration
- **Prettier**: Code formatting with Prettier
- **Naming**: Descriptive variable and function names
- **Comments**: Clear comments for complex logic

### Testing Recommendations
- **Unit Tests**: Test individual functions and state changes
- **Integration Tests**: Test API integration and data flow
- **E2E Tests**: Test complete user workflows
- **Accessibility Tests**: Ensure WCAG compliance

### Contributing
When contributing to this component:
1. Follow existing code style and patterns
2. Add appropriate comments for new functionality
3. Update this README for any new features
4. Test on multiple devices and browsers
5. Ensure accessibility standards are maintained