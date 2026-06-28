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

export type HistoryEntry = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};

export type CanvasState = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  viewport: CanvasViewport;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isDraggingNode: boolean;
  isPanning: boolean;
  activeEdgeIds: string[];
  executionLogs: ExecutionLog[];
  isExecuting: boolean;
  showConsole: boolean;
  connectingFrom: { nodeId: string; handleId: string } | null;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Actions
  setNodes: (nodes: CanvasNode[]) => void;
  setEdges: (edges: CanvasEdge[]) => void;
  addNode: (node: CanvasNode) => void;
  updateNodePosition: (id: string, position: NodePosition) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => boolean;
  removeEdge: (id: string) => void;
  setViewport: (viewport: CanvasViewport) => void;
  panViewport: (dx: number, dy: number) => void;
  setZoom: (zoom: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setIsDraggingNode: (val: boolean) => void;
  setIsPanning: (val: boolean) => void;
  setActiveEdgeIds: (ids: string[]) => void;
  setExecutionLogs: (logs: ExecutionLog[]) => void;
  addExecutionLog: (log: ExecutionLog) => void;
  setIsExecuting: (val: boolean) => void;
  setShowConsole: (val: boolean) => void;
  setConnectingFrom: (val: { nodeId: string; handleId: string } | null) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  reset: () => void;
  loadWorkflow: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  getNodeById: (id: string) => CanvasNode | undefined;
  getEdgesForNode: (nodeId: string) => CanvasEdge[];
  validateEdge: (edge: Omit<CanvasEdge, "id">) => { valid: boolean; error?: string };
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
  | "setSelectedEdgeId"
  | "setIsDraggingNode"
  | "setIsPanning"
  | "setActiveEdgeIds"
  | "setExecutionLogs"
  | "addExecutionLog"
  | "setIsExecuting"
  | "setShowConsole"
  | "setConnectingFrom"
  | "undo"
  | "redo"
  | "pushHistory"
  | "reset"
  | "loadWorkflow"
  | "getNodeById"
  | "getEdgesForNode"
  | "validateEdge"
> = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  selectedEdgeId: null,
  isDraggingNode: false,
  isPanning: false,
  activeEdgeIds: [],
  executionLogs: [],
  isExecuting: false,
  showConsole: false,
  connectingFrom: null,
  history: [],
  historyIndex: -1,
};

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    set((s) => ({ nodes: [...s.nodes, node] }));
    get().pushHistory();
  },

  updateNodePosition: (id, position) =>
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, position: { ...position } } : n
      ),
    })),

  updateNodeData: (id, data) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } } : n
      ),
    }));
    get().pushHistory();
  },

  removeNode: (id) => {
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
    get().pushHistory();
  },

  addEdge: (edge) => {
    const validation = get().validateEdge(edge);
    if (!validation.valid) {
      return false;
    }
    set((s) => ({ edges: [...s.edges, edge] }));
    get().pushHistory();
    return true;
  },

  removeEdge: (id) => {
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }));
    get().pushHistory();
  },

  validateEdge: (edge) => {
    const s = get();
    // 1. Self-loop prevention
    if (edge.source === edge.target) {
      return { valid: false, error: "Self-loop detected! Cannot connect a node to itself." };
    }
    // 2. Duplicate connection prevention
    const isDuplicate = s.edges.some(
      (e) =>
        e.source === edge.source &&
        e.target === edge.target &&
        e.sourceHandle === edge.sourceHandle &&
        e.targetHandle === edge.targetHandle
    );
    if (isDuplicate) {
      return { valid: false, error: "Duplicate connection! This edge already exists." };
    }
    // 3. Directional flow: output -> input
    const sourceNode = s.nodes.find((n) => n.id === edge.source);
    const targetNode = s.nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) {
      return { valid: false, error: "Invalid nodes for connection." };
    }
    const sourceHandle = sourceNode.outputs.find((h) => h.id === edge.sourceHandle);
    const targetHandle = targetNode.inputs.find((h) => h.id === edge.targetHandle);
    if (!sourceHandle && sourceNode.outputs.length > 0) {
      return { valid: false, error: "Invalid source handle." };
    }
    if (!targetHandle && targetNode.inputs.length > 0) {
      return { valid: false, error: "Invalid target handle." };
    }
    // 4. Target handle already occupied
    if (targetHandle && targetNode.inputs.length > 0) {
      const handleOccupied = s.edges.some(
        (e) => e.target === edge.target && e.targetHandle === edge.targetHandle
      );
      if (handleOccupied) {
        return { valid: false, error: "Target handle already occupied!" };
      }
    }
    return { valid: true };
  },

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
  setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),
  setIsDraggingNode: (val) => set({ isDraggingNode: val }),
  setIsPanning: (val) => set({ isPanning: val }),
  setActiveEdgeIds: (ids) => set({ activeEdgeIds: ids }),
  setExecutionLogs: (logs) => set({ executionLogs: logs }),
  addExecutionLog: (log) => set((s) => ({ executionLogs: [...s.executionLogs, log] })),
  setIsExecuting: (val) => set({ isExecuting: val }),
  setShowConsole: (val) => set({ showConsole: val }),
  setConnectingFrom: (val) => set({ connectingFrom: val }),

  pushHistory: () => {
    set((s) => {
      const entry: HistoryEntry = {
        nodes: deepClone(s.nodes),
        edges: deepClone(s.edges),
      };
      const newHistory = s.history.slice(0, s.historyIndex + 1);
      newHistory.push(entry);
      // Keep max 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    set((s) => {
      if (s.historyIndex <= 0) return s;
      const newIndex = s.historyIndex - 1;
      const entry = s.history[newIndex];
      return {
        historyIndex: newIndex,
        nodes: deepClone(entry.nodes),
        edges: deepClone(entry.edges),
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    });
  },

  redo: () => {
    set((s) => {
      if (s.historyIndex >= s.history.length - 1) return s;
      const newIndex = s.historyIndex + 1;
      const entry = s.history[newIndex];
      return {
        historyIndex: newIndex,
        nodes: deepClone(entry.nodes),
        edges: deepClone(entry.edges),
        selectedNodeId: null,
        selectedEdgeId: null,
      };
    });
  },

  reset: () => set({ ...initialState }),
  loadWorkflow: (nodes, edges) => {
    set({ nodes, edges, viewport: { x: 0, y: 0, zoom: 1 } });
    get().pushHistory();
  },
  getNodeById: (id) => get().nodes.find((n) => n.id === id),
  getEdgesForNode: (nodeId) => get().edges.filter((e) => e.source === nodeId || e.target === nodeId),
}));
