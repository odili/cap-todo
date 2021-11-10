import { useState } from 'react';
import {
  Button,
  Box,
  IconButton,
  TextField,
  Modal,
  Typography,
  CircularProgress
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from 'axios';
import { useAcessToken } from 'hooks/useAccessToken';
import { apiEndpoint } from '../config';
import Notification from './Notification';
import { Todo } from 'types';

type Prop = {
  id: string;
  indx: number;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function AttachImage({ id, todos, setTodos, indx }: Prop) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(false);
  const [severity, setSeverity] = useState<
    'info' | 'error' | 'warning' | 'success' | undefined
  >(undefined);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const accessToken = useAcessToken();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files);
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const submitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      setProgress(true);
      const res = await axios({
        url: `${apiEndpoint}/todos/${id}/attachment`,
        method: 'patch',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(res.data.uploadUrl);
      await axios.put(res.data.uploadUrl, file);
      const todo = await axios({
        url: `${apiEndpoint}/todos/${id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(todo.data);
      todos[indx] = todo.data.item;
      setTodos([...todos]);
      setProgress(false);
      setSeverity('success');
      setMessage('File upload Success!');
      setOpen(false);
    } catch (e) {
      console.log(e);
      setSeverity('error');
      setMessage('File Upload Failed!');
      // alert('Attachment Upload failed');
    }
  };
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <Edit />
      </IconButton>
      <Notification severity={severity} message={message} />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, md: 600 },
            bgcolor: 'background.paper',
            // border: '2px solid #000',
            boxShadow: 24,
            borderRadius: '8px',
            p: '2rem'
          }}
        >
          <Typography sx={{ mb: '1rem', fontWeight: 700 }}>
            Attach Image
          </Typography>
          <Typography sx={{ mb: '1rem' }}>
            Add an image to your todo for a quick reminder or other use cases.
          </Typography>
          <Box component="form" onSubmit={submitFile}>
            <TextField
              autoFocus
              label="Todo Image"
              type="file"
              onChange={handleFile}
              fullWidth
              variant="outlined"
            />
            <Box sx={{ textAlign: 'right', mt: '1rem' }}>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button
                type="submit"
                startIcon={progress ? <CircularProgress /> : null}
              >
                add
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
