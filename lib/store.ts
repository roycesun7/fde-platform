import { create } from 'zustand'

export interface Client {
  id: string
  name: string
  requirements: string
  architecture?: Architecture
  status?: 'draft' | 'provisioning' | 'active' | 'error'
}

export interface Architecture {
  components: Component[]
  risks: string[]
  estimatedTime: string
}

export interface Component {
  id: string
  type: 'database' | 'storage' | 'compute' | 'orchestration' | 'transformation'
  name: string
  provider: string
  status: 'pending' | 'provisioning' | 'active' | 'error'
  config?: Record<string, any>
}

export interface Playbook {
  id: string
  name: string
  clientId: string
  architecture: Architecture
  artifacts: Artifacts
  createdAt: string
}

export interface Artifacts {
  terraform: string
  helm?: string
  config?: string
}

interface FDEStore {
  clients: Client[]
  playbooks: Playbook[]
  currentClient: Client | null
  selectedPlaybook: Playbook | null
  provisioningLogs: string[]
  isProvisioning: boolean
  
  setCurrentClient: (client: Client | null) => void
  setSelectedPlaybook: (playbook: Playbook | null) => void
  addClient: (client: Client) => void
  addPlaybook: (playbook: Playbook) => void
  updateClientStatus: (clientId: string, status: Client['status']) => void
  updateComponentStatus: (clientId: string, componentId: string, status: Component['status']) => void
  addProvisioningLog: (log: string) => void
  setProvisioning: (isProvisioning: boolean) => void
  clearProvisioningLogs: () => void
}

export const useFDEStore = create<FDEStore>((set) => ({
  clients: [],
  playbooks: [],
  currentClient: null,
  selectedPlaybook: null,
  provisioningLogs: [],
  isProvisioning: false,

  setCurrentClient: (client) => set({ currentClient: client }),
  setSelectedPlaybook: (playbook) => set({ selectedPlaybook: playbook }),
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),
  addPlaybook: (playbook) => set((state) => ({ playbooks: [...state.playbooks, playbook] })),
  updateClientStatus: (clientId, status) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, status } : c
      ),
      currentClient:
        state.currentClient?.id === clientId
          ? { ...state.currentClient, status }
          : state.currentClient,
    })),
  updateComponentStatus: (clientId, componentId, status) =>
    set((state) => {
      const updateComponent = (arch: Architecture | undefined): Architecture | undefined => {
        if (!arch) return arch
        return {
          ...arch,
          components: arch.components.map((c) =>
            c.id === componentId ? { ...c, status } : c
          ),
        }
      }
      return {
        clients: state.clients.map((c) =>
          c.id === clientId ? { ...c, architecture: updateComponent(c.architecture) } : c
        ),
        currentClient:
          state.currentClient?.id === clientId
            ? { ...state.currentClient, architecture: updateComponent(state.currentClient.architecture) }
            : state.currentClient,
      }
    }),
  addProvisioningLog: (log) =>
    set((state) => ({
      provisioningLogs: [...state.provisioningLogs, log],
    })),
  setProvisioning: (isProvisioning) => set({ isProvisioning }),
  clearProvisioningLogs: () => set({ provisioningLogs: [] }),
}))

