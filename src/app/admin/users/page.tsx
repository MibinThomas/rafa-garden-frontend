"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, RefreshCw, X, Save, Eye, EyeOff, KeyRound } from "lucide-react";

const ROLES = ['super-admin', 'admin', 'content-manager', 'inventory-manager'];
const ROLE_DESCRIPTIONS: Record<string, string> = {
  'super-admin': 'Full access to all features including user management',
  'admin': 'Full access except user management',
  'content-manager': 'Can manage products, categories, blog, and CMS',
  'inventory-manager': 'Can only manage inventory and view orders',
};

function Toast({ msg, type, onClose }: any) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-white text-sm font-medium shadow-2xl ${type === 'success' ? 'bg-[#7fa23f]' : 'bg-red-500'}`}>{msg}</div>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [showPass, setShowPass] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const showToast = (msg: string, type: string) => setToast({ msg, type });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch {
      showToast('Failed to load database users', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setEditUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditUser(user);
    setName(user.name || '');
    setEmail(user.email || '');
    setPassword(''); // Leave blank unless changing
    setRole(user.role || 'admin');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Update user in DB
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editUser._id,
            name,
            email,
            password: password ? password : undefined,
            role,
          }),
        });
        if (res.ok) {
          showToast('User credentials updated successfully in database!', 'success');
          setShowModal(false);
          fetchUsers();
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to update user', 'error');
        }
      } else {
        // Create user in DB
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (res.ok) {
          showToast('New Database Admin User created!', 'success');
          setShowModal(false);
          fetchUsers();
        } else {
          const err = await res.json();
          showToast(err.error || 'Failed to create user', 'error');
        }
      }
    } catch {
      showToast('Error saving user to database', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this database user?')) return;
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('User deleted from database', 'success');
        fetchUsers();
      } else {
        showToast('Delete failed', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1000px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>USERS & ROLES</h1>
          <p className="text-gray-400 text-sm mt-1">Manage database admin users, credentials, and password resets</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-lg hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}
        >
          <Plus size={16} /> Add Database User
        </button>
      </div>

      {/* Database Users List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #c81c6a, #9a0c52)' }} />
            <h2 className="font-bold text-[#1a1a1a]">Database Admin Users</h2>
          </div>
          <button onClick={fetchUsers} className="text-xs text-gray-400 hover:text-[#c81c6a] flex items-center gap-1">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Users size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No users found in database. Click &quot;Add Database User&quot; to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Email / Username</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#1a1a1a]">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#c81c6a]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#c81c6a]/10 text-[#c81c6a] capitalize">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all"
                        >
                          <KeyRound size={13} /> Reset Password
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Environment User Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <div className="w-1 h-5 rounded-full bg-amber-500" />
          <h2 className="font-bold text-[#1a1a1a]">Fallback Environment Account (.env.local)</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">Fallback credentials when MongoDB is unpopulated:</p>
        <div className="bg-[#1a1a1a] rounded-xl p-4 font-mono text-xs space-y-1">
          <p><span className="text-amber-400">ADMIN_EMAIL</span>=<span className="text-blue-300">admin@rafagarden.com</span></p>
          <p><span className="text-amber-400">ADMIN_PASSWORD</span>=<span className="text-blue-300">Admin@1234</span></p>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">
              {editUser ? 'Reset Password & Edit User' : 'Add Database Admin User'}
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              {editUser ? `Updating credentials for ${editUser.email}` : 'Create a new admin user stored in MongoDB'}
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Admin User"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Email / Username</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@rafagarden.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  {editUser ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required={!editUser}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={editUser ? 'Enter new password...' : '••••••••'}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#c81c6a]"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium shadow-md hover:opacity-90 flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #c81c6a, #9a0c52)' }}
                >
                  <Save size={15} /> Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
