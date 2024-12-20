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
// import { useNavigate } from 'react-router-dom';
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar({ onLogout }) {

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // const handleLogout = async () => {
  //   await authService.logout();
  //   navigate('/');  };

  return (
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
      <Container maxWidth="xl" sx={{padding: '0 0',height: '3.2rem'}}>
        <div className='flex justify-between items-center h-full'>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, fontSize: '2rem' }} />
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

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="User Avatar"
                  src="/static/images/avatar/2.jpg"
                  sx={{ border: '2px solid black' }}
                />
              </IconButton>
            </Tooltip>
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
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={()=>{
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
        </div>
      </Container>
    </AppBar>
  );
}
export default Navbar;
