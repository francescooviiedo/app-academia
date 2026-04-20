'use client';

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteFicha } from '@/lib/actions';

export default function FichaMenu({ id }: { id: number }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Deseja excluir este treino?')) {
      await deleteFicha(id);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ color: 'text.secondary', p: 0 }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              backgroundColor: '#1A1A1A',
              backgroundImage: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12
            },
          },
        }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: '#FF5252', gap: 1 }}>
          <DeleteIcon fontSize="small" /> Excluir
        </MenuItem>
      </Menu>
    </>
  );
}
