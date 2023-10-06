import React, { PropsWithChildren } from 'react';
import { Box } from '@mui/material';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Box component='main'>
        {children}
      </Box>
    </>
  );
};

export default Layout;
