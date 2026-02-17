import { Button, Typography, Paper } from '@mui/material'
import Papa from 'papaparse'
import { createSubscriber } from '../../lib/api/subscriberApi'
import { UploadFile } from '@mui/icons-material'
import { toast } from 'sonner' // Assuming sonner is available based on previous context

interface CsvRow {
  email?: string
  [key: string]: string | undefined
}

export const CsvImport = () => {
  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        let count = 0
        try {
          for (const row of results.data as CsvRow[]) {
            if (row.email) {
              await createSubscriber({
                email: row.email,
                customFields: row,
              })
              count++
            }
          }
          // UX Improvement: Better feedback than alert
          toast.success(`Successfully imported ${count} subscribers`)
        } catch (error) {
          toast.error('Error importing CSV')
        }
      },
    })
  }

  return (
    <Paper
      elevation={0}
      className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center gap-2"
    >
      <Typography variant="subtitle2" className="text-slate-600 font-semibold">
        Bulk Import
      </Typography>
      <Typography variant="caption" className="text-slate-400 mb-2">
        Upload a .csv file to add multiple subscribers at once.
      </Typography>

      <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFile />}
        sx={{
          textTransform: 'none',
          borderColor: '#cbd5e1',
          color: '#475569',
          '&:hover': {
            borderColor: '#94a3b8',
            backgroundColor: '#fff',
          },
        }}
      >
        Select CSV File
        <input
          hidden
          type="file"
          accept=".csv"
          onChange={(e) => {
            if (e.target.files) handleFile(e.target.files[0])
          }}
        />
      </Button>
    </Paper>
  )
}
