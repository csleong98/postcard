import { Check } from "@phosphor-icons/react"

export function Stepper({ 
  steps, 
  variant = 'default',
  className = '' 
}) {
  const variants = {
    default: "w-full px-8 py-6 border-b border-[#E4E4E4] bg-white",
    minimal: "w-full px-8 py-4 border-b border-[#E4E4E4] bg-white/50 backdrop-blur-sm",
    pill: "w-full px-8 py-4"
  }

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="max-w-3xl mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.id} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8' : ''}`}>
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-[#E4E4E4]" />
                  </div>
                )}
                <div className="group relative flex flex-col items-start">
                  <span className="flex items-center">
                    {/* Dot */}
                    <div className={`
                      relative z-10 w-8 h-8 
                      flex items-center justify-center 
                      rounded-full transform transition-transform group-hover:scale-110
                      ${step.status === 'complete' 
                        ? 'bg-black' 
                        : step.status === 'current'
                          ? 'border-2 border-black bg-white'
                          : 'border-2 border-[#E4E4E4] bg-white'
                      }
                    `}>
                      {step.status === 'complete' ? (
                        <Check size={16} weight="bold" className="text-white" />
                      ) : (
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          step.status === 'current' ? 'bg-black' : 'bg-[#E4E4E4]'
                        }`} />
                      )}
                    </div>
                    {/* Label */}
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm font-medium text-[#2F2F2F]">
                        {step.name}
                      </span>
                      {step.description && (
                        <span className="text-xs text-gray-500">
                          {step.description}
                        </span>
                      )}
                    </div>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
} 