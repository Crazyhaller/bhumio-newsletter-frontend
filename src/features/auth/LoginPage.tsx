import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from './authSchema'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../lib/api/authApi'
import { useAuthStore } from '../../app/store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'

type FormData = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      loginStore(data.token, data.user)
      toast.success('Login successful')
      navigate('/')
    },
    onError: () => {
      toast.error('Invalid credentials')
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <Paper className="p-8 w-full max-w-md shadow-xl rounded-2xl">
        <Typography variant="h5" className="mb-6 text-center">
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
            type="password"
            label="Password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </Button>

          <Typography variant="body2" className="text-center">
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}
