import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloudIcon,
  FileTextIcon,
  XIcon,
  ArrowRightIcon,
  LoaderIcon,
  CheckCircle2Icon,
  UserIcon,
  MailIcon,
  AlertCircleIcon,
  BrainCircuitIcon,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const ResumeUploadPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const session = JSON.parse(localStorage.getItem("candidateSession") || "{}");
  const token = localStorage.getItem("candidateToken");

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.type === "application/msword" ||
        droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Only PDF and DOC/DOCX files are allowed");
      }
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(`${API_URL}/candidate/upload-resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setResumeData(res.data);
      setUploaded(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleStartInterview = async () => {
    if (!candidateName.trim()) {
      setError("Please enter your name");
      return;
    }

    setStarting(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/candidate/start-interview`,
        {
          candidateName: candidateName.trim(),
          candidateEmail: candidateEmail.trim(),
          resumeUrl: resumeData?.resumeUrl || "",
          resumeText: resumeData?.resumeText || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store new token with interview ID
      localStorage.setItem("candidateToken", res.data.token);

      // Navigate based on interview type
      const interviewData = res.data.interview;
      if (interviewData.interviewType === "coding") {
        navigate(`/ai-coding-interview/${interviewData._id}`);
      } else {
        navigate(`/ai-interview/${interviewData._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview");
    } finally {
      setStarting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <BrainCircuitIcon className="size-6 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">Talent IQ</h1>
        </motion.div>

        {/* Session Info */}
        {session?.sessionName && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
            <p className="text-gray-400 text-sm">Joining session</p>
            <h2 className="text-xl font-bold text-white">{session.sessionName}</h2>
          </motion.div>
        )}

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-lg"
        >
          <div className="backdrop-blur-2xl bg-white/[0.04] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Your Name *</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email (Optional)</label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Resume Upload */}
            {session?.resumeRequired !== false && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
                  Resume Upload {session?.resumeRequired ? "*" : "(Optional)"}
                </label>

                {!uploaded ? (
                  <>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                        dragActive
                          ? "border-blue-500 bg-blue-500/10"
                          : file
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                      }`}
                      onClick={() => document.getElementById("resume-input").click()}
                    >
                      <input
                        id="resume-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      {file ? (
                        <div className="flex items-center justify-center gap-3">
                          <FileTextIcon className="size-8 text-green-400" />
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="p-1 hover:bg-white/10 rounded-lg ml-2"
                          >
                            <XIcon className="size-4 text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <UploadCloudIcon className="size-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-300 text-sm font-medium">Drag & drop your resume</p>
                          <p className="text-gray-600 text-xs mt-1">or click to browse • PDF, DOC, DOCX</p>
                        </div>
                      )}
                    </div>

                    {file && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={handleUpload}
                        disabled={uploading}
                        className="mt-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        {uploading ? (
                          <LoaderIcon className="size-4 animate-spin" />
                        ) : (
                          <>
                            <UploadCloudIcon className="size-4" />
                            Upload Resume
                          </>
                        )}
                      </motion.button>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
                  >
                    <CheckCircle2Icon className="size-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-medium text-sm">Resume uploaded successfully</p>
                      <p className="text-gray-500 text-xs">{resumeData?.filename}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                >
                  <AlertCircleIcon className="size-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start Interview */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartInterview}
              disabled={starting || !candidateName.trim() || (session?.resumeRequired && !uploaded)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {starting ? (
                <LoaderIcon className="size-5 animate-spin" />
              ) : (
                <>
                  Start Interview
                  <ArrowRightIcon className="size-5" />
                </>
              )}
            </motion.button>

            {/* Info */}
            <div className="text-center text-gray-600 text-xs space-y-1">
              <p>🎥 Webcam & microphone will be required</p>
              <p>👁️ Eye tracking calibration will start before the interview</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeUploadPage;
