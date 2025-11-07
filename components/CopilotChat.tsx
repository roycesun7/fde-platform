'use client'

import { useState } from 'react'
import { useFDEStore } from '@/lib/store'
import { analyzeRequirements } from '@/lib/copilot'

export default function CopilotChat() {
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { setCurrentClient, addClient, updateClientStatus } = useFDEStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    
    const clientId = `client-${Date.now()}`
    const newClient = {
      id: clientId,
      name: `Client ${new Date().toLocaleDateString()}`,
      requirements: input,
      status: 'draft' as const,
    }

    addClient(newClient)
    setCurrentClient(newClient)
    updateClientStatus(clientId, 'draft')

    try {
      const response = await analyzeRequirements(input)
      
      setCurrentClient({
        ...newClient,
        architecture: response.architecture,
        status: 'draft',
      })

      // Store artifacts in a way that CodePane can access
      // We'll use localStorage for simplicity
      localStorage.setItem(`artifacts-${clientId}`, JSON.stringify(response.artifacts))
    } catch (error) {
      console.error('Error analyzing requirements:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const exampleRequirements = [
    'We need a Snowflake data warehouse connected to S3, with dbt for transformations and Airflow for orchestration.',
    'Set up a Kubernetes cluster on AWS with Airflow for workflow management.',
    'Deploy a production environment with Snowflake, S3 storage, and dbt transformations.',
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Deployment Copilot</h2>
        <p className="text-sm text-gray-600">
          Upload or paste client requirements to generate a deployment plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste client requirements here...&#10;&#10;Example:&#10;We need a Snowflake data warehouse connected to S3, with dbt for transformations and Airflow for orchestration."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Quick examples:</p>
          <div className="space-y-2">
            {exampleRequirements.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInput(example)}
                className="w-full text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-700"
                disabled={isAnalyzing}
              >
                {example.substring(0, 80)}...
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isAnalyzing}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? 'Analyzing Requirements...' : 'Analyze & Generate Plan'}
        </button>
      </form>

      {isAnalyzing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm text-blue-700">AI Copilot is analyzing your requirements...</span>
          </div>
        </div>
      )}
    </div>
  )
}

