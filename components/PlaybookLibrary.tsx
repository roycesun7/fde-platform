'use client'

import { useState, useEffect } from 'react'
import { useFDEStore, Playbook } from '@/lib/store'

export default function PlaybookLibrary() {
  const { playbooks, addPlaybook, setSelectedPlaybook, selectedPlaybook, currentClient } = useFDEStore()
  const [playbookName, setPlaybookName] = useState('')

  // Load sample playbook on mount
  useEffect(() => {
    const loadSamplePlaybook = async () => {
      // Check if already loaded
      if (playbooks.length > 0) return
      
      try {
        const response = await fetch('/data/playbooks/clientQ.json')
        if (response.ok) {
          const playbook: Playbook = await response.json()
          addPlaybook(playbook)
        }
      } catch (error) {
        console.error('Error loading sample playbook:', error)
      }
    }
    loadSamplePlaybook()
  }, [addPlaybook, playbooks.length])

  const handleSavePlaybook = () => {
    if (!currentClient || !currentClient.architecture || !playbookName.trim()) {
      alert('Please enter a playbook name and ensure a client deployment is active')
      return
    }

    const artifactsStr = localStorage.getItem(`artifacts-${currentClient.id}`)
    const artifacts = artifactsStr ? JSON.parse(artifactsStr) : {}

    const newPlaybook: Playbook = {
      id: `playbook-${Date.now()}`,
      name: playbookName,
      clientId: currentClient.id,
      architecture: currentClient.architecture,
      artifacts,
      createdAt: new Date().toISOString(),
    }

    addPlaybook(newPlaybook)
    setPlaybookName('')
    alert('Playbook saved successfully!')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Playbook Library</h2>
        {currentClient && currentClient.architecture && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={playbookName}
              onChange={(e) => setPlaybookName(e.target.value)}
              placeholder="Enter playbook name..."
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleSavePlaybook}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
            >
              Save Current as Playbook
            </button>
          </div>
        )}
      </div>

      {playbooks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No playbooks yet. Create a deployment and save it as a playbook.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playbooks.map((playbook) => (
            <div
              key={playbook.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPlaybook?.id === playbook.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlaybook(playbook)}
            >
              <h3 className="font-semibold text-gray-900 mb-2">{playbook.name}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {playbook.architecture.components.length} components
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(playbook.createdAt).toLocaleDateString()}
                </span>
                {selectedPlaybook?.id === playbook.id && (
                  <span className="text-primary-600 font-medium">Selected</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {playbook.architecture.components.slice(0, 3).map((comp) => (
                  <span
                    key={comp.id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {comp.name}
                  </span>
                ))}
                {playbook.architecture.components.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{playbook.architecture.components.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

