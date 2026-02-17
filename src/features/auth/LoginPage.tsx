import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from './authSchema'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { loginApi } from '../../lib/api/authApi'
import { useAuthStore } from '../../app/store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material'
import { fetchOrganizations } from '../../lib/api/orgApi'

type FormData = z.infer<typeof loginSchema>

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5b3df5' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(91, 61, 245, 0.1)',
    },
  },
  '& .MuiInputLabel-root': { color: '#64748b' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#5b3df5' },
}

export const LoginPage = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      loginStore(data.token, data.user)
      // Fetch organizations
      const orgs = await fetchOrganizations()

      if (orgs.length > 0) {
        useAuthStore.getState().setOrganization(orgs[0])
      }
      toast.success('Welcome back!')
      navigate('/')
    },
    onError: () => {
      toast.error('Invalid email or password')
    },
  })

  const onSubmit = (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl mb-6 mx-auto lg:mx-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <Typography
              variant="h4"
              className="font-bold text-slate-900 tracking-tight"
            >
              Welcome back
            </Typography>
            <Typography className="text-slate-500 mt-2">
              Please enter your details to access your dashboard.
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* FIX: Changed from 'space-y-6' to 'flex flex-col gap-6' 
              This forces a 24px gap between the Email input and the Password group.
            */}
            <div className="flex flex-col gap-6">
              <TextField
                fullWidth
                placeholder="name@company.com"
                label="Email"
                variant="outlined"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email className="text-slate-400" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <div className="space-y-1">
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="••••••••"
                  variant="outlined"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock className="text-slate-400" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={mutation.isPending}
              className="mt-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 normal-case text-base font-medium shadow-none hover:shadow-lg transition-all"
              sx={{
                marginTop: '32px',
                height: '48px',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                backgroundColor: '#5b3df5',
                '&:hover': { backgroundColor: '#4c32cc' },
              }}
            >
              {mutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>

            <Typography
              variant="body2"
              className="text-center text-slate-600 mt-8"
            >
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign up for free
              </Link>
            </Typography>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-lg text-center p-10">
          <div className="mb-8 relative group">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-2xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <div className="h-32 w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
                <div className="h-3 w-1/2 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
          <Typography variant="h3" className="font-bold text-white mb-4">
            Start building your audience today.
          </Typography>
          <Typography className="text-slate-400 text-lg">
            "The most intuitive newsletter platform I've ever used. It helped me
            grow my subscribers by 200% in a month."
          </Typography>
        </div>
      </div>
    </div>
  )
}
