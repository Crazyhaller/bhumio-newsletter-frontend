import { Box, Typography } from '@mui/material'

interface PageHeaderProps {
  title: string
  subtitle?: string
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <Box className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
    <div>
      <Typography
        variant="h4"
        className="text-slate-900 font-bold tracking-tight"
        sx={{ fontSize: '1.875rem', lineHeight: '2.25rem' }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          variant="body1"
          className="text-slate-500 mt-2 max-w-2xl"
          sx={{ fontSize: '1rem', lineHeight: '1.5rem' }}
        >
          {subtitle}
        </Typography>
      )}
    </div>
  </Box>
)
