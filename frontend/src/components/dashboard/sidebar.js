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
  Person as PersonIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Category as CategoryIcon,
  PointOfSale as PointOfSaleIcon,
  Assessment as AssessmentIcon,
  ReceiptLong as ReceiptLongIcon,
  Logout as LogoutIcon,
  Storefront as StorefrontIcon,
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
    { text: "Orders", icon: <ReceiptLongIcon />, path: "/orders" },
    { text: "POS", icon: <PointOfSaleIcon />, path: "/ViewProducts" },
   
    ...(currentUser?.role === "admin"
      ? [
          { text: "Reports", icon: <AssessmentIcon />, path: "/reports" },
          { text: "Users", icon: <SettingsIcon />, path: "/users" },
          { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
       ]
      : []),
       { text: "Profile", icon: <PersonIcon />, path: "/profile" },
  ];

  const isActivePath = (path) => {
    if (!path) return false;
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const currentPage =
    menuItems.find((item) => isActivePath(item.path))?.text ||
    menuItems
      .flatMap((item) => item.children || [])
      .find((item) => isActivePath(item.path))?.text ||
    "Dashboard";

  const getItemStyles = ({ isActive = false, nested = false } = {}) => ({
    minHeight: nested ? 36 : 42,
    mx: nested ? 1.5 : 1.1,
    my: nested ? 0.2 : 0.35,
    borderRadius: nested ? 2.5 : 3,
    color: isActive ? "#0f172a" : "#475569",
    backgroundColor: isActive ? "#e2e8f0" : nested ? "#ffffffb3" : "transparent",
    justifyContent: open ? "initial" : "center",
    px: open ? (nested ? 1.35 : 1.4) : 0.85,
    pl: nested && open ? 4.75 : undefined,
    border: isActive ? "1px solid rgba(148, 163, 184, 0.35)" : "1px solid transparent",
    boxShadow: nested ? "inset 0 0 0 1px rgba(226, 232, 240, 0.85)" : "none",
    "&:hover": {
      backgroundColor: isActive ? "#cbd5e1" : "#f8fafc",
    },
    "& .MuiListItemIcon-root": {
      minWidth: open ? (nested ? 30 : 34) : 0,
      mr: open ? (nested ? 0.75 : 0.9) : 0,
      justifyContent: "center",
      color: isActive ? "#0f172a" : "#64748b",
    },
    "& .MuiListItemText-primary": {
      fontSize: nested ? "0.84rem" : "0.91rem",
      fontWeight: isActive ? 700 : nested ? 500 : 600,
      lineHeight: 1.2,
    },
    [theme.breakpoints.down("sm")]: {
      minHeight: nested ? 34 : 40,
      mx: nested ? 1.2 : 0.95,
      px: open ? (nested ? 1.15 : 1.2) : 0.7,
      pl: nested && open ? 4.1 : undefined,
      "& .MuiListItemText-primary": {
        fontSize: nested ? "0.8rem" : "0.88rem",
      },
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
            background:
              "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
          },
        }}
      >
        <Box sx={{ p: 1.5, pb: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
              gap: 1,
              borderRadius: 4,
              px: open ? 1.5 : 1,
              py: 1.25,
              background:
                "radial-gradient(circle at top left, rgba(14,165,233,0.12), transparent 40%), linear-gradient(135deg, #ffffff, #f8fafc)",
              border: "1px solid #e2e8f0",
            }}
          >
            {open ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 3,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  <StorefrontIcon fontSize="small" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                    Inventory
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Admin workspace
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 3,
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "#0f172a",
                  color: "#fff",
                }}
              >
                <StorefrontIcon fontSize="small" />
              </Box>
            )}
            <IconButton
              onClick={handleToggleSidebar}
              size="small"
              aria-label="Toggle navigation"
              sx={{ border: "1px solid #e2e8f0", backgroundColor: "#fff" }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: 2.25, pb: 0.75, display: open ? "block" : "none" }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#94a3b8",
            }}
          >
            Navigation
          </Typography>
        </Box>

        <List sx={{ px: 0, pt: 0.25, flex: 1 }}>
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
                  <List
                    component="div"
                    disablePadding
                    sx={{
                      mx: open ? 0.2 : 0,
                      mb: 0.35,
                    }}
                  >
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        component={Link}
                        to={subItem.path}
                        sx={getItemStyles({ isActive: isActivePath(subItem.path), nested: true })}
                      >
                        {!open && <ListItemIcon><CategoryIcon sx={{ fontSize: 18 }} /></ListItemIcon>}
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>

        <Box sx={{ p: 1.5, pt: 1 }}>
          <Box
            sx={{
              borderRadius: 4,
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              p: open ? 1.25 : 0.75,
            }}
          >
            {open ? (
              <>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                  Signed in
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                  {currentUser?.name || "Team member"}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b", wordBreak: "break-word" }}>
                  {currentUser?.email || "No email"}
                </Typography>
                <Button
                  onClick={handleLogout}
                  fullWidth
                  startIcon={<LogoutIcon />}
                  sx={{
                    mt: 1.5,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1e293b" },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <IconButton
                onClick={handleLogout}
                size="small"
                aria-label="Logout"
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fff",
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
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
            backgroundColor: "rgba(255,255,255,0.82)",
            color: "#0f172a",
            borderBottom: "1px solid #e2e8f0",
            transition: "all 0.25s ease",
            backdropFilter: "blur(10px)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "68px !important", px: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
              {isMobile && (
                <IconButton
                  onClick={handleToggleSidebar}
                  size="small"
                  aria-label="Open navigation"
                  sx={{ border: "1px solid #e2e8f0", backgroundColor: "#fff" }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94a3b8" }}>
                  Workspace
                </Typography>
                <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                  {currentPage}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {currentUser?.email && (
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 1,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#fff",
                    borderRadius: 999,
                    px: 1.25,
                    py: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#e2e8f0",
                      color: "#0f172a",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {String(currentUser?.name || currentUser?.email || "U").trim().charAt(0).toUpperCase()}
                  </Box>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>
                    {currentUser.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            minHeight: "calc(100vh - 64px)",
            p: { xs: 1.25, sm: 1.75, md: 3 },
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
