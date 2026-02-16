import { Box, Typography } from '@mui/material'

export const PageHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) => (
  <Box className="mb-6">
    <Typography variant="h4">{title}</Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
)
