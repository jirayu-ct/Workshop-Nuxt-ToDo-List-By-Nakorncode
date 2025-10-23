export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'purple',
      neutral: 'zinc'
    },
    toaster: {
      defaultVariants: {
        position: 'top-center',
      }
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      }
    }
  }
})
