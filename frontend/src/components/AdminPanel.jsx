import React, { useState, useEffect } from 'react';
import { Users, Trash2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter((u) => u.id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  if (loading) return <div style={{ color: '#94a3b8' }}>Loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Users size={24} color="#38bdf8" />
        <h3 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>Admin Panel - User Management</h3>
      </div>
      
      <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>Name</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500' }}>Role</th>
              <th style={{ padding: '1rem', color: '#94a3b8', fontWeight: '500', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '1rem', color: 'white' }}>{u.name}</td>
                <td style={{ padding: '1rem', color: '#cbd5e1' }}>{u.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    background: u.role === 'admin' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(148, 163, 184, 0.1)',
                    color: u.role === 'admin' ? '#38bdf8' : '#94a3b8',
                    border: `1px solid ${u.role === 'admin' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(148, 163, 184, 0.2)'}`
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={u.id === currentUser.id}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: u.id === currentUser.id ? '#475569' : '#ef4444',
                      cursor: u.id === currentUser.id ? 'not-allowed' : 'pointer',
                      padding: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '0.5rem',
                      transition: 'background 0.2s',
                    }}
                    title={u.id === currentUser.id ? "Cannot delete yourself" : "Delete user"}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
