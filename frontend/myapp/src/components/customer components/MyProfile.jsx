import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import { getMyProfile, updateMyProfile } from "../../store/authSlice";

const MyProfile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user, loading } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    bio: "",
    organizationName: "",
    organizationWebsite: "",
    organizationDescription: "",
  });

  useEffect(() => {
    if (!user && !loading) {
      dispatch(getMyProfile());
    }
  }, [dispatch, user, loading]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        organizationName: user.organizationName || "",
        organizationWebsite: user.organizationWebsite || "",
        organizationDescription: user.organizationDescription || "",
      });
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (selectedFile) data.append("profileImage", selectedFile);

    const result = await dispatch(updateMyProfile(data));

    if (result.meta.requestStatus === "fulfilled") {
      setStatusMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setIsEditing(false);
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
    } else {
      setStatusMessage({ type: "error", text: "Failed to update profile." });
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-1 text-slate-100 min-h-screen">
      {statusMessage.text && (
        <div
          className={`fixed top-24 right-6 p-4 rounded-2xl border backdrop-blur-md z-50 transition-all shadow-2xl ${
            statusMessage.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-rose-500/20 border-rose-500/50 text-rose-400"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-3 right-6 flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl transition-all text-xs font-bold text-white"
        >
          {isEditing ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaEdit /> Edit Profile
            </>
          )}
        </button>

        <div className="relative group">
          <img
            src={
              previewImage ||
              user?.profileImage?.secure_url ||
              "/images/avatar.png"
            }
            alt="Profile"
            className="w-40 h-40 rounded-[2rem] object-cover border-4 border-slate-800 shadow-2xl transition-transform duration-500"
            name="profileImage"
          />
          {isEditing && (
            <div
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-black/60 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer opacity-100 transition-opacity border-2 border-dashed border-blue-400/50"
            >
              <FaCamera className="text-white text-3xl mb-2" />
              <span className="text-[10px] font-bold text-white tracking-tighter">
                Change Photo
              </span>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="text-center md:text-left flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-white/90 ml-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 p-3 rounded-2xl outline-none focus:border-blue-500 text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-white/90 ml-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 p-3 rounded-2xl outline-none focus:border-blue-500 h-24 text-sm text-white"
                />
              </div>
            </div>
          ) : (
            <div className="text-center md:text-left flex-1">
              <div className="mb-4">
                <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {user?.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                {user?.fullName ? (
                  <h1 className="text-3xl font-black tracking-tight text-white">
                    {user.fullName}
                  </h1>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-white/70">
                      Full Name
                    </span>
                    <span className="text-white/40 font-bold text-lg">---</span>
                  </div>
                )}
              </div>
              <p className="text-white/60 max-w-md text-sm leading-relaxed">
                {user?.bio || "Tell the community about yourself..."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 shadow-xl space-y-8">
          <h2 className="text-[12px] font-bold text-white tracking-wide">
            Identity
          </h2>
          <InfoItem icon={<FaUser />} label="Username" value={user?.username} />
          <InfoItem icon={<FaEnvelope />} label="Email" value={user?.email} />
          {isEditing ? (
            <EditableField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          ) : (
            <InfoItem
              icon={<FaPhone />}
              label="Phone"
              value={user?.phoneNumber || "Not Linked"}
            />
          )}
        </div>

        {user?.role === "eventorganizer" && (
          <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 shadow-xl space-y-8">
            <h2 className="text-[12px] font-bold text-white tracking-wide">
              Organization
            </h2>
            {isEditing ? (
              <div className="space-y-4">
                <EditableField
                  label="Company Name"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                />
                <EditableField
                  label="Website"
                  name="organizationWebsite"
                  value={formData.organizationWebsite}
                  onChange={handleChange}
                />
                <div>
                  <label className="text-[11px] font-semibold text-white/90 ml-1">
                    Company Description
                  </label>
                  <textarea
                    name="organizationDescription"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 p-3 rounded-2xl outline-none focus:border-blue-500 h-28 text-sm mt-1 text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <InfoItem
                  icon={<FaBuilding />}
                  label="Company"
                  value={user?.organizationName}
                />
                <InfoItem
                  icon={<FaGlobe />}
                  label="Website"
                  value={user?.organizationWebsite}
                />
                <div className="pt-4 border-t border-white/5">
                  <p className="text-[11px] font-semibold text-white/50 mb-2">
                    About
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {user?.organizationDescription || "No organization bio."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed bottom-15 right-10 z-40">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl border border-blue-500/50 shadow-lg transition-all font-bold tracking-wide text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaSave size={16} />
                <span>Update Profile</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-5">
    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-center text-blue-400 text-lg shadow-inner">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-medium text-white/50 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">{value || "---"}</p>
    </div>
  </div>
);

const EditableField = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-[11px] font-semibold text-white/90 ml-1">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-900/50 border border-slate-700 p-3 mt-1 rounded-2xl text-sm outline-none focus:border-blue-500 text-white transition-all shadow-inner"
    />
  </div>
);

export default MyProfile;
