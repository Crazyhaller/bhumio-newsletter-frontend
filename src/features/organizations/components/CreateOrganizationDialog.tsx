import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { createOrganization } from '../organizationService'

export default function CreateOrganizationDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { register, handleSubmit } = useForm<{ name: string }>()

  const onSubmit = async (data: { name: string }) => {
    await createOrganization(data.name)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Organization</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Organization Name" {...register('name')} />
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
