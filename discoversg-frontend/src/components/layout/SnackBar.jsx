import { Fade, Snackbar } from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';

const SnackBarDialog = forwardRef((props, ref) => {
  const [state, setState] = useState({
    open: false,
    message: '',
    vertical: 'bottom',
    horizontal: 'right',
    Transition: Fade,
  });
  const { vertical, horizontal } = state;

  const handleClose = () => {
    setState({ ...state, open: false, message: '' });
  };

  useImperativeHandle(ref, () => ({
    handleState: (msg) => {
      setState((prev) => ({ ...prev, open: true, message: msg }));
    }
  }));

  return <Snackbar
    open={state.open}
    onClose={handleClose}
    anchorOrigin={{ vertical, horizontal }}
    slots={{ transition: state.Transition }}
    message={state.message}
    key={state.Transition.name}
    autoHideDuration={3000}
  />
});

export default SnackBarDialog;