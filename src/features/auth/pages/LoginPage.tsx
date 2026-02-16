import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useAuth } from '../AuthContext'
import api from '../../../services/axios'
import { useNavigate, Link } from 'react-router-dom'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginForm) => {
    const res = await api.post('/auth/login', data)
    login(res.data.token)
    navigate('/')
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gray-100">
      <Paper className="p-8 w-96">
        <Typography variant="h5" className="mb-4">
          Login
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
            Login
          </Button>
        </form>
        <Typography className="mt-4 text-sm">
          No account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  )
}
