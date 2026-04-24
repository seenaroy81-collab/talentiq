import { useState } from "react";
import {
  Code2Icon,
  LoaderIcon,
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  ClockIcon,
  AlertCircleIcon,
  LayoutIcon,
  SparklesIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!isOpen) return null;

  const validatePassword = () => {
    if (!roomConfig.password) {
      setPasswordError("Password is required");
      return false;
    }
    if (roomConfig.password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return false;
    }
    if (roomConfig.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleCreate = () => {
    if (validatePassword()) {
      onCreateRoom();
    }
  };

  const handleClose = () => {
    setConfirmPassword("");
    setPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-base-300/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-base-100 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
      >
        {/* HEADER */}
        <div className="p-6 border-b border-base-200 bg-base-100/50 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <PlusIcon className="size-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-2xl">New Session</h3>
              <p className="text-sm opacity-60">Setup your coding environment</p>
            </div>
          </div>

          <button onClick={handleClose} className="btn btn-ghost btn-circle btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Section 1: Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <LayoutIcon className="size-4" />
                <span>Session Details</span>
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">Session Name</label>
                <input
                  type="text"
                  className="input input-lg input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors rounded-xl text-base"
                  placeholder="e.g. React Technical Interview"
                  value={roomConfig.sessionName || ""}
                  onChange={(e) => setRoomConfig({ ...roomConfig, sessionName: e.target.value })}
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">Description (Optional)</label>
                <textarea
                  className="textarea textarea-bordered w-full bg-base-200/50 focus:bg-base-100 rounded-xl h-24"
                  placeholder="Add context..."
                  value={roomConfig.description || ""}
                  onChange={(e) => setRoomConfig({ ...roomConfig, description: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-secondary font-semibold mb-2">
                <ClockIcon className="size-4" />
                <span>Configuration</span>
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setRoomConfig({ ...roomConfig, maxDuration: mins })}
                      className={`btn btn-sm h-10 ${roomConfig.maxDuration === mins
                          ? 'btn-secondary text-white shadow-lg shadow-secondary/20'
                          : 'btn-ghost bg-base-200/50'
                        }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-base-200/50 rounded-xl border border-base-content/5 mt-4">
                <div className="flex items-start gap-3">
                  <SparklesIcon className="size-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Pro Tip</h4>
                    <p className="text-xs opacity-70 mt-1">
                      Consider shorter sessions for initial screenings (30-60m) and longer ones for deep-dives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Section 2: Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent font-semibold">
              <LockIcon className="size-4" />
              <span>Security Access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-12 bg-base-200/50 focus:bg-base-100 rounded-xl"
                    placeholder="Minimum 4 chars"
                    value={roomConfig.password || ""}
                    onChange={(e) => {
                      setRoomConfig({ ...roomConfig, password: e.target.value });
                      setPasswordError("");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-12 bg-base-200/50 focus:bg-base-100 rounded-xl"
                    placeholder="Re-enter to confirm"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError("");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>
            </div>

            {passwordError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="alert alert-warning shadow-sm py-2"
              >
                <AlertCircleIcon className="size-4" />
                <span className="text-sm">{passwordError}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-base-200 bg-base-100/50 backdrop-blur-xl flex justify-end gap-3">
          <button className="btn btn-ghost" onClick={handleClose} disabled={isCreating}>
            Cancel
          </button>
          <button
            className="btn btn-primary px-8 rounded-xl shadow-lg shadow-primary/25"
            onClick={handleCreate}
            disabled={
              isCreating ||
              !roomConfig.sessionName ||
              !roomConfig.password ||
              !confirmPassword
            }
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <>
                <PlusIcon className="size-5" />
                Create Session
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
export default CreateSessionModal;

