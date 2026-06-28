import type { CanvasNode, CanvasEdge, ExecutionLog, ExecutionPayload } from "@/lib/canvas-store";

export class ExecutionEngine {
  private nodes: CanvasNode[];
  private edges: CanvasEdge[];

  constructor(nodes: CanvasNode[], edges: CanvasEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  async execute(
    onLog: (log: ExecutionLog) => void,
    onActiveEdges: (ids: string[]) => void,
  ) {
    const payload: ExecutionPayload = {
      event: {
        type: "charge.succeeded",
        id: "evt_" + Math.random().toString(36).slice(2, 10),
        data: {
          status: "active",
          amount: 4999,
          user: { name: "Alex Chen", email: "alex@example.com" },
          timestamp: new Date().toISOString(),
        },
      },
    };

    // Find webhook trigger
    const triggerNode = this.nodes.find((n) => n.type === "webhook");
    if (!triggerNode) {
      onLog({
        step: 1,
        nodeId: "none",
        nodeTitle: "Error",
        input: {},
        output: {},
        status: "error",
        message: "No webhook trigger node found",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    let currentPayload = { ...payload };
    let currentNodeId = triggerNode.id;
    let step = 1;
    const visitedNodes = new Set<string>();
    const activeEdges: string[] = [];

    // Process webhook
    onLog({
      step: step++,
      nodeId: triggerNode.id,
      nodeTitle: triggerNode.title,
      input: { trigger: "manual test" },
      output: currentPayload,
      status: "success",
      timestamp: new Date().toISOString(),
    });
    visitedNodes.add(triggerNode.id);

    // Traverse edges
    let maxIterations = 20;
    while (currentNodeId && maxIterations-- > 0) {
      const outgoingEdges = this.edges.filter((e) => e.sourceNodeId === currentNodeId);
      if (outgoingEdges.length === 0) break;

      for (const edge of outgoingEdges) {
        activeEdges.push(edge.id);
        onActiveEdges([...activeEdges]);
        await this.delay(600);

        const targetNode = this.nodes.find((n) => n.id === edge.targetNodeId);
        if (!targetNode || visitedNodes.has(targetNode.id)) continue;

        const inputPayload = { ...currentPayload };
        let outputPayload = { ...currentPayload };
        let status: "success" | "error" = "success";
        let message: string | undefined;

        if (targetNode.type === "ifelse") {
          const { propertyKey, comparison, comparisonValue } = targetNode.data;
          const value = this.getValueByPath(currentPayload, propertyKey ?? "status");
          const condition = this.evaluateCondition(value, comparison ?? "equals", comparisonValue ?? "active");
          const branch = condition ? "True" : "False";
          outputPayload = { ...currentPayload, _branch: branch };
          message = `Condition ${propertyKey} ${comparison} ${comparisonValue} → ${branch}`;
          visitedNodes.add(targetNode.id);
          onLog({
            step: step++,
            nodeId: targetNode.id,
            nodeTitle: targetNode.title,
            input: inputPayload,
            output: outputPayload,
            status,
            message,
            timestamp: new Date().toISOString(),
          });
          currentPayload = outputPayload;
          currentNodeId = targetNode.id;
          // Only continue on the matching branch
          const nextEdge = this.edges.find(
            (e) => e.sourceNodeId === targetNode.id && e.sourceHandle === (condition ? "true" : "false")
          );
          if (nextEdge) {
            activeEdges.push(nextEdge.id);
            onActiveEdges([...activeEdges]);
            await this.delay(400);
            currentNodeId = nextEdge.targetNodeId;
          } else {
            currentNodeId = "";
          }
          break;
        } else if (targetNode.type === "transformer") {
          const fn = targetNode.data.transformFunction ?? "uppercase";
          outputPayload = this.applyTransform(currentPayload, fn);
          message = `Applied ${fn}`;
          visitedNodes.add(targetNode.id);
          onLog({
            step: step++,
            nodeId: targetNode.id,
            nodeTitle: targetNode.title,
            input: inputPayload,
            output: outputPayload,
            status,
            message,
            timestamp: new Date().toISOString(),
          });
          currentPayload = outputPayload;
          currentNodeId = targetNode.id;
        } else if (targetNode.type === "slack") {
          const channel = targetNode.data.channelName ?? "#notifications";
          const msg = targetNode.data.messageText ?? "New event";
          const resolvedMsg = this.resolveTemplate(msg, currentPayload);
          outputPayload = {
            ...currentPayload,
            _sent: { channel, message: resolvedMsg },
          };
          message = `Sent to ${channel}: "${resolvedMsg}"`;
          visitedNodes.add(targetNode.id);
          onLog({
            step: step++,
            nodeId: targetNode.id,
            nodeTitle: targetNode.title,
            input: inputPayload,
            output: outputPayload,
            status,
            message,
            timestamp: new Date().toISOString(),
          });
          currentPayload = outputPayload;
          currentNodeId = targetNode.id;
        }
      }

      // Find next edge
      const nextEdges = this.edges.filter((e) => e.sourceNodeId === currentNodeId);
      if (nextEdges.length === 1) {
        activeEdges.push(nextEdges[0].id);
        onActiveEdges([...activeEdges]);
        await this.delay(400);
        currentNodeId = nextEdges[0].targetNodeId;
      } else if (nextEdges.length === 0) {
        break;
      } else {
        // Multiple branches, only continue if one was already selected
        const currentNode = this.nodes.find((n) => n.id === currentNodeId);
        if (currentNode?.type === "ifelse" && currentPayload._branch) {
          const branchEdge = nextEdges.find((e) => e.sourceHandle === (currentPayload._branch === "True" ? "true" : "false"));
          if (branchEdge) {
            activeEdges.push(branchEdge.id);
            onActiveEdges([...activeEdges]);
            await this.delay(400);
            currentNodeId = branchEdge.targetNodeId;
            continue;
          }
        }
        break;
      }
    }

    onActiveEdges([]);
    onLog({
      step: step,
      nodeId: "system",
      nodeTitle: "Execution Complete",
      input: {},
      output: currentPayload,
      status: "success",
      message: "Workflow executed successfully",
      timestamp: new Date().toISOString(),
    });
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getValueByPath(obj: unknown, path: string): unknown {
    const parts = path.split(".");
    let current: unknown = obj;
    for (const part of parts) {
      if (current && typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  private evaluateCondition(value: unknown, op: string, compareValue: string): boolean {
    const strValue = String(value).toLowerCase();
    const strCompare = compareValue.toLowerCase();
    switch (op) {
      case "equals":
        return strValue === strCompare;
      case "contains":
        return strValue.includes(strCompare);
      case "greaterThan":
        return Number(value) > Number(compareValue);
      case "lessThan":
        return Number(value) < Number(compareValue);
      default:
        return strValue === strCompare;
    }
  }

  private applyTransform(payload: ExecutionPayload, fn: string): ExecutionPayload {
    const result = { ...payload };
    switch (fn) {
      case "uppercase":
        result._transformed = "UPPERCASED";
        break;
      case "lowercase":
        result._transformed = "lowercased";
        break;
      case "formatDate":
        result._transformed = new Date().toLocaleString();
        break;
      case "parseJson":
        result._transformed = "JSON parsed";
        break;
    }
    return result;
  }

  private resolveTemplate(template: string, payload: ExecutionPayload): string {
    return template.replace(/\{\{(\w+(\.\w+)*)\}\}/g, (match, path) => {
      const value = this.getValueByPath(payload, path);
      return value !== undefined ? String(value) : match;
    });
  }
}
