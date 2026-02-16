import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSubscriber } from '../subscriberService'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CreateSubscriberDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await createSubscriber({
      email: data.email,
      custom_fields: {
        firstName: data.firstName || '',
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Subscriber</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField
          fullWidth
          label="Email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField fullWidth label="First Name" {...register('firstName')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
