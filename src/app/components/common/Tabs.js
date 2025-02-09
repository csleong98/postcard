export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-2 ${
              activeTab === tab.id 
                ? 'border-b-2 border-black' 
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
} 