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
import { AiOutlineUser, AiOutlinePlayCircle } from 'react-icons/ai';
import { motion } from 'framer-motion';

// Menu options
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar({ onLogout, guest }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #6A0DAD, #A94DB0, #E4B3E6)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '0.5rem 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h5"
              component="a"
              href="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '1.8rem',
                letterSpacing: '.2rem',
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(90deg, #FFF, #D9C4FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CodeBoard
            </Typography>
          </motion.div>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Guest or User Section */}
          {guest ? (
            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center bg-gradient-to-r from-purple-700 to-purple-500 text-white px-5 py-2 rounded-full shadow-md hover:from-purple-800 hover:to-purple-600"
                onClick={() => window.location.href = '/login'}
              >
                <AiOutlineUser className="mr-2 text-lg" /> Login
              </motion.button>
              {/* Signup Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex items-center border-2 border-purple-500 text-purple-700 px-5 py-2 rounded-full shadow-md hover:bg-purple-500 hover:text-white"
                onClick={() => window.location.href = '/signup'}
              >
                <AiOutlinePlayCircle className="mr-2 text-lg" /> Signup
              </motion.button>
            </motion.div>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              {/* User Avatar */}
              <Tooltip title="Open settings">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="User Avatar"
                      src="./image.png"
                      sx={{
                        border: '2px solid #C084FC',
                        boxShadow: '0 4px 10px rgba(192, 132, 252, 0.5)',
                      }}
                    />
                  </IconButton>
                </motion.div>
              </Tooltip>
              {/* Dropdown Menu */}
              <Menu
                sx={{
                  mt: '45px',
                  '& .MuiMenu-paper': {
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  },
                }}
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
                
                  <MenuItem
                    key='Logout'
                    onClick={() => {
                      onLogout();                      
                      handleCloseUserMenu();
                    }}
                    sx={{
                      backgroundColor: '#F3E8FF',
                      '&:hover': { backgroundColor: '#E9D5FF' },
                      color: '#6A0DAD',
                    }}
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                
              </Menu>
            </Box>
          )}
        </div>
      </Container>
    </AppBar>
  );
}

export default Navbar;
