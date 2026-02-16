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
import { createSubscriber, updateSubscriber } from '../subscriberService'
import type { Subscriber } from '../../../types/subscriber'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  subscriber?: Subscriber | null
}

export default function SubscriberDialog({ open, onClose, subscriber }: Props) {
  const isEdit = !!subscriber

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: subscriber?.email || '',
      firstName: subscriber?.custom_fields?.firstName || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    const payload = {
      email: data.email,
      custom_fields: { firstName: data.firstName || '' },
    }

    if (isEdit && subscriber) {
      await updateSubscriber(subscriber.id, payload)
    } else {
      await createSubscriber(payload)
    }

    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {isEdit ? 'Edit Subscriber' : 'Create Subscriber'}
      </DialogTitle>
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
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
