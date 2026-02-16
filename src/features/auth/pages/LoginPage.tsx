import { Box, Button, TextField, Paper, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../useAuth'
import api from '../../../services/axios'
import { useNavigate, Link } from 'react-router-dom'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  })

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
          <TextField
            fullWidth
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
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
