import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, User, Mail, Shield, 
  Check, Trash2, Edit3, Save, X, Plus, 
  AlertCircle, Sparkles, ClipboardList, Settings, UserCheck, AlertTriangle
} from 'lucide-react';
import AdminPanel from '../components/AdminPanel';

const Dashboard = () => {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  
  // Per-user persistence
  const storageKey = `todos-${user?.email || 'guest'}`;
  
  const [todos, setTodos] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  // Editing state for Todos
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  
  // Filter state
  const [filter, setFilter] = useState('All');

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileUpdating, setProfileUpdating] = useState(false);

  // Account Deletion state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Sync profile details if user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  // Load user-specific todos
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setTodos(JSON.parse(stored));
    } else {
      setTodos([]);
    }
  }, [storageKey]);

  // Persist user-specific todos
  const saveTodos = (newTodos) => {
    setTodos(newTodos);
    localStorage.setItem(storageKey, JSON.stringify(newTodos));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: taskText.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    saveTodos([newTodo, ...todos]);
    setTaskText('');
    setPriority('Medium');
  };

  const handleToggleComplete = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updated);
  };

  const handleDeleteTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    saveTodos(updated);
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setEditPriority(todo.priority);
  };

  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, text: editText.trim(), priority: editPriority } : todo
    );
    saveTodos(updated);
    setEditingId(null);
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444'
        };
      case 'Medium':
        return {
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#f59e0b'
        };
      case 'Less Important':
      default:
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981'
        };
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return todo.priority === filter;
  });

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    
    if (!profileName.trim() || !profileEmail.trim()) {
      setProfileError('Name and Email cannot be empty');
      return;
    }

    setProfileUpdating(true);
    try {
      await updateProfile(user.id, {
        name: profileName.trim(),
        email: profileEmail.trim()
      });
      setProfileSuccess('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.details || err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileUpdating(false);
    }
  };

  // Handle account self-deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (deleteConfirmText !== 'DELETE') {
      setDeleteError("Please type 'DELETE' to confirm account closure");
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount(user.id);
      // AuthContext will automatically reset the state and clear cookies/localStorage
    } catch (err) {
      setDeleteError(err.response?.data?.message || err.response?.data?.error || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.5rem', boxSizing: 'border-box' }}>
      
      {/* Top Header Row */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
            <ClipboardList size={32} color="#38bdf8" style={{ flexShrink: 0 }} />
            <div>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', margin: '0', fontWeight: '800', lineHeight: '1.2' }}>Workspace</h2>
              <p style={{ color: '#94a3b8', margin: '2px 0 0 0', fontSize: '0.8rem' }}>Welcome back, {user?.name || 'User'}!</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="btn-primary" 
            style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', padding: '0.5rem 1.25rem', borderRadius: '0.5rem' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Grid Content - Responsive & Auto-wrapping */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '2rem', textAlign: 'left' }}>
        
        {/* Left Side: Profile & Details / Deletion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* User Profile Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0', fontWeight: '700' }}>Your Profile</h3>
              
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0
                  }}
                >
                  <Settings size={14} />
                  Edit
                </button>
              )}
            </div>

            {profileSuccess && (
              <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserCheck size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}
            
            {isEditingProfile ? (
              /* PROFILE EDIT MODE */
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500' }}>Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="input-field"
                    style={{ padding: '0.6rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500' }}>Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="input-field"
                    style={{ padding: '0.6rem' }}
                    required
                  />
                </div>

                {profileError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0' }}>{profileError}</p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.50rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                    disabled={profileUpdating}
                  >
                    <Save size={14} />
                    {profileUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(false);
                      setProfileName(user?.name || '');
                      setProfileEmail(user?.email || '');
                      setProfileError('');
                    }}
                    style={{ flex: 1, padding: '0.50rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* PROFILE VIEW MODE */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', flexShrink: 0 }}>
                    <User size={20} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', margin: '0', fontSize: '0.75rem' }}>Full Name</p>
                    <p style={{ color: 'white', margin: '0', fontWeight: '600', fontSize: '0.95rem' }}>{user?.name}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', flexShrink: 0 }}>
                    <Mail size={20} color="#38bdf8" />
                  </div>
                  <div style={{ minWidth: '0', flex: 1 }}>
                    <p style={{ color: '#94a3b8', margin: '0', fontSize: '0.75rem' }}>Email Address</p>
                    <p style={{ color: 'white', margin: '0', fontWeight: '600', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '0.5rem', flexShrink: 0 }}>
                    <Shield size={20} color="#38bdf8" />
                  </div>
                  <div>
                    <p style={{ color: '#94a3b8', margin: '0', fontSize: '0.75rem' }}>Role</p>
                    <p style={{ color: 'white', margin: '0', fontWeight: '600', fontSize: '0.95rem' }}>{user?.role || 'User'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Deletion Panel */}
          <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#ef4444', fontSize: '1.2rem', marginTop: '0', marginBottom: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} />
              Danger Zone
            </h3>
            
            {isConfirmingDelete ? (
              /* DELETION CONFIRMATION DIALOG */
              <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: '#f87171', fontSize: '0.85rem', margin: '0', lineHeight: '1.4' }}>
                  Warning: Deleting your account will permanently wipe all your records and todo lists. This action is irreversible.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '500' }}>
                    Type <strong style={{ color: 'white' }}>DELETE</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="input-field"
                    style={{ padding: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    required
                  />
                </div>

                {deleteError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0' }}>{deleteError}</p>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 1, padding: '0.50rem', fontSize: '0.85rem', background: '#ef4444', border: '1px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={14} />
                    {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsConfirmingDelete(false);
                      setDeleteConfirmText('');
                      setDeleteError('');
                    }}
                    style={{ flex: 1, padding: '0.50rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* DEFAULT DELETE BTN VIEW */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0', lineHeight: '1.4' }}>
                  Need to close your account? Click below to start the permanent profile termination procedure.
                </p>
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="btn-primary"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '0.6rem 1rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                  Delete My Account
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '1rem', border: '1px dashed rgba(56, 189, 248, 0.2)', padding: '1.5rem', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: '600' }}>
              <Sparkles size={16} />
              <span>Status Active</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0' }}>Your JWT session is valid. Access is secured and rate-limited by Arcjet protection.</p>
          </div>
        </div>

        {/* Right Side: Todo List */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
            <h3 style={{ color: 'white', fontSize: '1.25rem', margin: '0', fontWeight: '700' }}>Task Planner</h3>
            
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', maxWidth: '100%' }}>
              {['All', 'Active', 'Completed', 'High', 'Medium', 'Less Important'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.35rem',
                    border: 'none',
                    cursor: 'pointer',
                    background: filter === tab ? 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)' : 'transparent',
                    color: filter === tab ? 'white' : '#94a3b8',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab === 'Less Important' ? 'Low' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="input-field"
              style={{ flex: 1, minWidth: '180px' }}
            />
            
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field"
              style={{ width: 'auto', minWidth: '140px', cursor: 'pointer', flexGrow: 1 }}
            >
              <option value="High">🔴 High Priority</option>
              <option value="Medium">🟡 Medium Priority</option>
              <option value="Less Important">🟢 Low Priority</option>
            </select>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.75rem 1.25rem', flexGrow: 1, justifyContent: 'center' }}
            >
              <Plus size={18} />
              Add
            </button>
          </form>

          {/* Todos List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {filteredTodos.map((todo) => {
              const isEditing = editingId === todo.id;
              
              return (
                <div
                  key={todo.id}
                  className="todo-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: todo.completed ? 'rgba(15, 23, 42, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    opacity: todo.completed ? 0.7 : 1,
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  {isEditing ? (
                    /* EDIT MODE */
                    <div style={{ display: 'flex', gap: '0.5rem', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input-field"
                        style={{ flex: 1, minWidth: '130px', padding: '0.5rem' }}
                      />
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="input-field"
                        style={{ width: 'auto', padding: '0.5rem', fontSize: '0.85rem' }}
                      >
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Less Important">🟢 Low</option>
                      </select>
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#22c55e', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    /* VIEW MODE */
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
                        <button
                          onClick={() => handleToggleComplete(todo.id)}
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: todo.completed ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.2)',
                            background: todo.completed ? '#10b981' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            color: 'white',
                            flexShrink: 0,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {todo.completed && <Check size={12} strokeWidth={3} />}
                        </button>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span
                            style={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? '#64748b' : 'white',
                              fontWeight: '500',
                              fontSize: '0.95rem',
                              wordBreak: 'break-word'
                            }}
                          >
                            {todo.text}
                          </span>
                          
                          {/* Priority Badge */}
                          <span
                            style={{
                              display: 'inline-block',
                              width: 'fit-content',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.025em',
                              ...getPriorityStyle(todo.priority)
                            }}
                          >
                            {todo.priority === 'Less Important' ? 'Low' : todo.priority}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditing(todo)}
                          className="action-hover"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#38bdf8'}
                          onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="action-hover"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                          onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {filteredTodos.length === 0 && (
              <div style={{ textAlign: 'center', color: '#64748b', padding: '3rem 1rem', background: 'rgba(15,23,42,0.2)', borderRadius: '0.75rem', border: '1px dashed rgba(255,255,255,0.05)' }}>
                <AlertCircle size={28} style={{ margin: '0 auto 0.75rem auto', color: '#475569' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>No tasks found in this category.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {user?.role === 'admin' && <AdminPanel />}
    </div>
  );
};

export default Dashboard;
