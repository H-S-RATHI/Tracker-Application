import React, { useState, useEffect } from 'react';
import { apiRequest } from './api';

export default function ProjectDetail({ token, project, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  async function fetchTasks() {
    setIsLoading(true);
    try {
      const data = await apiRequest(`/tasks/${project._id}`, 'GET', null, token);
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    
    try {
      await apiRequest(`/tasks`, 'POST', { ...form, projectId: project._id }, token);
      setForm({ title: '', description: '', status: 'pending' });
      fetchTasks();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleUpdate(taskId, updates) {
    try {
      await apiRequest(`/tasks/${taskId}`, 'PUT', updates, token);
      fetchTasks();
      if (editingTask && editingTask._id === taskId) {
        setEditingTask(null);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiRequest(`/tasks/${taskId}`, 'DELETE', null, token);
        fetchTasks();
      } catch (e) {
        setError(e.message);
      }
    }
  }

  function startEditing(task) {
    setEditingTask({
      ...task,
      editTitle: task.title,
      editDescription: task.description,
      editStatus: task.status
    });
  }

  function cancelEditing() {
    setEditingTask(null);
  }

  function saveEditing() {
    if (!editingTask.editTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    
    handleUpdate(editingTask._id, {
      title: editingTask.editTitle,
      description: editingTask.editDescription,
      status: editingTask.editStatus
    });
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const taskStatusCounts = {
    total: tasks.length,
    pending: pendingTasks.length,
    inProgress: inProgressTasks.length,
    completed: completedTasks.length
  };

  return (
    <div className="project-detail-card">
      <div className="project-detail-header">
        <button onClick={onBack} className="pd-back-btn">← Back</button>
        <h2 className="pd-title">{project.name}</h2>
        <div className="pd-view-toggle">
          <button 
            onClick={() => setViewMode('table')} 
            className={`pd-view-btn ${viewMode === 'table' ? 'active' : ''}`}
          >
            📋 Table
          </button>
          <button 
            onClick={() => setViewMode('cards')} 
            className={`pd-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
          >
            📇 Cards
          </button>
        </div>
      </div>
      
      <div className="pd-stats-row">
        <div className="pd-stat-card">
          <div className="pd-stat-value">{taskStatusCounts.total}</div>
          <div className="pd-stat-label">Total Tasks</div>
        </div>
        <div className="pd-stat-card pd-stat-pending">
          <div className="pd-stat-value">{taskStatusCounts.pending}</div>
          <div className="pd-stat-label">Pending</div>
        </div>
        <div className="pd-stat-card pd-stat-progress">
          <div className="pd-stat-value">{taskStatusCounts.inProgress}</div>
          <div className="pd-stat-label">In Progress</div>
        </div>
        <div className="pd-stat-card pd-stat-completed">
          <div className="pd-stat-value">{taskStatusCounts.completed}</div>
          <div className="pd-stat-label">Completed</div>
        </div>
      </div>
      
      <form onSubmit={handleCreate} className="pd-task-form">
        <input 
          placeholder="Task Title" 
          value={form.title} 
          onChange={e => setForm({ ...form, title: e.target.value })} 
          required 
          className="pd-input" 
        />
        <input 
          placeholder="Description" 
          value={form.description} 
          onChange={e => setForm({ ...form, description: e.target.value })} 
          className="pd-input" 
        />
        <select 
          value={form.status} 
          onChange={e => setForm({ ...form, status: e.target.value })} 
          className="pd-select"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button type="submit" className="pd-add-btn">+ Add Task</button>
      </form>
      
      {error && <div className="error pd-error">{error}</div>}
      
      <div className="pd-tasks-section">
        <div className="pd-tasks-header-row">
          <h3 className="pd-tasks-header">Tasks ({tasks.length})</h3>
          {tasks.length > 0 && (
            <div className="pd-filter-controls">
              <select className="pd-filter-select">
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select className="pd-sort-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="pd-loading">
            <div className="pd-loading-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="pd-empty-state">
            <div className="pd-empty-icon">📝</div>
            <h4>No tasks yet</h4>
            <p>Add your first task to get started</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="pd-table-wrapper">
            <table className="pd-task-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Completed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    {editingTask && editingTask._id === task._id ? (
                      // Editing mode
                      <>
                        <td>
                          <input 
                            value={editingTask.editTitle}
                            onChange={e => setEditingTask({...editingTask, editTitle: e.target.value})}
                            className="pd-inline-input"
                          />
                        </td>
                        <td>
                          <input 
                            value={editingTask.editDescription}
                            onChange={e => setEditingTask({...editingTask, editDescription: e.target.value})}
                            className="pd-inline-input"
                          />
                        </td>
                        <td>
                          <select
                            value={editingTask.editStatus}
                            onChange={e => setEditingTask({...editingTask, editStatus: e.target.value})}
                            className="pd-inline-select"
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>{new Date(task.createdAt).toLocaleString()}</td>
                        <td>{task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}</td>
                        <td>
                          <button onClick={saveEditing} className="pd-action-btn">Save</button>
                          <button onClick={cancelEditing} className="pd-action-btn pd-delete-btn">Cancel</button>
                        </td>
                      </>
                    ) : (
                      // Display mode
                      <>
                        <td className="pd-td-title">{task.title}</td>
                        <td className="pd-td-desc">{task.description}</td>
                        <td>
                          <span className={`pd-status-badge pd-status-${task.status}`}>
                            {task.status.replace(/-/g, ' ')}
                          </span>
                        </td>
                        <td>{new Date(task.createdAt).toLocaleString()}</td>
                        <td>{task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}</td>
                        <td>
                          <button onClick={() => startEditing(task)} className="pd-action-btn">Edit</button>
                          <button 
                            onClick={() => handleUpdate(task._id, { 
                              status: task.status === 'completed' ? 'pending' : 'completed',
                              completedAt: task.status !== 'completed' ? new Date() : null
                            })} 
                            className="pd-action-btn pd-toggle-btn"
                          >
                            {task.status === 'completed' ? 'Undo' : 'Complete'}
                          </button>
                          <button onClick={() => handleDelete(task._id)} className="pd-action-btn pd-delete-btn">Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="pd-task-list">
            {tasks.map(task => (
              <li key={task._id} className="pd-task-card">
                <div className="pd-task-main">
                  <h4 className="pd-task-title">{task.title}</h4>
                  <span className={`pd-status-badge pd-status-${task.status}`}>
                    {task.status.replace(/-/g, ' ')}
                  </span>
                </div>
                <div className="pd-task-desc">{task.description || 'No description provided'}</div>
                <div className="pd-task-dates">
                  Created: {new Date(task.createdAt).toLocaleString()}
                  {task.completedAt && ` • Completed: ${new Date(task.completedAt).toLocaleString()}`}
                </div>
                <div className="pd-task-actions">
                  <button onClick={() => startEditing(task)} className="pd-action-btn">Edit</button>
                  <button 
                    onClick={() => handleUpdate(task._id, { 
                      status: task.status === 'completed' ? 'pending' : 'completed',
                      completedAt: task.status !== 'completed' ? new Date() : null
                    })} 
                    className="pd-action-btn pd-toggle-btn"
                  >
                    {task.status === 'completed' ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => handleDelete(task._id)} className="pd-action-btn pd-delete-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}