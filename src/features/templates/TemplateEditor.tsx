import { useEffect, useRef } from 'react'

export const TemplateEditor = ({
  initialContent,
  onSave,
}: {
  initialContent?: string
  onSave: (html: string) => void
}) => {
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    let editorInstance: any

    import('grapejs').then((grapesjs) => {
      editorInstance = grapesjs.init({
        container: containerRef.current!,
        height: '600px',
        storageManager: false,
        components: initialContent || '<h1>Hello {{email}}</h1>',
        blockManager: { appendTo: '' },
      })

      addMergeTagBlocks(editorInstance)
      editorRef.current = editorInstance
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
    <div className="space-y-4">
      <div ref={containerRef} />
      <button
        onClick={handleSave}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Save Template
      </button>
    </div>
  )
}

function addMergeTagBlocks(editor: any) {
  editor.BlockManager.add('merge-email', {
    label: 'Email Merge Tag',
    content: '{{email}}',
  })

  editor.BlockManager.add('merge-firstname', {
    label: 'First Name Merge Tag',
    content: '{{firstName}}',
  })
}
