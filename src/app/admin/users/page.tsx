"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, RefreshCw, X, Save, Eye, EyeOff } from "lucide-react";

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
  const [adminEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@rafagarden.com');
  const [toast, setToast] = useState<any>(null);
  const showToast = (msg: string, type: string) => setToast({ msg, type });

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[900px]" style={{ fontFamily: 'AvantGarde, sans-serif' }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: 'DharmaGothic, sans-serif', letterSpacing: '0.05em' }}>USERS & ROLES</h1>
          <p className="text-gray-400 text-sm mt-1">Manage admin access and permissions</p>
        </div>
      </div>

      {/* Current Admin Account */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #c81c6a, #9a0c52)' }} />
          <h2 className="font-bold text-[#1a1a1a]">Admin Account (Environment)</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">The admin account is configured via environment variables. Update your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> file to change credentials.</p>
        <div className="bg-[#1a1a1a] rounded-2xl p-4 font-mono text-sm space-y-1">
          <p className="text-green-400"># .env.local</p>
          <p><span className="text-amber-400">ADMIN_EMAIL</span>=<span className="text-blue-300">your_email@rafagarden.com</span></p>
          <p><span className="text-amber-400">ADMIN_PASSWORD</span>=<span className="text-blue-300">your_secure_password</span></p>
          <p><span className="text-amber-400">JWT_SECRET</span>=<span className="text-blue-300">your_jwt_secret_key</span></p>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-amber-700 text-sm font-medium mb-1">⚠️ Security Reminder</p>
          <p className="text-amber-600 text-sm">Never share your admin credentials. Use a strong password with at least 12 characters, including uppercase, lowercase, numbers, and symbols.</p>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #c81c6a, #9a0c52)' }} />
          <h2 className="font-bold text-[#1a1a1a]">Role Reference</h2>
        </div>
        <div className="space-y-3">
          {ROLES.map(role => (
            <div key={role} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${role === 'super-admin' ? 'bg-[#c81c6a]/10 text-[#c81c6a]' : role === 'admin' ? 'bg-purple-100 text-purple-700' : role === 'content-manager' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{ROLE_DESCRIPTIONS[role]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav Map */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(to bottom, #c81c6a, #9a0c52)' }} />
          <h2 className="font-bold text-[#1a1a1a]">Access by Role</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 bg-gray-50 rounded-xl">
                <th className="text-left px-4 py-2 font-medium">Section</th>
                {ROLES.map(r => <th key={r} className="px-4 py-2 font-medium text-center capitalize">{r.replace('-', ' ')}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['Dashboard', true, true, true, true],
                ['Categories', true, true, true, false],
                ['Products', true, true, true, false],
                ['Inventory', true, true, false, true],
                ['Orders', true, true, false, true],
                ['Homepage CMS', true, true, true, false],
                ['Blog', true, true, true, false],
                ['Media', true, true, true, false],
                ['Enquiries', true, true, true, false],
                ['SEO', true, true, false, false],
                ['Settings', true, false, false, false],
                ['Users', true, false, false, false],
              ].map(([section, ...access]) => (
                <tr key={section as string} className="border-t border-gray-50">
                  <td className="px-4 py-2.5 font-medium text-[#1a1a1a]">{section}</td>
                  {access.map((has, i) => (
                    <td key={i} className="px-4 py-2.5 text-center">
                      {has ? <span className="text-green-500 text-base">✓</span> : <span className="text-gray-300 text-base">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
