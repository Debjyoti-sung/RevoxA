"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { 
  ShieldAlert, Kanban, List, Calendar, Sparkles, 
  Plus, CheckCircle, ChevronRight, User2, ArrowRight 
} from 'lucide-react';

export default function IssueTracker() {
  const { workspaceTasks, workspaceMembers, addTask, updateTaskStatus } = useStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('Sarah Jenkins');
  const [newPriority, setNewPriority] = useState('Medium');

  const statuses = ['Open', 'Investigating', 'In Progress', 'Resolved'];

  const getPriorityColor = (prio: string) => {
    switch (prio) {
      case 'High': return 'text-danger bg-danger/10 border-danger/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-secondaryText bg-secondaryBg border-cardBorder';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle, newAssignee, newPriority);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center pb-4 border-b border-cardBorder">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">Issue Tracking Board</h2>
          <p className="text-xs text-secondaryText">
            Observe, investigate, and resolve customer bugs in real-time.
          </p>
        </div>

        {/* Views toggler */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-primary text-white rounded-xl text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>Escalate Issue</span>
          </button>

          <div className="flex items-center gap-1.5 bg-secondaryBg p-1.5 rounded-xl border border-cardBorder">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                viewMode === 'kanban' 
                  ? 'bg-cardBg text-primaryText shadow-sm' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 transition-all ${
                viewMode === 'table' 
                  ? 'bg-cardBg text-primaryText shadow-sm' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Creation Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primaryText/20 backdrop-blur-sm animate-fade-in">
          <div className="w-[400px] bg-cardBg border border-cardBorder rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cardBorder">
              <h3 className="font-heading font-extrabold text-sm text-primaryText">Escalate New Issue</h3>
              <button onClick={() => setShowAddForm(false)}>
                X
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Ticket Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Stripe webhook fail triggers timeout"
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Assignee</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none"
                >
                  {workspaceMembers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-secondaryText uppercase block">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-secondaryBg rounded-xl focus:outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-primary text-white text-xs font-semibold rounded-xl"
              >
                Create Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {statuses.map((status) => {
            const statusTasks = workspaceTasks.filter(t => t.status === status);
            return (
              <div key={status} className="bg-secondaryBg/30 border border-cardBorder rounded-2xl p-4 space-y-4">
                {/* Header */}
                <div className="p-2.5 bg-cardBg rounded-xl flex justify-between items-center shadow-sm border-l-2 border-primaryAccent">
                  <span className="text-xs font-heading font-bold uppercase tracking-wider text-primaryText">{status}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-secondaryBg text-primaryText rounded-full">
                    {statusTasks.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="space-y-3">
                  {statusTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="bg-cardBg border border-cardBorder rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3 relative group"
                    >
                      <h4 className="font-heading font-bold text-xs text-primaryText leading-snug">
                        {task.title}
                      </h4>

                      <div className="flex justify-between items-center text-[10px]">
                        <span className="flex items-center gap-1 text-secondaryText">
                          <User2 className="w-3.5 h-3.5" />
                          {task.assignee}
                        </span>
                        <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* State shift trigger */}
                      {status !== 'Resolved' && (
                        <div className="pt-2 border-t border-cardBorder flex justify-end">
                          <button
                            onClick={() => {
                              const nextStatus = status === 'Open' ? 'Investigating' : status === 'Investigating' ? 'In Progress' : 'Resolved';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className="flex items-center gap-0.5 text-[9px] text-primaryAccent font-bold hover:underline"
                          >
                            <span>Advance Status</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {statusTasks.length === 0 && (
                    <p className="text-[10px] text-secondaryText text-center py-6">No active tickets.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-cardBg border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondaryBg/40 border-b border-cardBorder text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                <th className="py-3.5 px-6">Ticket Title</th>
                <th className="py-3.5 px-6">Assignee</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder text-xs text-primaryText">
              {workspaceTasks.map((task) => (
                <tr key={task.id} className="hover:bg-secondaryBg/10 transition-colors">
                  <td className="py-3.5 px-6 font-bold">{task.title}</td>
                  <td className="py-3.5 px-6 text-secondaryText">{task.assignee}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 bg-primaryAccent/10 text-primaryAccent rounded-full font-bold text-[9px] uppercase">
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 border rounded-md font-bold text-[9px] uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
