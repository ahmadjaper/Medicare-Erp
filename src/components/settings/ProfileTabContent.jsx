import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';

function ProfileTabContent() {
  const { userProfile, updateProfile } = useUser();

  // Profile Form State
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    email: userProfile.email,
    phone: userProfile.phone
  });
  
  const [avatarData, setAvatarData] = useState(userProfile.avatar);
  const fileInputRef = useRef(null);

  // Password State
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passFeedback, setPassFeedback] = useState(null);

  // Global State
  const [isDirty, setIsDirty] = useState(false);
  const [showSuccess, setShowSuccess] = useState('');

  // Check Dirty State
  useEffect(() => {
    const isProfileDirty = 
      formData.fullName !== userProfile.fullName ||
      formData.email !== userProfile.email ||
      formData.phone !== userProfile.phone ||
      avatarData !== userProfile.avatar;
      
    const isPassDirty = passData.currentPassword || passData.newPassword || passData.confirmPassword;
    
    setIsDirty(isProfileDirty || isPassDirty);
  }, [formData, avatarData, passData, userProfile]);

  // Hook into window close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle Profile Inputs
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Avatar Upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a JPG, PNG, or WEBP image.");
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Please upload an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarData(reader.result);
      setShowSuccess("Image uploaded successfully. Don't forget to save changes.");
      setTimeout(() => setShowSuccess(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Save Profile Changes
  const handleSaveProfile = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("All profile fields are required.");
      return;
    }

    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      avatar: avatarData
    });
    
    setIsDirty(false);
    setShowSuccess("Profile settings saved successfully!");
    setTimeout(() => setShowSuccess(''), 3000);
  };

  // Cancel Profile Changes
  const handleCancel = () => {
    setFormData({
      fullName: userProfile.fullName,
      email: userProfile.email,
      phone: userProfile.phone
    });
    setAvatarData(userProfile.avatar);
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPassFeedback(null);
  };

  // Update Password
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleUpdatePassword = () => {
    if (!passData.currentPassword) {
      setPassFeedback({ type: 'danger', text: "Please enter your current password." });
      return;
    }
    
    if (!validatePassword(passData.newPassword)) {
      setPassFeedback({ type: 'danger', text: "New password must be at least 8 characters and include uppercase, lowercase, number, and special character." });
      return;
    }
    
    if (passData.newPassword !== passData.confirmPassword) {
      setPassFeedback({ type: 'danger', text: "New passwords do not match." });
      return;
    }

    // Simulate backend password update
    setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPassFeedback({ type: 'success', text: "Password updated successfully!" });
    setTimeout(() => setPassFeedback(null), 3000);
  };

  return (
    <div className="profile-tab-wrapper">
      
      {showSuccess && (
        <div className="alert alert-success d-flex align-items-center shadow-sm border-0 rounded-3 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5 me-3"></i>
          <div>{showSuccess}</div>
        </div>
      )}

      <div className="row g-4">
        {/* Left Section: Profile Information */}
        <div className="col-12 col-lg-6">
          <div className="card border rounded-4 shadow-sm h-100" style={{borderColor: '#e2e8f0'}}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4" style={{color: '#1a1f36'}}>Profile Information</h5>
              
              <div className="d-flex justify-content-center mb-5">
                <div className="position-relative" style={{width: '120px', height: '120px'}}>
                  <img 
                    src={avatarData} 
                    alt="Profile Avatar" 
                    className="w-100 h-100 rounded-4 object-fit-cover shadow-sm border" 
                  />
                  <button 
                    className="btn btn-primary rounded-circle position-absolute d-flex align-items-center justify-content-center p-0 shadow"
                    style={{width: '32px', height: '32px', bottom: '-10px', right: '-10px'}}
                    onClick={() => fileInputRef.current.click()}
                    title="Change Profile Picture"
                  >
                    <i className="bi bi-camera-fill small"></i>
                  </button>
                  <input 
                    type="file" 
                    className="d-none" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/jpeg, image/png, image/webp" 
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleProfileChange} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control bg-light" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleProfileChange} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small fw-bold">Phone Number</label>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleProfileChange} 
                />
              </div>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">Department</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-secondary-subtle" 
                    value={userProfile.department} 
                    disabled 
                    readOnly
                    style={{backgroundColor: '#f8f9fa', borderStyle: 'dashed'}}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label text-muted small fw-bold">Job Title</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-secondary-subtle" 
                    value={userProfile.jobTitle} 
                    disabled 
                    readOnly
                    style={{backgroundColor: '#f8f9fa', borderStyle: 'dashed'}}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Section: Change Password */}
        <div className="col-12 col-lg-6">
          <div className="card border rounded-4 shadow-sm h-100" style={{borderColor: '#e2e8f0'}}>
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4" style={{color: '#1a1f36'}}>Change Password</h5>
              
              {passFeedback && (
                <div className={`alert alert-${passFeedback.type} py-2 small rounded-3`}>
                  {passFeedback.text}
                </div>
              )}

              <div className="mb-4 position-relative">
                <label className="form-label text-muted small fw-bold">Current Password</label>
                <div className="input-group">
                  <input 
                    type={showPass.current ? "text" : "password"} 
                    className="form-control bg-light border-end-0" 
                    placeholder="Enter current password"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                  />
                  <span 
                    className="input-group-text bg-light cursor-pointer text-muted" 
                    onClick={() => setShowPass({...showPass, current: !showPass.current})}
                    style={{cursor: 'pointer'}}
                  >
                    <i className={`bi bi-eye${showPass.current ? '-slash' : ''}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label text-muted small fw-bold">New Password</label>
                <div className="input-group">
                  <input 
                    type={showPass.new ? "text" : "password"} 
                    className="form-control bg-light border-end-0" 
                    placeholder="Enter new password"
                    value={passData.newPassword}
                    onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  />
                  <span 
                    className="input-group-text bg-light cursor-pointer text-muted" 
                    onClick={() => setShowPass({...showPass, new: !showPass.new})}
                    style={{cursor: 'pointer'}}
                  >
                    <i className={`bi bi-eye${showPass.new ? '-slash' : ''}`}></i>
                  </span>
                </div>
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label text-muted small fw-bold">Confirm New Password</label>
                <div className="input-group">
                  <input 
                    type={showPass.confirm ? "text" : "password"} 
                    className="form-control bg-light border-end-0" 
                    placeholder="Confirm new password"
                    value={passData.confirmPassword}
                    onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                  />
                  <span 
                    className="input-group-text bg-light cursor-pointer text-muted" 
                    onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                    style={{cursor: 'pointer'}}
                  >
                    <i className={`bi bi-eye${showPass.confirm ? '-slash' : ''}`}></i>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <button 
                  className="btn btn-primary fw-semibold px-4 rounded-3"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="border-top mt-5 pt-4 d-flex justify-content-end gap-3 pb-4">
        <button 
          className="btn btn-white border fw-semibold px-4 rounded-3" 
          onClick={handleCancel}
          disabled={!isDirty}
        >
          Cancel
        </button>
        <button 
          className="btn btn-primary fw-semibold px-4 rounded-3" 
          onClick={handleSaveProfile}
          disabled={!isDirty}
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}

export default ProfileTabContent;
