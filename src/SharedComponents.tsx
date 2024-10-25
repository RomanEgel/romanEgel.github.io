import { styled } from '@mui/system';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { getCSSVariableValue } from './CustomThemeProvider';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.default,
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 3),
  color: getCSSVariableValue('--button-text-color'),
  backgroundColor: getCSSVariableValue('--button-color'),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: getCSSVariableValue("--bg-color"),
  '& .MuiInputBase-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
}));