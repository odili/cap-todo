import { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
interface NotifyType {
  severity: 'info' | 'error' | 'warning' | 'success' | undefined;
  message: string;
}

// interface Prop extends NotifyType {
//   resetAlert: (notice: NotifyType) => void;
// }
export default function Notification({ severity, message }: NotifyType) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    // if (reason === 'clickaway') {
    //   return;
    // }

    setOpen(false);
    // resetAlert({ severity: undefined, message: '' });
  };
  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      sx={{ mt: '3rem' }}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
}
