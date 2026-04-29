import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Box,
  Toolbar,
  AppBar,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Category as CategoryIcon,
  PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAPI } from "../../api/services/auth/logout";
import { clearAuthData, getStoredUser } from "../../utils/auth";

const drawerWidth = 240;
const collapsedWidth = 76;

const Sidebar = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (_error) {
      // Client-side cleanup is still enough to end the session locally.
    } finally {
      clearAuthData();
      navigate("/login", { replace: true });
    }
  };

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    {
      text: "Products",
      icon: <CategoryIcon />,
      children: [
        { text: "Add Product", path: "/addProduct" },
        { text: "View Products", path: "/ViewProducts" },
      ],
    },
    { text: "Analytics", icon: <BarChartIcon />, path: "/Analytics" },
    { text: "POS", icon: <PointOfSaleIcon />, path: "/ViewProducts" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const isActivePath = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const getItemStyles = ({ isActive = false, nested = false } = {}) => ({
    minHeight: 46,
    mx: 1.25,
    my: 0.35,
    borderRadius: 2,
    color: isActive ? "#0f172a" : "#475569",
    backgroundColor: isActive ? "#e0f2fe" : "transparent",
    justifyContent: open ? "initial" : "center",
    px: open ? 1.5 : 1,
    pl: nested && open ? 5 : undefined,
    "&:hover": {
      backgroundColor: isActive ? "#bae6fd" : "#f1f5f9",
    },
    "& .MuiListItemIcon-root": {
      minWidth: open ? 38 : 0,
      mr: open ? 1 : 0,
      justifyContent: "center",
      color: isActive ? "#0284c7" : "#64748b",
    },
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? 0 : open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? drawerWidth : open ? drawerWidth : collapsedWidth,
            transition: "width 0.25s ease",
            overflowX: "hidden",
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: open ? "space-between" : "center", px: 1.5 }}>
          {open && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
                Inventory
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Admin panel
              </Typography>
            </Box>
          )}
          <IconButton onClick={handleToggleSidebar} size="small" aria-label="Toggle navigation">
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List sx={{ px: 0, pt: 1 }}>
          {menuItems.map((item) => (
            <Box key={item.text}>
              <ListItemButton
                component={item.path ? Link : "div"}
                to={item.path || ""}
                onClick={() => item.children && handleExpand(item.text)}
                sx={getItemStyles({ isActive: isActivePath(item.path) })}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {open && <ListItemText primary={item.text} />}
                {item.children && open && (
                  expandedMenu === item.text ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>

              {/* Submenu with Collapse */}
              {item.children && (
                <Collapse in={expandedMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component={Link}
                        to={subItem.path}
                        sx={getItemStyles({ isActive: isActivePath(subItem.path), nested: true })}
                      >
                        {!open && <ListItemIcon><CategoryIcon fontSize="small" /></ListItemIcon>}
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          transition: "margin 0.25s ease",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            borderBottom: "1px solid #e2e8f0",
            transition: "all 0.25s ease",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "64px !important" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              {isMobile && (
                <IconButton onClick={handleToggleSidebar} size="small" aria-label="Open navigation">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                Inventory Dashboard
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {currentUser?.email && (
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", display: { xs: "none", sm: "block" } }}
                >
                  {currentUser.email}
                </Typography>
              )}
              <Button
                onClick={handleLogout}
                color="inherit"
                startIcon={<LogoutIcon />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            minHeight: "calc(100vh - 64px)",
            p: { xs: 2, md: 3 },
            backgroundColor: "#f8fafc",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
