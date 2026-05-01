"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  Handle,
  type Node,
  Position,
  ReactFlow,
} from "@xyflow/react";
import { motion } from "framer-motion";
import { AlertTriangle, Box, Radar, Server, Siren } from "lucide-react";
import { useMemo } from "react";
import { type GraphEdge, type GraphNode, severityConfig } from "@/lib/incidents";

export function IncidentGraph({
  nodes: graphNodes,
  edges: graphEdges,
  onSelectCause,
  selectedCauseId,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectCause?: (id: string) => void;
  selectedCauseId?: string;
}) {
  const nodes = useMemo<Node[]>(() => {
    return graphNodes.map((n) => ({
      id: n.id,
      type: n.kind,
      position: { x: n.x, y: n.y },
      data: {
        ...n,
        onSelect: () => onSelectCause?.(n.id),
        isSelected: selectedCauseId === n.id,
      },
      draggable: false,
    }));
  }, [graphNodes, onSelectCause, selectedCauseId]);

  const edges = useMemo<Edge[]>(() => {
    return graphEdges.map((e) => {
      const isTopCause =
        e.kind === "caused_by" && !e.inferring && (e.weight ?? 0) > 0.7;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.inferring === true || isTopCause,
        className: e.inferring ? "edge-inferring" : "",
        type: "smoothstep",
        style: {
          stroke: isTopCause
            ? "var(--accent)"
            : e.kind === "caused_by"
              ? "var(--ink-4)"
              : "var(--line-2)",
          strokeWidth: isTopCause ? 2 : 1.25,
        },
      };
    });
  }, [graphEdges]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.22 }}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable={false}
        zoomOnScroll={false}
        panOnDrag
      >
        <Background
          gap={24}
          size={1}
          color="var(--line-2)"
          variant={BackgroundVariant.Dots}
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          orientation="horizontal"
        />
      </ReactFlow>
    </div>
  );
}

function AlertNode({
  data,
}: {
  data: GraphNode & { onSelect?: () => void; isSelected?: boolean };
}) {
  const sev = data.severity ? severityConfig(data.severity) : undefined;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex items-center gap-2 border bg-surface px-3 py-2 rounded-[4px] shadow-[0_1px_0_rgba(15,17,21,0.04)]"
      style={{ borderColor: sev?.ink ?? "var(--line)", minWidth: 170 }}
    >
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Siren
        className="h-3.5 w-3.5"
        strokeWidth={1.75}
        style={{ color: sev?.ink ?? "var(--ink-2)" }}
      />
      <div className="min-w-0">
        <div
          className="mono text-[10px] font-semibold tracking-[0.06em]"
          style={{ color: sev?.ink }}
        >
          {sev?.label} · ALERT
        </div>
        <div className="text-[12.5px] text-ink leading-tight truncate">{data.label}</div>
        {data.meta && (
          <div className="mono text-[10px] text-ink-3 truncate">{data.meta}</div>
        )}
      </div>
    </motion.div>
  );
}

function ServiceNode({ data }: { data: GraphNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex items-center gap-2 border border-line bg-surface-2 px-3 py-2 rounded-[4px]"
      style={{ minWidth: 160 }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <Server className="h-3.5 w-3.5 text-ink-2" strokeWidth={1.75} />
      <div className="min-w-0">
        <div className="label !text-[9.5px] !tracking-[0.12em]">SERVICE</div>
        <div className="text-[12.5px] text-ink leading-tight truncate">{data.label}</div>
        {data.meta && (
          <div className="mono text-[10px] text-ink-3 truncate">{data.meta}</div>
        )}
      </div>
    </motion.div>
  );
}

function IncidentNode({ data }: { data: GraphNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="relative flex items-center gap-2.5 border-2 border-ink bg-surface px-3.5 py-2.5 rounded-[4px] shadow-[0_4px_12px_rgba(15,17,21,0.08)]"
      style={{ minWidth: 170 }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
      <AlertTriangle className="h-4 w-4 text-ink" strokeWidth={1.75} />
      <div>
        <div className="label !text-[9.5px] !tracking-[0.14em] text-ink">INCIDENT</div>
        <div className="display text-[14px] text-ink leading-tight">{data.label}</div>
        {data.meta && (
          <div className="mono text-[10px] text-ink-3">{data.meta}</div>
        )}
      </div>
    </motion.div>
  );
}

function CauseNode({
  data,
}: {
  data: GraphNode & { onSelect?: () => void; isSelected?: boolean };
}) {
  const s = data.score ?? 0;
  const tone = s > 70 ? "accent" : s > 40 ? "warn" : "muted";
  const ringColor =
    tone === "accent"
      ? "var(--accent)"
      : tone === "warn"
        ? "var(--warn)"
        : "var(--ink-4)";
  const icon = tone === "accent" ? Radar : Box;
  const Icon = icon;
  return (
    <motion.button
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={data.onSelect}
      className={[
        "relative flex flex-col items-start gap-1 border bg-surface px-3 py-2 rounded-[4px] text-left transition-colors",
        data.isSelected ? "border-ink" : "hover:border-line-2",
      ].join(" ")}
      style={{
        borderColor: data.isSelected ? "var(--ink)" : ringColor,
        minWidth: 190,
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} style={{ color: ringColor }} />
        <span
          className="mono text-[9.5px] tracking-[0.12em]"
          style={{ color: ringColor }}
        >
          CAUSE · {s}%
        </span>
      </div>
      <div className="text-[12.5px] text-ink leading-tight">{data.label}</div>
      {data.meta && (
        <div className="mono text-[10px] text-ink-3">{data.meta}</div>
      )}
      {/* mini confidence bar */}
      <div className="mt-1 h-[3px] w-full bg-line rounded-sm overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${s}%`, background: ringColor }}
        />
      </div>
    </motion.button>
  );
}

const NODE_TYPES = {
  alert: AlertNode,
  service: ServiceNode,
  incident: IncidentNode,
  cause: CauseNode,
};

const handleStyle: React.CSSProperties = {
  width: 6,
  height: 6,
  background: "var(--ink-3)",
  border: "none",
};
