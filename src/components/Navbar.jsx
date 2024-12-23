// Import necessary components and modules from React and Material-UI
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

// Define settings array for user menu options
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// Main Navbar component that accepts onLogout prop
function Navbar({ onLogout,guest }) {
  // State to handle user menu anchor element
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  // Handler to open user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Handler to close user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    // Main AppBar component with custom styling
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #A294F9, #CDC1FF, #E5D9F2)',
        color: 'white',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '0 0',
        height: '3.2rem',
      }}
    >
      {/* Container for navbar content */}
      <Container maxWidth="xl" sx={{padding: '0 0',height: '3.2rem'}}>
        <div className='flex justify-between items-center h-full'>
          {/* Logo icon */}
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, fontSize: '2rem' }} />
          
          {/* Logo text */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              fontSize: '1.5rem',
            }}
          >
            LOGO
          </Typography>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          {/* User menu section */}
            {
              guest ? (
                <div className='flex items-center gap-2'>
                  <a href="/login" className='text-white'>Login</a>
                  <a href="/signup" className='text-white'>Signup</a>
                </div>
              ):(
                <Box sx={{ flexGrow: 0 }}>
                {/* User avatar button */}
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="User Avatar"
                      src="/static/images/avatar/2.jpg"
                      sx={{ border: '2px solid black' }}
                    />
                  </IconButton>
                </Tooltip>
                
                {/* Dropdown menu */}
                <Menu
                  sx={{ mt: '45px', borderRadius: '8px', overflow: 'hidden' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {/* Menu items */}
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={()=>{
                        // Handle logout action if logout is clicked
                        if(setting==='Logout'){
                         onLogout();
                        }
                        handleCloseUserMenu();
                      }}
                      sx={{
                        backgroundColor: '#E5D9F2',
                        '&:hover': { backgroundColor: '#CDC1FF' },
                      }}
                    >
                      <Typography sx={{ textAlign: 'center', color: '#4A4A4A' }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              )
            }
        </div>
      </Container>
    </AppBar>
  );
}

// Export the Navbar component
export default Navbar;