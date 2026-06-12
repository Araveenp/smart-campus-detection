import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiBookOpen, FiHash, FiSave, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/profile.css';

export default function Profile() {
  const { user, updateProfile, t, changeLanguage } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || ''
  });

  const handleSave = () => {
    updateProfile(formData);
    setEditing(false);
    toast.success(`${t('prof_save')} successful!`);
  };

  return (
    <div className="profile-page">
      <motion.div 
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user?.name}</h1>
            <span className={`role-badge ${user?.role}`}>
              <FiShield /> {user?.role === 'admin' ? t('prof_administrator') : user?.role === 'staff' ? t('prof_staff') : t('prof_student')}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <FiMail />
            <div>
              <label>{t('prof_email')}</label>
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="detail-row">
            <FiUser />
            <div>
              <label>{t('prof_fullname')}</label>
              {editing ? (
                <input value={formData.name} onChange={(e) => setFormData(p => ({...p, name: e.target.value}))} className="w-full bg-[#16171a] border border-white/[0.08] text-white rounded-lg px-3 py-1 outline-none mt-1" />
              ) : (
                <span>{user?.name}</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <FiBookOpen />
            <div>
              <label>{t('prof_dept')}</label>
              {editing ? (
                <input value={formData.department} onChange={(e) => setFormData(p => ({...p, department: e.target.value}))} className="w-full bg-[#16171a] border border-white/[0.08] text-white rounded-lg px-3 py-1 outline-none mt-1" />
              ) : (
                <span>{user?.department || t('prof_not_set')}</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <FiHash />
            <div>
              <label>{t('prof_id')}</label>
              <span>{user?.studentId || t('prof_not_set')}</span>
            </div>
          </div>

          <div className="detail-row">
            <FiPhone />
            <div>
              <label>{t('prof_phone')}</label>
              {editing ? (
                <input value={formData.phone} onChange={(e) => setFormData(p => ({...p, phone: e.target.value}))} className="w-full bg-[#16171a] border border-white/[0.08] text-white rounded-lg px-3 py-1 outline-none mt-1" />
              ) : (
                <span>{user?.phone || t('prof_not_set')}</span>
              )}
            </div>
          </div>

          <div className="detail-row">
            <FiBookOpen />
            <div>
              <label>{t('prof_since')}</label>
              <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Language Preference Settings Switcher */}
          <div className="detail-row">
            <span className="material-symbols-outlined text-[20px] text-custom-text-muted" style={{ marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>translate</span>
            <div style={{ flex: 1 }}>
              <label>{t('prof_lang_label')}</label>
              <div className="relative mt-1">
                <select
                  value={user?.languagePreference || 'en-IN'}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="w-full bg-[#16171a] border border-white/[0.08] focus:border-primary text-white rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer"
                  style={{ background: '#16171a', border: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '2.5rem' }}
                >
                  <option value="en-IN" className="bg-[#101112]">English</option>
                  <option value="te-IN" className="bg-[#101112]">తెలుగు (Telugu)</option>
                  <option value="hi-IN" className="bg-[#101112]">हिन्दी (Hindi)</option>
                  <option value="ta-IN" className="bg-[#101112]">தமிழ் (Tamil)</option>
                  <option value="kn-IN" className="bg-[#101112]">ಕನ್ನಡ (Kannada)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-custom-text-muted pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button className="btn-save" onClick={handleSave}><FiSave /> {t('prof_save')}</button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>{t('prof_cancel')}</button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setEditing(true)}>{t('prof_edit')}</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
