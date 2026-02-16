import type { Subscriber } from '../../../types/subscriber'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

export default function SubscriberTable({ data }: { data: Subscriber[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Email</TableCell>
          <TableCell>Custom Fields</TableCell>
          <TableCell>Created</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
