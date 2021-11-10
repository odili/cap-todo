import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import axios from 'axios';
import { useAcessToken } from 'hooks/useAccessToken';
import { apiEndpoint } from '../config';
import { Todo } from 'types';

type Prop = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function CreateTodo({ todos, setTodos }: Prop) {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(
    new Date().toISOString()
  );
  const accessToken = useAcessToken();
  const apiUrl = `${apiEndpoint}/todos`;

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDate = (newDate: string | null) => {
    setDueDate(new Date(newDate as string).toISOString());
  };

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios({
      url: apiUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: { name, dueDate }
    });
    // console.log(res.data);
    setTodos([...todos, res.data?.item]);
    setName('');
    setDueDate(new Date().toISOString());
  };
  return (
    <Box
      component="form"
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr auto',
        columnGap: '0.625rem',
        mb: '1rem'
      }}
      onSubmit={createTodo}
    >
      <TextField
        value={name}
        onChange={handleName}
        variant="outlined"
        label="Todo"
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Due Date"
          value={dueDate}
          onChange={handleDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button variant="contained" type="submit">
        create
      </Button>
    </Box>
  );
}
