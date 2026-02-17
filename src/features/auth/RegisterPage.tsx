import { Button, TextField, Typography, InputAdornment } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from './authSchema'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { registerApi } from '../../lib/api/authApi'
import { useAuthStore } from '../../app/store/authStore'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Business, Email, Lock } from '@mui/icons-material'

type FormData = z.infer<typeof registerSchema>

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
      toast.success('Account created successfully!')
      navigate('/')
    },
    onError: () => {
      toast.error('Registration failed. Please try again.')
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
          <div className="text-center lg:text-left">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl mb-6 mx-auto lg:mx-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <Typography
              variant="h4"
              className="font-bold text-slate-900 tracking-tight"
            >
              Create an account
            </Typography>
            <Typography className="text-slate-500 mt-2">
              Join thousands of creators sending better emails.
            </Typography>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* FIX: Changed from 'space-y-6' to 'flex flex-col gap-6' 
              This forces a 24px gap between every input in this list.
            */}
            <div className="flex flex-col gap-6">
              <TextField
                fullWidth
                label="Organization Name"
                placeholder="Acme Inc."
                {...register('organizationName')}
                error={!!errors.organizationName}
                helperText={errors.organizationName?.message}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business className="text-slate-400" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Email"
                placeholder="you@example.com"
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

              <TextField
                fullWidth
                type="password"
                label="Password"
                placeholder="Create a strong password"
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
                }}
              />
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
              {mutation.isPending ? 'Creating account...' : 'Get Started'}
            </Button>

            <Typography
              variant="body2"
              className="text-center text-slate-600 mt-6"
            >
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </Typography>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Visuals */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500 blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-pink-500 blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-lg text-center p-10">
          <Typography variant="h3" className="font-bold text-white mb-6">
            Everything you need to grow.
          </Typography>

          <div className="space-y-4 text-left inline-block">
            {[
              'Drag & Drop Email Builder',
              'Real-time Analytics',
              'Automated Campaigns',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center space-x-3 text-slate-300"
              >
                <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
