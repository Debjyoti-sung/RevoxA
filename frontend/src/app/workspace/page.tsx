"use client";

import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Users, Shield, Plus, MessageSquare, Briefcase, Calendar, CheckSquare } from 'lucide-react';

export default function Workspace() {
  const { workspaceMembers, workspaceTasks, addTask } = useStore();
  const [activeTab, setActiveTab] = useState<'members' | 'tasks' | 'activity'>('members');

  // Hardcoded comments/activity logs matching workspace flow
  const activityLogs = [
    { user: 'Alex Rivera', detail: 'assigned Clara Vance to "Verify checkout failures"', time: '10 mins ago' },
    { user: 'Sarah Jenkins', detail: 'created new Mental Model: "Payment Issues"', time: '1 hour ago' },
    { user: 'Dave Miller', detail: 'commented on Task #104: "Checking Stripe webhook payload"', time: '3 hours ago' },
    { user: 'System Bot', detail: 'synced 142 records from Slack Link integration', time: '5 hours ago' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Workspace Header Summary */}
      <div className="bg-cardBg border border-cardBorder rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-heading font-extrabold text-primaryText">RevoxA Workspace</h2>
          <p className="text-xs text-secondaryText">
            Manage your product analyst teams, task allocations, and integrations logs.
          </p>
        </div>
        <div className="flex gap-4 text-xs font-semibold text-secondaryText">
          <div>
            <span className="block text-[9px] uppercase font-bold">Billing Tier</span>
            <strong className="text-primaryAccent bg-primaryAccent/10 px-2 py-0.5 rounded text-[10px] inline-block mt-0.5">
              Growth Enterprise
            </strong>
          </div>
          <div className="border-l border-cardBorder pl-4">
            <span className="block text-[9px] uppercase font-bold">Team Members</span>
            <strong className="text-primaryText font-bold">{workspaceMembers.length} active</strong>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-cardBorder text-xs font-semibold space-x-6">
        {[
          { id: 'members', label: 'Team Directory', icon: Users },
          { id: 'tasks', label: 'Allocations & Tasks', icon: CheckSquare },
          { id: 'activity', label: 'Workspace Stream', icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 flex items-center gap-1.5 transition-all ${
                activeTab === tab.id 
                  ? 'border-b-2 border-primaryAccent text-primaryAccent font-bold' 
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Members */}
      {activeTab === 'members' && (
        <div className="bg-cardBg border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondaryBg/40 border-b border-cardBorder text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                <th className="py-3.5 px-6">User Profile</th>
                <th className="py-3.5 px-6">Security Role</th>
                <th className="py-3.5 px-6">Associated Email</th>
                <th className="py-3.5 px-6 text-right">System Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder text-xs text-primaryText">
              {workspaceMembers.map(member => (
                <tr key={member.id} className="hover:bg-secondaryBg/10 transition-colors">
                  <td className="py-3.5 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primaryAccent/10 text-primaryAccent font-bold flex items-center justify-center">
                      {member.avatar}
                    </div>
                    <span className="font-bold">{member.name}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="flex items-center gap-1.5 font-semibold text-secondaryText">
                      <Shield className="w-3.5 h-3.5 text-primaryAccent" />
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-secondaryText font-medium">
                    {member.email}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="text-[10px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-md">
                      Authorized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Tasks */}
      {activeTab === 'tasks' && (
        <div className="bg-cardBg border border-cardBorder rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondaryBg/40 border-b border-cardBorder text-[10px] font-bold text-secondaryText uppercase tracking-wider">
                <th className="py-3.5 px-6">Task Title</th>
                <th className="py-3.5 px-6">Assignee</th>
                <th className="py-3.5 px-6">Workflow Status</th>
                <th className="py-3.5 px-6 text-right">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cardBorder text-xs text-primaryText">
              {workspaceTasks.map(task => (
                <tr key={task.id} className="hover:bg-secondaryBg/10 transition-colors">
                  <td className="py-3.5 px-6 font-bold">{task.title}</td>
                  <td className="py-3.5 px-6 text-secondaryText">{task.assignee}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 bg-primaryAccent/10 text-primaryAccent rounded-md font-bold text-[9px] uppercase">
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      task.priority === 'High' ? 'bg-danger/10 text-danger' : 'bg-secondaryBg text-secondaryText'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Activity logs stream */}
      {activeTab === 'activity' && (
        <div className="bg-cardBg border border-cardBorder rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-primaryText">Workspace Activity Stream</h3>
          <div className="space-y-4">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed items-start pb-3 border-b border-cardBorder/40 last:border-none last:pb-0">
                <div className="w-7 h-7 rounded-full bg-secondaryBg flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-secondaryText" />
                </div>
                <div>
                  <p className="text-primaryText font-medium">
                    <strong className="font-bold text-primaryText">{log.user}</strong> {log.detail}
                  </p>
                  <span className="text-[10px] text-secondaryText">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
