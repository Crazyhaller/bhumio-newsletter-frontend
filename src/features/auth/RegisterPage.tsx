import { Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from './authSchema'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../../lib/api/authApi'
import { useAuthStore } from '../../app/store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { PageHeader } from '../../components/ui/PageHeader'

type FormData = z.infer<typeof registerSchema>

export const RegisterPage = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  })

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      loginStore(data.token, data.user)
      toast.success('Account created')
      navigate('/')
    },
    onError: () => {
      toast.error('Registration failed')
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <Box className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <Paper className="p-8 w-full max-w-md shadow-xl rounded-2xl">
        <PageHeader
          title="Register"
          subtitle="Join us today! Create your account by filling out the form below."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label="Organization Name"
            {...register('organizationName')}
            error={!!errors.organizationName}
            helperText={errors.organizationName?.message}
          />

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
            {mutation.isPending ? 'Creating...' : 'Register'}
          </Button>

          <Typography variant="body2" className="text-center">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}
