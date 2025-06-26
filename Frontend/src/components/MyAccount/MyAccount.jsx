import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from '../../services/authService';
import Nav from '../HomePage/Navbar';
import Footer from '../HomePage/Footer';
import '../../styles/MyAccount.css';

const MyAccount = (props) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', userName: '', email: '', phone: '', address: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = AuthService.getCurrentUser();
        if (!current || !current.user || !current.user.id) {
          setUser(null);
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/v1/user/${current.user.id}`);
        setUser(res.data);
        setForm({ ...res.data, password: '' });
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(true);
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({ ...user, password: '' });
    setMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const current = AuthService.getCurrentUser();
      const res = await axios.put(`http://localhost:5000/api/v1/user/${current.user.id}`, form);
      setUser(res.data.user);
      setEditMode(false);
      setMessage('Details updated successfully!');
    } catch (err) {
      setMessage('Failed to update details.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found or not logged in.</div>;

  return (
    <>
      <Nav setLogin={props.setLogin}></Nav>
      <div className='emptySpace'></div>
      <div className="my-account-container">
        <h2>My Account</h2>
        {message && <div className="message">{message}</div>}
        <form className="account-form" onSubmit={handleSave}>
          <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} disabled={!editMode} required />
          </label>
          <label>
            Username:
            <input name="userName" value={form.userName} onChange={handleChange} disabled={!editMode} />
          </label>
          <label>
            Email:
            <input name="email" value={form.email} onChange={handleChange} disabled={!editMode} required />
          </label>
          <label>
            Phone:
            <input name="phone" value={form.phone || ''} onChange={handleChange} disabled={!editMode} />
          </label>
          <label>
            Address:
            <input name="address" value={form.address || ''} onChange={handleChange} disabled={!editMode} />
          </label>
          <label>
            Password:
            <input name="password" value={form.password} onChange={handleChange} disabled={!editMode} type="password" placeholder="Leave blank to keep unchanged" />
          </label>
          <div className="account-actions">
            {!editMode ? (
              <button type="button" onClick={handleEdit}>Edit</button>
            ) : (
              <>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
              </>
            )}
          </div>
        </form>
      </div>
      <Footer></Footer>

    </>

  );
};

export default MyAccount; 