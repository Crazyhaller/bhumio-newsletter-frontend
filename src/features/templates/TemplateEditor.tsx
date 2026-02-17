import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { Save, Code } from '@mui/icons-material'

export const TemplateEditor = ({
  initialContent,
  onSave,
}: {
  initialContent?: string
  onSave: (html: string) => void
}) => {
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    let editorInstance: any

    import('grapejs').then((grapesjs) => {
      editorInstance = grapesjs.init({
        container: containerRef.current!,
        height: '500px',
        storageManager: false,
        blockManager: {
          appendTo: '#blocks-container', // We can move blocks to a custom sidebar if needed, but keeping simple for now
        },
        components:
          initialContent ||
          '<div style="padding: 20px; font-family: sans-serif;"><h1>Hello {{firstName}}</h1><p>Start writing your email...</p></div>',
      })

      addMergeTagBlocks(editorInstance)
      editorRef.current = editorInstance
      setIsReady(true)
    })

    return () => {
      editorRef.current?.destroy()
    }
  }, [])

  const handleSave = () => {
    const html = editorRef.current?.getHtml()
    if (html) onSave(html)
  }

  return (
    <Box className="flex flex-col h-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Editor Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-600">
          <Code fontSize="small" />
          <Typography variant="subtitle2" className="font-semibold">
            Visual Editor
          </Typography>
        </div>
        <Button
          variant="contained"
          size="small"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={!isReady}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            backgroundColor: '#5b3df5',
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#4c32cc' },
          }}
        >
          Save Template
        </Button>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 bg-slate-100 relative">
        <div ref={containerRef} className="h-full" />
      </div>
    </Box>
  )
}

function addMergeTagBlocks(editor: any) {
  // Added icons for better UX in the drag menu
  editor.BlockManager.add('merge-email', {
    label: 'Email Variable',
    attributes: { class: 'fa fa-envelope' },
    content:
      '<span style="color: #5b3df5; font-weight: bold;">{{email}}</span>',
  })

  editor.BlockManager.add('merge-firstname', {
    label: 'First Name',
    attributes: { class: 'fa fa-user' },
    content:
      '<span style="color: #5b3df5; font-weight: bold;">{{firstName}}</span>',
  })
}
