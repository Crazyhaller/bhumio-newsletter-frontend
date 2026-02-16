declare module 'grapejs' {
  const grapesjs: any
  export default grapesjs

  export function init(arg0: {
    container: HTMLDivElement
    height: string
    storageManager: boolean
    components: string
    blockManager: { appendTo: string }
  }): any {
    throw new Error('Function not implemented.')
  }
}
