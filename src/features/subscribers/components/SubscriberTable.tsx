import type { Subscriber } from '../../../types/subscriber'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

interface Props {
  data: Subscriber[]
  onEdit: (subscriber: Subscriber) => void
}

export default function SubscriberTable({ data, onEdit }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Custom Fields</TableCell>
          <TableCell>Created</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell>{sub.email}</TableCell>
            <TableCell>
              {Object.entries(sub.custom_fields).map(([k, v]) => (
                <div key={k}>
                  {k}: {v}
                </div>
              ))}
            </TableCell>
            <TableCell>{new Date(sub.created_at).toLocaleString()}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(sub)}>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
