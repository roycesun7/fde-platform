'use client'

import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useFDEStore } from '@/lib/store'

export default function CodePane() {
  const { currentClient, provisioningLogs, isProvisioning } = useFDEStore()
  const [activeTab, setActiveTab] = useState<'terraform' | 'helm' | 'config' | 'logs'>('terraform')
  const [artifacts, setArtifacts] = useState<{
    terraform?: string
    helm?: string
    config?: string
  }>({})

  useEffect(() => {
    if (currentClient) {
      const stored = localStorage.getItem(`artifacts-${currentClient.id}`)
      if (stored) {
        try {
          setArtifacts(JSON.parse(stored))
        } catch (e) {
          console.error('Error parsing artifacts:', e)
        }
      }
    }
  }, [currentClient])

  if (!currentClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">
          No client selected. Generate a deployment plan first.
        </p>
      </div>
    )
  }

  const tabs = [
    { id: 'terraform' as const, label: 'Terraform', content: artifacts.terraform },
    { id: 'helm' as const, label: 'Helm', content: artifacts.helm },
    { id: 'config' as const, label: 'Config YAML', content: artifacts.config },
    { id: 'logs' as const, label: 'Provisioning Logs', content: null },
  ].filter((tab) => tab.content !== undefined || tab.id === 'logs')

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 px-4 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'logs' ? (
          <div className="h-full overflow-y-auto p-4 bg-gray-900 text-green-400 font-mono text-sm">
            {provisioningLogs.length === 0 ? (
              <p className="text-gray-500">No provisioning logs yet. Click "Simulate Provisioning" to start.</p>
            ) : (
              <div className="space-y-1">
                {provisioningLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))}
                {isProvisioning && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">●</div>
                    <span>Provisioning in progress...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Editor
            height="100%"
            language={activeTab === 'terraform' ? 'hcl' : activeTab === 'helm' ? 'yaml' : 'yaml'}
            value={tabs.find((t) => t.id === activeTab)?.content || '// No content available'}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: 'on',
            }}
          />
        )}
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Generated artifacts for {currentClient.name}
          </p>
          <button
            onClick={() => {
              const content = tabs.find((t) => t.id === activeTab)?.content
              if (content) {
                navigator.clipboard.writeText(content)
                alert('Copied to clipboard!')
              }
            }}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
            disabled={activeTab === 'logs' || !tabs.find((t) => t.id === activeTab)?.content}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}

