'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFDEStore } from '@/lib/store'
import { Component } from '@/lib/store'

function ComponentNode({ data }: { data: { component: Component } }) {
  const { component } = data
  const statusColors = {
    pending: 'bg-gray-200 border-gray-400',
    provisioning: 'bg-yellow-200 border-yellow-400 animate-pulse',
    active: 'bg-green-200 border-green-500',
    error: 'bg-red-200 border-red-500',
  }

  const typeIcons = {
    database: '🗄️',
    storage: '📦',
    compute: '⚙️',
    orchestration: '🔄',
    transformation: '🔄',
  }

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 min-w-[200px] ${statusColors[component.status]}`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xl">{typeIcons[component.type] || '📦'}</span>
        <h3 className="font-semibold text-sm">{component.name}</h3>
      </div>
      <p className="text-xs text-gray-600 mb-1">{component.provider}</p>
      <div className="flex items-center space-x-1 mt-2">
        <div
          className={`w-2 h-2 rounded-full ${
            component.status === 'active'
              ? 'bg-green-500'
              : component.status === 'provisioning'
              ? 'bg-yellow-500'
              : component.status === 'error'
              ? 'bg-red-500'
              : 'bg-gray-400'
          }`}
        />
        <span className="text-xs capitalize">{component.status}</span>
      </div>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  component: ComponentNode,
}

export default function EnvironmentGraph() {
  const { currentClient, isProvisioning } = useFDEStore()

  const { nodes, edges } = useMemo(() => {
    if (!currentClient?.architecture) {
      return { nodes: [], edges: [] }
    }

    const components = currentClient.architecture.components
    const nodes: Node[] = components.map((component, idx) => ({
      id: component.id,
      type: 'component',
      position: {
        x: (idx % 3) * 250,
        y: Math.floor(idx / 3) * 150,
      },
      data: { component },
    }))

    // Create edges based on component types
    const edges: Edge[] = []
    const dbComponents = components.filter((c) => c.type === 'database')
    const storageComponents = components.filter((c) => c.type === 'storage')
    const transformComponents = components.filter((c) => c.type === 'transformation')
    const orchestrationComponents = components.filter((c) => c.type === 'orchestration')

    // Connect storage to database
    storageComponents.forEach((storage) => {
      dbComponents.forEach((db) => {
        edges.push({
          id: `${storage.id}-${db.id}`,
          source: storage.id,
          target: db.id,
          animated: isProvisioning,
        })
      })
    })

    // Connect database to transformation
    dbComponents.forEach((db) => {
      transformComponents.forEach((transform) => {
        edges.push({
          id: `${db.id}-${transform.id}`,
          source: db.id,
          target: transform.id,
          animated: isProvisioning,
        })
      })
    })

    // Connect orchestration to transformations
    orchestrationComponents.forEach((orch) => {
      transformComponents.forEach((transform) => {
        edges.push({
          id: `${orch.id}-${transform.id}`,
          source: orch.id,
          target: transform.id,
          animated: isProvisioning,
        })
      })
    })

    return { nodes, edges }
  }, [currentClient, isProvisioning])

  const onNodesChange = useCallback(() => {
    // Handle node changes if needed
  }, [])

  const onEdgesChange = useCallback(() => {
    // Handle edge changes if needed
  }, [])

  if (!currentClient) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">
          No client selected. Use the AI Copilot to analyze requirements and generate a deployment plan.
        </p>
      </div>
    )
  }

  if (!currentClient.architecture) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-12 text-center">
        <p className="text-gray-500 text-lg">Generating architecture...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-[600px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {currentClient.name} - Environment Graph
          </h3>
          <p className="text-sm text-gray-600">
            {currentClient.architecture.components.length} components
          </p>
        </div>
        <ProvisionButton clientId={currentClient.id} />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

function ProvisionButton({ clientId }: { clientId: string }) {
  const {
    isProvisioning,
    setProvisioning,
    addProvisioningLog,
    clearProvisioningLogs,
    updateClientStatus,
    updateComponentStatus,
    currentClient,
  } = useFDEStore()

  const handleProvision = async () => {
    if (isProvisioning || !currentClient?.architecture) return

    setProvisioning(true)
    clearProvisioningLogs()
    updateClientStatus(clientId, 'provisioning')

    const components = currentClient.architecture.components
    const logMessages = [
      'Initializing provisioning process...',
      'Validating infrastructure requirements...',
      'Creating Terraform execution plan...',
      'Applying infrastructure changes...',
    ]

    for (let i = 0; i < components.length; i++) {
      const component = components[i]
      addProvisioningLog(`Provisioning ${component.name}...`)
      updateComponentStatus(clientId, component.id, 'provisioning')

      // Simulate provisioning delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Randomly succeed or show progress
      if (Math.random() > 0.1) {
        addProvisioningLog(`✓ ${component.name} provisioned successfully`)
        updateComponentStatus(clientId, component.id, 'active')
      } else {
        addProvisioningLog(`⚠ ${component.name} encountered a warning (non-critical)`)
        updateComponentStatus(clientId, component.id, 'active')
      }
    }

    addProvisioningLog('✓ All components provisioned successfully')
    updateClientStatus(clientId, 'active')
    setProvisioning(false)
  }

  return (
    <button
      onClick={handleProvision}
      disabled={isProvisioning || !currentClient?.architecture}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
    >
      {isProvisioning ? 'Provisioning...' : 'Simulate Provisioning'}
    </button>
  )
}

