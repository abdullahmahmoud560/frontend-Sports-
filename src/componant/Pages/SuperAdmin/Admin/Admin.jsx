import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import proper icons for each menu item
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CampIcon from "@mui/icons-material/Cabin";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import RuleIcon from "@mui/icons-material/Rule";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(5)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(6)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  background: "linear-gradient(135deg, #ef4343 0%, #d63333 100%)",
  color: "white",
  minHeight: 64,
  "& .MuiSvgIcon-root": {
    color: "white",
    fontSize: 28,
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    background: "#f8f9fa",
    borderRight: "1px solid #e9ecef",
    boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

// Menu items configuration with proper icons
const menuItems = [
  {
    text: "إدارة الأكاديميات",
    icon: <SchoolIcon />,
    path: "academies",
  },
  {
    text: "إدارة اللاعبين",
    icon: <PeopleIcon />,
    path: "active-no-active",
  },
  {
    text: "إدارة المباريات",
    icon: <SportsSoccerIcon />,
    path: "mange-matches",
  },
  {
    text: "إدارة جدول المباريات",
    icon: <ScheduleIcon />,
    path: "mange-shedulde",
  },
  {
    text: "برنامج المعسكر",
    icon: <CampIcon />,
    path: "camp",
  },
];

const secondaryMenuItems = [
  {
    text: "نتائج المباريات",
    icon: <EmojiEventsIcon />,
    path: "result-matches",
  },
  {
    text: "ترتيب الفرق",
    icon: <LeaderboardIcon />,
    path: "teams-ranking",
  },
  {
    text: "اللوائح التنظيمية",
    icon: <RuleIcon />,
    path: "rules",
  },
  {
    text: "جدول المباريات",
    icon: <ScheduleIcon />,
    path: "shedulde",
  },
  {
    text: "تسجيل الخروج",
    icon: <LogoutIcon />,
    path: "logout",
  },

];

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);
  const [decodedToken, setDecodedToken] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // Filter menu items based on role
  const getFilteredMenuItems = () => {
    if (decodedToken?.Role === "Admin") {
      return menuItems;
    }
    return []; // Return empty array for non-admin roles
  };

  const getFilteredSecondaryMenuItems = () => {
    if (decodedToken?.Role === "admin") {
      return secondaryMenuItems;
    }
    // For non-admin roles, show only secondary menu items
    return secondaryMenuItems;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {open ? (
            <ChevronLeftIcon
              style={{ cursor: "pointer" }}
              onClick={handleDrawerClose}
            />
          ) : (
            <MenuIcon
              style={{ cursor: "pointer" }}
              onClick={handleDrawerOpen}
            />
          )}
        </DrawerHeader>
        
        <Divider />
        
        {/* Main Menu Items */}
        <List>
          {getFilteredMenuItems().map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Link 
                to={`/${item.path}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton
                  sx={[
                    {
                      minHeight: 56,
                      px: 1.5,
                      margin: "4px 8px",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(239, 67, 67, 0.1)",
                        color: "#ef4343",
                      },
                    },
                    open
                      ? {
                          justifyContent: "flex-start",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                        color: "inherit",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[
                      {
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          fontWeight: 500,
                        },
                      },
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ margin: "8px 0" }} />
        
        {/* Secondary Menu Items */}
        <List>
          {getFilteredSecondaryMenuItems().map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Link 
                to={`/${item.path}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemButton
                  sx={[
                    {
                      minHeight: 56,
                      px: 1.5,
                      margin: "4px 8px",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "rgba(239, 67, 67, 0.1)",
                        color: "#ef4343",
                      },
                    },
                    open
                      ? {
                          justifyContent: "flex-start",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                        color: "inherit",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={[
                      {
                        "& .MuiListItemText-primary": {
                          fontSize: "14px",
                          fontWeight: 500,
                        },
                      },
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}