import { create } from "zustand";

export type NodeType = "trigger" | "logic" | "transformer" | "action";

export type NodePosition = {
  x: number;
  y: number;
};

export type HandlePosition = "left" | "right" | "top" | "bottom";

export type HandleDef = {
  id: string;
  position: HandlePosition;
  label?: string;
};

export type WebhookData = {
  webhookUrl?: string;
  method?: string;
};

export type LogicData = {
  propertyKey?: string;
  comparison?: "equals" | "contains" | "greaterThan" | "lessThan";
  comparisonValue?: string;
};

export type TransformerData = {
  transformFunction?: "uppercase" | "lowercase" | "formatDate" | "parseJson";
};

export type ActionData = {
  channelName?: string;
  messageText?: string;
};

export type NodeData = WebhookData | LogicData | TransformerData | ActionData;

export type CanvasNode = {
  id: string;
  type: NodeType;
  position: NodePosition;
  width: number;
  height: number;
  title: string;
  data: NodeData;
  inputs: HandleDef[];
  outputs: HandleDef[];
};

export type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
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
  updateNodePosition: (id: string, position: NodePosition) => void;
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
  getNodeById: (id: string) => CanvasNode | undefined;
  getEdgesForNode: (nodeId: string) => CanvasEdge[];
};

const defaultNodeConfig: Record<NodeType, { width: number; height: number; inputs: HandleDef[]; outputs: HandleDef[] }> = {
  trigger: {
    width: 260,
    height: 180,
    inputs: [],
    outputs: [{ id: "out", position: "right" }],
  },
  logic: {
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
  action: {
    width: 260,
    height: 220,
    inputs: [{ id: "in", position: "left" }],
    outputs: [],
  },
};

const nodeTitles: Record<NodeType, string> = {
  trigger: "Webhook Trigger",
  logic: "If / Else",
  transformer: "Data Transformer",
  action: "Send Slack",
};

const nodeDataDefaults: Record<NodeType, NodeData> = {
  trigger: { webhookUrl: "https://api.ancrest.dev/webhook/", method: "POST" },
  logic: { propertyKey: "status", comparison: "equals", comparisonValue: "active" },
  transformer: { transformFunction: "uppercase" },
  action: { channelName: "#notifications", messageText: "New event: {{event.type}}" },
};

export function createDefaultNode(
  type: NodeType,
  x: number,
  y: number,
  id?: string
): CanvasNode {
  const config = defaultNodeConfig[type];
  const nodeId = id ?? `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: nodeId,
    type,
    position: { x, y },
    width: config.width,
    height: config.height,
    title: nodeTitles[type],
    data: { ...nodeDataDefaults[type] },
    inputs: config.inputs.map((h) => ({ ...h })),
    outputs: config.outputs.map((h) => ({ ...h })),
  };
}

export function createEdge(
  source: string,
  target: string,
  sourceHandle?: string,
  targetHandle?: string
): CanvasEdge {
  return {
    id: `edge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source,
    target,
    sourceHandle,
    targetHandle,
  };
}

const initialState: Omit<
  CanvasState,
  | "setNodes"
  | "setEdges"
  | "addNode"
  | "updateNodePosition"
  | "updateNodeData"
  | "removeNode"
  | "addEdge"
  | "removeEdge"
  | "setViewport"
  | "panViewport"
  | "setZoom"
  | "setSelectedNodeId"
  | "setIsDraggingNode"
  | "setIsPanning"
  | "setActiveEdgeIds"
  | "setExecutionLogs"
  | "addExecutionLog"
  | "setIsExecuting"
  | "setShowConsole"
  | "setConnectingFrom"
  | "reset"
  | "loadWorkflow"
  | "getNodeById"
  | "getEdgesForNode"
> = {
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

export const useCanvasStore = create<CanvasState>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  updateNodePosition: (id, position) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, position: { ...position } } : n
      ),
    })),

  updateNodeData: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  removeNode: (id) =>
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  addEdge: (edge) => set((s) => ({ edges: [...s.edges, edge] })),

  removeEdge: (id) => set((s) => ({ edges: s.edges.filter((e) => e.id !== id) })),

  setViewport: (viewport) => set({ viewport }),

  panViewport: (dx, dy) =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        x: s.viewport.x + dx,
        y: s.viewport.y + dy,
      },
    })),

  setZoom: (zoom) =>
    set((s) => ({
      viewport: {
        ...s.viewport,
        zoom: Math.max(0.3, Math.min(2, zoom)),
      },
    })),

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
  getNodeById: (id) => get().nodes.find((n) => n.id === id),
  getEdgesForNode: (nodeId) => get().edges.filter((e) => e.source === nodeId || e.target === nodeId),
}));
