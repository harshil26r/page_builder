"use client";
import React, { useState, useEffect } from "react";
import { HiUserGroup, HiUserAdd, HiTrash, HiShieldCheck, HiX, HiCheck } from "react-icons/hi";

const ROLES = [
  { name: "Admin", desc: "Full control over pages, settings, and team invitations" },
  { name: "Editor", desc: "Can create and edit page content and layout blocks" },
  { name: "Publisher", desc: "Can review, schedule, and publish pages" },
  { name: "Viewer", desc: "Read-only access to inspect pages and templates" },
];

export default function WorkspaceModal({ isOpen, onClose }) {
  const [workspace, setWorkspace] = useState(null);
  const [userRole, setUserRole] = useState("Viewer");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Editor");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) fetchWorkspace();
  }, [isOpen]);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workspace");
      const data = await res.json();
      if (data.success) {
        setWorkspace(data.workspace);
        setUserRole(data.userRole);
      }
    } catch (err) {
      console.error("Failed to load workspace:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: selectedRole }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace(data.workspace);
        setInviteEmail("");
        setMessage("Team member added successfully!");
      } else {
        setMessage(data.error || "Failed to invite member");
      }
    } catch {
      setMessage("Error sending invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email) => {
    if (!confirm(`Remove ${email} from workspace?`)) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/workspace?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setWorkspace(data.workspace);
      }
    } catch (err) {
      console.error("Failed to remove member:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const canManage = ["Owner", "Admin"].includes(userRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <HiX className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HiUserGroup className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {workspace?.name || "Team Workspace"}
              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Your Role: {userRole}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Manage team access and granular permission roles</p>
          </div>
        </div>

        {canManage && (
          <form onSubmit={handleInvite} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <HiUserAdd className="w-4 h-4 text-indigo-400" /> Invite Team Member
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="sm:col-span-2 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {ROLES.map((r) => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {ROLES.find((r) => r.name === selectedRole)?.desc}
              </span>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 shadow-md"
              >
                Send Invite
              </button>
            </div>
            {message && <p className="text-xs text-cyan-400 font-medium">{message}</p>}
          </form>
        )}

        {/* Member Roster */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Workspace Members ({workspace?.members?.length || 0})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {workspace?.members?.map((m) => (
              <div
                key={m.email}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 uppercase">
                    {m.email[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{m.email}</div>
                    <div className="text-[10px] text-slate-500">Joined {new Date(m.joinedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    m.role === "Owner"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : m.role === "Admin"
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      : m.role === "Publisher"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}>
                    {m.role}
                  </span>

                  {canManage && m.role !== "Owner" && (
                    <button
                      onClick={() => handleRemove(m.email)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove member"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
