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

  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
    organizationWebsite: "",
  });

  useEffect(() => {
    if (!user && !loading) dispatch(getMyProfile());
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
      setErrors({
        fullName: "",
        phoneNumber: "",
        organizationWebsite: "",
      });
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "fullName") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "Full name must contain only letters";
      }
    }

    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;

      if (!value) error = "Phone number is required";
      else if (value.length < 10)
        error = "Phone number must be exactly 10 digits";
    }

    if (name === "organizationWebsite") {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)?$/;

      if (value && !urlRegex.test(value)) {
        error = "Enter a valid website URL (e.g. https://example.com)";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async () => {
    if (hasErrors) {
      setStatusMessage({
        type: "error",
        text: "Please fix validation errors first.",
      });
      return;
    }

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
          className={`fixed top-24 right-6 p-4 rounded-2xl border backdrop-blur-md z-50 shadow-2xl ${
            statusMessage.type === "success"
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "bg-rose-500/20 border-rose-500/50 text-rose-400"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md relative">
        <button
          onClick={() => setIsEditing(!isEditing)}
          disabled={hasErrors}
          className={`absolute top-3 right-6 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${
            hasErrors
              ? "bg-slate-700 opacity-50 cursor-not-allowed"
              : "bg-slate-800 hover:bg-slate-700"
          }`}
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

        <div className="relative">
          <img
            src={
              previewImage ||
              user?.profileImage?.secure_url ||
              "/images/avatar.png"
            }
            alt="Profile"
            className="w-40 h-40 rounded-[2rem] object-cover border-4 border-slate-800 shadow-2xl"
          />
          {isEditing && (
            <div
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 bg-black/60 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-400/50"
            >
              <FaCamera className="text-white text-3xl mb-2" />
              <span className="text-[10px] font-bold text-white">
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

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-4">
              <EditableField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <div>
                <label className="text-[11px] font-semibold ml-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 p-3 rounded-2xl h-24 text-sm"
                />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-black">{user?.fullName}</h1>
              <p className="text-white/60 mt-2 text-sm">
                {user?.bio || "Tell the community about yourself..."}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 space-y-8">
          <InfoItem icon={<FaUser />} label="Username" value={user?.username} />
          <InfoItem icon={<FaEnvelope />} label="Email" value={user?.email} />

          {isEditing ? (
            <EditableField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
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
          <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 space-y-8">
            <h2 className="text-[12px] font-bold tracking-wide">
              Organization
            </h2>

            {isEditing ? (
              <>
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
                  error={errors.organizationWebsite}
                />

                <div>
                  <label className="text-[11px] font-semibold ml-1">
                    Company Description
                  </label>
                  <textarea
                    name="organizationDescription"
                    value={formData.organizationDescription}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 p-3 rounded-2xl h-28 text-sm"
                  />
                </div>
              </>
            ) : (
              <>
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
                  <p className="text-sm text-white/70">
                    {user?.organizationDescription || "No organization bio."}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed bottom-15 right-10 z-40">
          <button
            onClick={handleSave}
            disabled={loading || hasErrors}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold disabled:opacity-50"
          >
            <FaSave /> Update Profile
          </button>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-5">
    <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-[11px] text-white/50">{label}</p>
      <p className="text-sm text-white">{value || "---"}</p>
    </div>
  </div>
);

const EditableField = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="text-[11px] font-semibold ml-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full bg-slate-900/50 border p-3 rounded-2xl ${
        error ? "border-rose-500" : "border-slate-700 focus:border-blue-500"
      }`}
    />
    {error && <p className="text-[11px] text-rose-400 mt-1 ml-1">{error}</p>}
  </div>
);

export default MyProfile;
