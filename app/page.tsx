'use client'

import { useState } from 'react'
import CopilotChat from '@/components/CopilotChat'
import EnvironmentGraph from '@/components/EnvironmentGraph'
import CodePane from '@/components/CodePane'
import DiffViewer from '@/components/DiffViewer'
import PlaybookLibrary from '@/components/PlaybookLibrary'
import { useFDEStore } from '@/lib/store'

export default function Home() {
  const { currentClient, selectedPlaybook } = useFDEStore()
  const [activeTab, setActiveTab] = useState<'graph' | 'code' | 'diff' | 'playbooks'>('graph')
  const [showPlaybooks, setShowPlaybooks] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FDE OS Platform
          </h1>
          <p className="text-gray-600">
            AI-powered Operating System for Forward-Deployed Engineering
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowPlaybooks(!showPlaybooks)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium text-sm"
          >
            {showPlaybooks ? 'Hide' : 'Show'} Playbook Library
          </button>
        </div>

        {showPlaybooks && (
          <div className="mb-6">
            <PlaybookLibrary />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Copilot Chat */}
          <div className="lg:col-span-1">
            <CopilotChat />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('graph')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'graph'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Environment Graph
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'code'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Generated Artifacts
              </button>
              {selectedPlaybook && (
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'diff'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Playbook Comparison
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'graph' && <EnvironmentGraph />}
            {activeTab === 'code' && <CodePane />}
            {activeTab === 'diff' && selectedPlaybook && <DiffViewer />}
          </div>
        </div>
      </div>
    </main>
  )
}

