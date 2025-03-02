export function Button({ variant = 'primary', children, className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-colors'
  
  const variantStyles = {
    primary: 'bg-black text-white hover:bg-black/90 px-4 py-2',
    secondary: 'border border-gray-300 hover:bg-gray-50 px-4 py-2',
    text: 'hover:bg-black/5 px-3 py-1.5'
  }

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
} 