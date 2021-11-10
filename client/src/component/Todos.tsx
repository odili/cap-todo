import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Avatar,
  Paper,
  CircularProgress
} from '@mui/material';
import { Delete, Image } from '@mui/icons-material';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

import { useAcessToken } from 'hooks/useAccessToken';
import { apiEndpoint } from '../config';
import { Todo } from 'types';
import CreateTodo from './CreateTodo';
import AttachImage from './AttachImage';

const options: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

export default function Todos() {
  const { isAuthenticated } = useAuth0();
  const [todos, setTodos] = useState<Todo[]>([]);
  const accessToken = useAcessToken();
  const apiUrl = `${apiEndpoint}/todos`;
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  const handleDone = async (todo: Todo, ind: number) => {
    const { name, dueDate, done, todoId } = todo;
    try {
      const update = await axios({
        url: `${apiUrl}/${todoId}`,
        method: 'patch',
        headers,
        data: { name, dueDate, done: !done }
      });

      todos[ind] = update.data.updateResult;
      setTodos([...todos]);
    } catch (e) {
      alert('Update failed');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await axios({
        url: `${apiEndpoint}/todos/${id}`,
        method: 'delete',
        headers
      });
      setTodos(todos.filter((t) => t.todoId !== id));
    } catch (e) {
      alert('Todo deletion failed');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const res = await axios({ url: apiUrl, method: 'get', headers });

          setTodos(res.data.items);
        } catch (e) {
          console.log((e as Error).message);
        }
      })();
    }
  }, [isAuthenticated, accessToken]);

  return (
    <>
      <CreateTodo todos={todos} setTodos={setTodos} />
      {todos.length < 1 ? (
        <Box sx={{ display: 'grid', placeItems: 'center', mt: '3rem' }}>
          <CircularProgress />
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            Loading/Waiting for you to create todos
          </Typography>
        </Box>
      ) : (
        todos.map((todo, ind) => {
          const { name, todoId, dueDate, createdAt, done, attachmentUrl } =
            todo;
          return (
            <Paper
              key={todoId}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                columnGap: '1rem',
                alignItems: 'center',
                p: '1.5rem',
                mb: '1rem',
                bgcolor: () => (done ? 'text.disabled' : 'background.paper')
              }}
            >
              <Box>
                <Avatar src={attachmentUrl} sx={{ width: 56, height: 56 }}>
                  <Image />
                </Avatar>
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: () => (done ? 'text.disabled' : 'text.primary')
                  }}
                >
                  {name}
                </Typography>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', mr: '1rem' }}
                  >
                    Created:{' '}
                    {new Intl.DateTimeFormat([], options).format(
                      new Date(createdAt)
                    )}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: () => (done ? 'text.disabled' : 'text.primary')
                    }}
                  >
                    DueDate
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: () => (done ? 'text.disabled' : 'primary.main'),
                      ml: '1rem'
                    }}
                  >
                    {new Intl.DateTimeFormat([], options).format(
                      new Date(dueDate)
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <FormControlLabel
                  label="Done"
                  control={
                    <Checkbox
                      checked={done}
                      onChange={() => handleDone(todo, ind)}
                    />
                  }
                />
              </Box>
              <Box>
                <AttachImage
                  id={todoId}
                  indx={ind}
                  todos={todos}
                  setTodos={setTodos}
                />
                <IconButton onClick={() => deleteTodo(todoId)}>
                  <Delete />
                </IconButton>
              </Box>
            </Paper>
          );
        })
      )}
    </>
  );
}
