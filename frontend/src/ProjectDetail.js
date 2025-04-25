import React, { useState, useEffect } from 'react';
import { apiRequest } from './api';

export default function ProjectDetail({ token, project, onBack }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  async function fetchTasks() {
    try {
      const data = await apiRequest(`/tasks/${project._id}`, 'GET', null, token);
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
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
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(taskId) {
    try {
      await apiRequest(`/tasks/${taskId}`, 'DELETE', null, token);
      fetchTasks();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="container">
      <button onClick={onBack} className="button">Back to Projects</button>
      <h2>Project: {project.name}</h2>
      <form onSubmit={handleCreate} className="form">
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="input" />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="select">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="button">Add Task</button>
      </form>
      {error && <div className="error">{error}</div>}
      <ul className="list">
        {tasks.map(task => (
          <li key={task._id}>
            <b>{task.title}</b> - {task.description} (<span>{task.status}</span>)<br />
            <span>Created: {new Date(task.createdAt).toLocaleString()}</span><br />
            {task.completedAt && <span>Completed: {new Date(task.completedAt).toLocaleString()}</span>}<br />
            <button onClick={() => handleUpdate(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })} className="button">
              Mark as {task.status === 'completed' ? 'Pending' : 'Completed'}
            </button>
            <button onClick={() => handleDelete(task._id)} className="button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
