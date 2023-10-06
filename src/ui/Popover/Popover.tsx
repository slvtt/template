import React, { ReactElement } from 'react';
import MuiPopover from '@mui/material/Popover';

interface PopoverChildrenProps {
  isOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
}

interface PopoverProps {
  renderButton: (props: PopoverChildrenProps) => ReactElement;
  children: (props: PopoverChildrenProps) => ReactElement | Array<ReactElement>;
}

const Popover: React.FC<PopoverProps> = ({ renderButton, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {renderButton({ isOpen, onClick, onClose })}
      <MuiPopover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        disableScrollLock
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        {children({ isOpen, onClick, onClose })}
      </MuiPopover>
    </>
  );
};

export default Popover;
