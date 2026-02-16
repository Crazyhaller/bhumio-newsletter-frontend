import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import api from '../../../services/axios'
import { useNavigate, Link } from 'react-router-dom'

interface RegisterForm {
  email: string
  password: string
}

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>()
  const navigate = useNavigate()

  const onSubmit = async (data: RegisterForm) => {
    await api.post('/users/register', data)
    navigate('/login')
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="p-8 w-96">
        <Typography variant="h5" className="mb-4">
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField fullWidth label="Email" {...register('email')} />
          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
          />
          <Button fullWidth variant="contained" type="submit">
            Register
          </Button>
        </form>
        <Typography className="mt-4 text-sm">
          Already have account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
