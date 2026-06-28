import { create } from "zustand";

export type NodeType = "webhook" | "ifelse" | "transformer" | "slack";

export type HandlePosition = "left" | "right" | "top" | "bottom";

export type HandleDef = {
  id: string;
  position: HandlePosition;
  label?: string;
};

export type NodeData = {
  title?: string;
  webhookUrl?: string;
  propertyKey?: string;
  comparison?: "equals" | "contains" | "greaterThan" | "lessThan";
  comparisonValue?: string;
  transformFunction?: "uppercase" | "lowercase" | "formatDate" | "parseJson";
  channelName?: string;
  messageText?: string;
};

export type CanvasNode = {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  data: NodeData;
  inputs: HandleDef[];
  outputs: HandleDef[];
};

export type CanvasEdge = {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle: string;
  targetHandle: string;
};

export type ExecutionLog = {
  step: number;
  nodeId: string;
  nodeTitle: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: "success" | "error";
  message?: string;
  timestamp: string;
};

export type ExecutionPayload = Record<string, unknown>;

export type CanvasViewport = {
  x: number;
  y: number;
  zoom: number;
};

export type CanvasState = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: CanvasViewport;
  selectedNodeId: string | null;
  isDraggingNode: boolean;
  isPanning: boolean;
  activeEdgeIds: string[];
  executionLogs: ExecutionLog[];
  isExecuting: boolean;
  showConsole: boolean;
  connectingFrom: { nodeId: string; handleId: string } | null;

  // Actions
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, updates: Partial<CanvasNode>) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  setViewport: (viewport: CanvasViewport) => void;
  panViewport: (dx: number, dy: number) => void;
  setZoom: (zoom: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setIsDraggingNode: (val: boolean) => void;
  setIsPanning: (val: boolean) => void;
  setActiveEdgeIds: (ids: string[]) => void;
  setExecutionLogs: (logs: ExecutionLog[]) => void;
  addExecutionLog: (log: ExecutionLog) => void;
  setIsExecuting: (val: boolean) => void;
  setShowConsole: (val: boolean) => void;
  setConnectingFrom: (val: { nodeId: string; handleId: string } | null) => void;
  reset: () => void;
  loadWorkflow: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
};

const defaultNodeConfig: Record<NodeType, { width: number; height: number; inputs: HandleDef[]; outputs: HandleDef[] }> = {
  webhook: {
    width: 260,
    height: 180,
    inputs: [],
    outputs: [{ id: "out", position: "right" }],
  },
  ifelse: {
    width: 260,
    height: 220,
    inputs: [{ id: "in", position: "left" }],
    outputs: [
      { id: "true", position: "right", label: "True" },
      { id: "false", position: "bottom", label: "False" },
    ],
  },
  transformer: {
    width: 260,
    height: 180,
    inputs: [{ id: "in", position: "left" }],
    outputs: [{ id: "out", position: "right" }],
  },
  slack: {
    width: 260,
    height: 220,
    inputs: [{ id: "in", position: "left" }],
    outputs: [],
  },
};

export function createDefaultNode(type: NodeType, x: number, y: number): CanvasNode {
  const config = defaultNodeConfig[type];
  const id = `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const dataDefaults: Record<NodeType, NodeData> = {
    webhook: { webhookUrl: `https://api.ancore.dev/webhook/${id}` },
    ifelse: { propertyKey: "status", comparison: "equals", comparisonValue: "active" },
    transformer: { transformFunction: "uppercase" },
    slack: { channelName: "#notifications", messageText: "New event: {{event.type}}" },
  };
  return {
    id,
    type,
    x,
    y,
    width: config.width,
    height: config.height,
    title: type === "webhook" ? "Webhook Trigger" : type === "ifelse" ? "If / Else" : type === "transformer" ? "Data Transformer" : "Send Slack",
    data: dataDefaults[type],
    inputs: config.inputs,
    outputs: config.outputs,
  };
}

const initialState: Omit<CanvasState, keyof Pick<CanvasState, 
  "setNodes" | "setEdges" | "addNode" | "updateNode" | "updateNodeData" | "removeNode" | "addEdge" | "removeEdge" | "setViewport" | "panViewport" | "setZoom" | "setSelectedNodeId" | "setIsDraggingNode" | "setIsPanning" | "setActiveEdgeIds" | "setExecutionLogs" | "addExecutionLog" | "setIsExecuting" | "setShowConsole" | "reset" | "loadWorkflow"
>> = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  isDraggingNode: false,
  isPanning: false,
  activeEdgeIds: [],
  executionLogs: [],
  isExecuting: false,
  showConsole: false,
  connectingFrom: null,
};

export const useCanvasStore = create<CanvasState>((set) => ({
  ...initialState,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
  updateNode: (id, updates) => set((s) => ({
    nodes: s.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
  })),
  updateNodeData: (id, data) => set((s) => ({
    nodes: s.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
  })),
  removeNode: (id) => set((s) => ({
    nodes: s.nodes.filter((n) => n.id !== id),
    edges: s.edges.filter((e) => e.sourceNodeId !== id && e.targetNodeId !== id),
  })),
  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),
  removeEdge: (id) => set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),
  setViewport: (viewport) => set({ viewport }),
  panViewport: (dx, dy) => set((s) => ({ viewport: { ...s.viewport, x: s.viewport.x + dx, y: s.viewport.y + dy } })),
  setZoom: (zoom) => set((s) => ({ viewport: { ...s.viewport, zoom: Math.max(0.3, Math.min(2, zoom)) } })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setIsDraggingNode: (val) => set({ isDraggingNode: val }),
  setIsPanning: (val) => set({ isPanning: val }),
  setActiveEdgeIds: (ids) => set({ activeEdgeIds: ids }),
  setExecutionLogs: (logs) => set({ executionLogs: logs }),
  addExecutionLog: (log) => set((s) => ({ executionLogs: [...s.executionLogs, log] })),
  setIsExecuting: (val) => set({ isExecuting: val }),
  setShowConsole: (val) => set({ showConsole: val }),
  setConnectingFrom: (val) => set({ connectingFrom: val }),
  reset: () => set({ ...initialState }),
  loadWorkflow: (nodes, edges) => set({ nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } }),
}));
