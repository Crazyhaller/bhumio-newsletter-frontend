import type { Organization } from '../../../types/organization'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

export default function OrganizationTable({ data }: { data: Organization[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((org) => (
          <TableRow key={org.id}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{new Date(org.created_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
