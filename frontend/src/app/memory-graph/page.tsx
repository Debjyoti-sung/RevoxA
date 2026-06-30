"use client";

import React, { useState, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search, Brain, HelpCircle, X, Network, Sparkles } from 'lucide-react';

export default function MemoryGraph() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Core set of mock nodes mapping relations
  const initialNodes = [
    { id: '1', position: { x: 250, y: 150 }, data: { label: 'RevoxA Memory Engine', type: 'Core' }, type: 'input' },
    // Clusters
    { id: 'c1', position: { x: 100, y: 250 }, data: { label: 'Stripe Timeout failures', type: 'Cluster', desc: 'Aggregated Stripe 402 API timeout clusters.' } },
    { id: 'c2', position: { x: 400, y: 250 }, data: { label: 'Workspace Invite expirations', type: 'Cluster', desc: 'Reports of invite links expiring prematurely.' } },
    // Feedbacks
    { id: 'f1', position: { x: -20, y: 350 }, data: { label: 'Clara Vance: Renew failing', type: 'Feedback', desc: 'Stripe renew loop failure reported via Gmail.' } },
    { id: 'f2', position: { x: 200, y: 350 }, data: { label: 'Mark Harrison: Confusing invites', type: 'Feedback', desc: 'Onboarding feedback detailing JWT link expirations.' } },
    // Features
    { id: 'feat1', position: { x: -50, y: 460 }, data: { label: 'Async Webhook Queueing', type: 'Feature', desc: 'Suggested system queues to resolve Stripe bottlenecks.' } },
    { id: 'feat2', position: { x: 300, y: 460 }, data: { label: 'Invite lifespans expansion', type: 'Feature', desc: 'Task to increase token availability to 24 hours.' } },
    // Recommendations
    { id: 'r1', position: { x: 120, y: 550 }, data: { label: 'Adjust Stripe concurrency config', type: 'Recommendation', desc: 'Recommendation to increase thread limits.' } },
    // User / Release
    { id: 'u1', position: { x: 550, y: 350 }, data: { label: 'Sarah Jenkins (Owner)', type: 'User', desc: 'Admin handling infrastructure deployments.' } }
  ];

  const initialEdges = [
    { id: 'e-c1', source: '1', target: 'c1', animated: true, label: 'indexes' },
    { id: 'e-c2', source: '1', target: 'c2', animated: true, label: 'indexes' },
    
    { id: 'e-f1', source: 'c1', target: 'f1', label: 'Mentions' },
    { id: 'e-f2', source: 'c2', target: 'f2', label: 'Mentions' },
    
    { id: 'e-feat1', source: 'f1', target: 'feat1', label: 'Growing Into', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-feat2', source: 'f2', target: 'feat2', label: 'Growing Into', markerEnd: { type: MarkerType.ArrowClosed } },
    
    { id: 'e-r1', source: 'feat1', target: 'r1', label: 'Resolved By', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e-u1', source: 'c2', target: 'u1', label: 'Assigned To' }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as any);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter nodes on search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setNodes(initialNodes.map(n => ({ ...n, style: {} })) as any);
      return;
    }
    const query = searchQuery.toLowerCase();
    const updatedNodes = initialNodes.map(node => {
      const match = node.data.label.toLowerCase().includes(query) || node.data.type.toLowerCase().includes(query);
      return {
        ...node,
        style: match 
          ? { border: '2px solid #6366F1', boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)', background: '#FFF' }
          : { opacity: 0.4 }
      };
    });
    setNodes(updatedNodes as any);
  }, [searchQuery]);

  const onNodeClick = (_: any, node: any) => {
    setSelectedNode(node);
  };

  // Node background styling colors by type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'Core': return '#FAFBFF';
      case 'Cluster': return '#E0F2FE'; // light blue
      case 'Feedback': return '#FCE7F3'; // light pink
      case 'Feature': return '#EEF2FF'; // light indigo
      case 'Recommendation': return '#D1FAE5'; // light emerald
      case 'User': return '#FEF3C7'; // light amber
      default: return '#FFF';
    }
  };

  const formattedNodes = nodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      background: getNodeColor((node.data as any).type),
      color: '#1E2433',
      border: '1px solid #E5E9F2',
      borderRadius: '12px',
      padding: '8px 12px',
      fontSize: '10px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.05)'
    }
  }));

  if (!mounted) {
    return <div className="h-screen flex items-center justify-center animate-shimmer">Initializing canvas layout...</div>;
  }

  return (
    <div className="h-[calc(100vh-10rem)] border border-cardBorder rounded-2xl bg-cardBg overflow-hidden shadow-sm flex flex-col relative animate-fade-in">
      
      {/* Header bar controller */}
      <div className="p-4 border-b border-cardBorder flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-cardBg z-10">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-primaryAccent" />
          <div>
            <h3 className="font-heading font-extrabold text-sm text-primaryText">Hindsight Memory Graph</h3>
            <p className="text-[10px] text-secondaryText">Trace vectors links across feedback nodes, issues, and teams</p>
          </div>
        </div>

        {/* Filter search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondaryText" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes in vector graph..."
            className="w-full pl-9 pr-3 py-1.5 bg-secondaryBg rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Main Canvas view */}
      <div className="flex-1 w-full bg-secondaryBg/20 relative">
        <ReactFlow
          nodes={formattedNodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
        >
          <Background color="#E5E9F2" gap={16} />
          <Controls />
          <MiniMap style={{ height: 100, width: 150 }} nodeColor={(n: any) => getNodeColor(n.data.type)} />
        </ReactFlow>
      </div>

      {/* Node details panel inspector */}
      {selectedNode && (
        <div className="absolute top-16 right-4 w-72 bg-glass border border-cardBorder rounded-2xl p-4 shadow-lg z-10 animate-slide-in">
          <div className="flex justify-between items-start pb-2 border-b border-cardBorder mb-3">
            <div>
              <span className="text-[8px] font-bold text-primaryAccent uppercase bg-primaryAccent/10 px-2 py-0.5 rounded">
                {selectedNode.data.type} Node Info
              </span>
              <h4 className="font-heading font-bold text-xs text-primaryText mt-1">
                {selectedNode.data.label}
              </h4>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-secondaryBg rounded-lg text-secondaryText"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-secondaryText leading-relaxed">
            {selectedNode.data.desc || 'RevoxA long term memory mapping connection. Check relational lines to observe caused issues.'}
          </p>

          <div className="mt-3 pt-3 border-t border-cardBorder text-[9px] text-secondaryText flex items-center justify-between">
            <span>Graph ID: node-{selectedNode.id}</span>
            <span className="font-semibold text-primaryAccent flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Trace Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
