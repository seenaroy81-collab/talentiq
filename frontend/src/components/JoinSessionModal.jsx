import { useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderIcon, LockIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function JoinSessionModal({ session, isOpen, onClose, onJoin, isJoining, error }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen || !session) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            onJoin(password);
        }
    };

    const handleClose = () => {
        setPassword("");
        setShowPassword(false);
        onClose();
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <h3 className="font-bold text-2xl mb-4 flex items-center gap-2">
                    <LockIcon className="size-6 text-primary" />
                    Join Session
                </h3>

                {/* Session Details */}
                <div className="bg-base-200 rounded-lg p-4 mb-6 space-y-2">
                    <div>
                        <p className="text-sm opacity-70">Session Name</p>
                        <p className="font-semibold text-lg">{session.sessionName}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-70">Problem</p>
                        <p className="font-medium">{session.problem}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm opacity-70">Difficulty:</p>
                        <span className={`badge badge-sm ${getDifficultyBadgeClass(session.difficulty)}`}>
                            {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm opacity-70">Host</p>
                        <p className="font-medium">{session.host?.name || "Unknown"}</p>
                    </div>
                </div>

                {/* Password Input Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">Enter Password</span>
                            <span className="label-text-alt text-error">*</span>
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={`input input-bordered w-full pr-12 ${error ? "input-error" : ""}`}
                                placeholder="Enter session password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isJoining}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="size-4 opacity-70" />
                                ) : (
                                    <EyeIcon className="size-4 opacity-70" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleClose}
                            disabled={isJoining}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary gap-2"
                            disabled={isJoining || !password.trim()}
                        >
                            {isJoining ? (
                                <>
                                    <LoaderIcon className="size-5 animate-spin" />
                                    Joining...
                                </>
                            ) : (
                                <>
                                    <LockIcon className="size-5" />
                                    Join Session
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}

export default JoinSessionModal;
