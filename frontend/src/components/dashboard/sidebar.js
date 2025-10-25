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
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 70;

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

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
    { text: "POS", icon: <BarChartIcon />, path: "/sell" },
    { text: "Reports", icon: <BarChartIcon />, path: "/reports" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s",
            overflowX: "hidden",
            boxSizing: "border-box",
          },
        }}
      >
        {/* Toggle button at the top of Sidebar */}
        <Toolbar sx={{ display: "flex", justifyContent: open ? "flex-end" : "center" }}>
          <IconButton onClick={handleToggleSidebar}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <Box key={item.text}>
              <ListItemButton
                component={item.path ? Link : "div"}
                to={item.path || ""}
                onClick={() => item.children && handleExpand(item.text)}
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
                        sx={{ pl: open ? 4 : 2 }}
                      >
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
          transition: "margin 0.3s",
        }}
      >
        {/* Topbar */}
        <AppBar
          position="sticky"
          sx={{
            // ml: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
            // width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
            backgroundColor: "#1976d2",
            transition: "all 0.3s",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              My App
            </Typography>
            <div>
              {/* Example actions */}
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {/* Page content with background */}
        <div
          style={{
            minHeight: "80vh",
            backgroundColor: "#f5f5f5",
            padding: "10px",
          }}
          className="rounded shadow bg-svg"
        >
          {children}
        </div>
      </Box>
    </Box>
  );
};

export default Sidebar;
