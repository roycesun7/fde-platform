'use client'

import { useFDEStore } from '@/lib/store'

export default function DiffViewer() {
  const { currentClient, selectedPlaybook } = useFDEStore()

  if (!currentClient || !selectedPlaybook) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">
          Select a playbook to compare with the current client deployment.
        </p>
      </div>
    )
  }

  const currentComponents = currentClient.architecture?.components || []
  const playbookComponents = selectedPlaybook.architecture.components || []

  // Find differences
  const currentComponentTypes = new Set(currentComponents.map((c) => c.type))
  const playbookComponentTypes = new Set(playbookComponents.map((c) => c.type))

  const added = Array.from(currentComponentTypes).filter(
    (type) => !playbookComponentTypes.has(type)
  )
  const removed = Array.from(playbookComponentTypes).filter(
    (type) => !currentComponentTypes.has(type)
  )
  const common = Array.from(currentComponentTypes).filter((type) =>
    playbookComponentTypes.has(type)
  )

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-[600px] overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Playbook Comparison</h3>
        <p className="text-sm text-gray-600">
          Comparing <strong>{currentClient.name}</strong> with playbook{' '}
          <strong>{selectedPlaybook.name}</strong>
        </p>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Current Deployment</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentComponents.length}
              </p>
              <p className="text-xs text-gray-500">components</p>
            </div>
            <div>
              <p className="text-gray-600">Playbook</p>
              <p className="text-2xl font-bold text-gray-900">
                {playbookComponents.length}
              </p>
              <p className="text-xs text-gray-500">components</p>
            </div>
            <div>
              <p className="text-gray-600">Similarity</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.round(
                  (common.length /
                    Math.max(
                      currentComponentTypes.size,
                      playbookComponentTypes.size,
                      1
                    )) *
                    100
                )}
                %
              </p>
              <p className="text-xs text-gray-500">match</p>
            </div>
          </div>
        </div>

        {/* Common Components */}
        {common.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Common Components ({common.length})
            </h4>
            <div className="space-y-2">
              {common.map((type) => {
                const current = currentComponents.find((c) => c.type === type)
                const playbook = playbookComponents.find((c) => c.type === type)
                return (
                  <div
                    key={type}
                    className="p-3 bg-green-50 border border-green-200 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {type}
                        </p>
                        <p className="text-sm text-gray-600">
                          Current: {current?.name} ({current?.provider})
                        </p>
                        <p className="text-sm text-gray-600">
                          Playbook: {playbook?.name} ({playbook?.provider})
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Added Components */}
        {added.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              New in Current Deployment ({added.length})
            </h4>
            <div className="space-y-2">
              {added.map((type) => {
                const component = currentComponents.find((c) => c.type === type)
                return (
                  <div
                    key={type}
                    className="p-3 bg-blue-50 border border-blue-200 rounded"
                  >
                    <p className="font-medium text-gray-900 capitalize">
                      {type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {component?.name} ({component?.provider})
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Removed Components */}
        {removed.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Not in Current Deployment ({removed.length})
            </h4>
            <div className="space-y-2">
              {removed.map((type) => {
                const component = playbookComponents.find((c) => c.type === type)
                return (
                  <div
                    key={type}
                    className="p-3 bg-red-50 border border-red-200 rounded"
                  >
                    <p className="font-medium text-gray-900 capitalize">
                      {type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {component?.name} ({component?.provider})
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-4 mt-6">
          <button
            onClick={() => {
              // In a real app, this would apply the playbook
              alert('This would apply the playbook to the current deployment')
            }}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Apply Playbook to Current Deployment
          </button>
        </div>
      </div>
    </div>
  )
}

