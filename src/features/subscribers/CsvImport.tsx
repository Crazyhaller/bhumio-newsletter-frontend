import { Button } from '@mui/material'
import Papa from 'papaparse'
import { createSubscriber } from '../../lib/api/subscriberApi'

interface CsvRow {
  email?: string
  [key: string]: string | undefined
}

export const CsvImport = () => {
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        for (const row of results.data as CsvRow[]) {
          if (row.email) {
            await createSubscriber({
              email: row.email,
              customFields: row,
            })
          }
        }
        alert('Import completed')
      },
    })
  }

  return (
    <Button variant="outlined" component="label">
      Import CSV
      <input
        hidden
        type="file"
        accept=".csv"
        onChange={(e) => {
          if (e.target.files) handleFile(e.target.files[0])
        }}
      />
    </Button>
  )
}
