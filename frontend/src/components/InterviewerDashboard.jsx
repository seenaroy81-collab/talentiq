import { useState, useEffect } from "react";
import {
    Trash2Icon,
    LoaderIcon,
    ExternalLinkIcon,
    ClockIcon,
    CheckCircleIcon,
    SearchIcon,
    ArrowUpRightIcon,
    LayoutGridIcon,
    CodeIcon,
    BotIcon
} from "lucide-react";
import { getMySessions, deleteSession } from "../api/sessionAPI";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

function InterviewerDashboard() {
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); 
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, session: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMySessions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [sessions, activeTab, searchQuery]);

    const fetchMySessions = async () => {
        try {
            setIsLoading(true);
            const data = await getMySessions("all");
            setSessions(data.sessions || []);
        } catch (error) {
            console.error("Error fetching my sessions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = sessions.filter(s => s.isAI === true);

        if (activeTab !== "all") {
            filtered = filtered.filter((s) => s.status === activeTab);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.sessionName?.toLowerCase().includes(query) ||
                    s.difficulty?.toLowerCase().includes(query)
            );
        }

        setFilteredSessions(filtered);
    };

    const handleDelete = async () => {
        if (!deleteModal.session) return;

        try {
            setIsDeleting(true);
            await deleteSession(deleteModal.session._id);
            setSessions(sessions.filter((s) => s._id !== deleteModal.session._id));
            setDeleteModal({ isOpen: false, session: null });
        } catch (error) {
            console.error("Error deleting session:", error);
            alert(error.response?.data?.message || "Failed to delete session");
        } finally {
            setIsDeleting(false);
        }
    };

    const stats = {
        total: sessions.filter(s => s.isAI).length,
        active: sessions.filter((s) => s.isAI && s.status === "active").length,
        completed: sessions.filter((s) => s.isAI && s.status === "completed").length,
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <LayoutGridIcon className="size-4" />
                        <span>AI Recruitment</span>
                    </div>
                    <h2 className="text-4xl font-black">Candidate Pipeline</h2>
                    <p className="text-base-content/60 mt-2 font-medium">Track and review automated interview reports.</p>
                </div>

                <div className="flex items-center gap-3">
                     <div className="px-5 py-2.5 bg-base-200/50 rounded-2xl border border-base-content/5">
                        <span className="text-xs uppercase opacity-50 font-bold block">Success Rate</span>
                        <span className="font-black text-xl">
                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                        </span>
                     </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-base-200/30 p-2 rounded-2xl border border-base-content/5">
                <div className="tabs tabs-boxed bg-transparent gap-1">
                    {["all", "active", "completed"].map((tab) => (
                        <button
                            key={tab}
                            className={`tab tab-sm h-10 px-6 rounded-xl transition-all font-bold capitalize ${activeTab === tab ? "bg-white text-primary shadow-md" : "opacity-60 hover:opacity-100"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-80 px-2">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                    <input
                        type="text"
                        placeholder="Search candidates or roles..."
                        className="input input-ghost w-full pl-10 h-10 bg-base-100/50 border-none focus:outline-none rounded-xl font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <LoaderIcon className="size-10 animate-spin text-primary" />
                    <span className="text-sm font-bold opacity-40 uppercase tracking-widest">Loading Records...</span>
                </div>
            ) : filteredSessions.length > 0 ? (
                <div className="overflow-hidden bg-white/5 rounded-3xl border border-white/10">
                    <table className="table w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-base-200/50">
                                <th className="py-5 px-6 font-bold uppercase text-xs opacity-50">Interview Details</th>
                                <th className="py-5 font-bold uppercase text-xs opacity-50">Complexity</th>
                                <th className="py-5 font-bold uppercase text-xs opacity-50">Mode</th>
                                <th className="py-5 font-bold uppercase text-xs opacity-50">Current Status</th>
                                <th className="py-5 font-bold uppercase text-xs opacity-50 text-right pr-10">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredSessions.map((session, index) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={session._id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="py-6 px-6">
                                        <div>
                                            <div className="font-black text-lg group-hover:text-primary transition-colors">{session.sessionName}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <ClockIcon className="size-3 opacity-40" />
                                                <span className="text-xs font-bold opacity-40 uppercase tracking-tight">{formatDate(session.createdAt)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm rounded-lg font-bold px-3 capitalize ${getDifficultyBadgeClass(session.difficulty)}`}>
                                            {session.difficulty}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            {session.interviewType === 'coding' ? (
                                                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                                    <CodeIcon className="size-3.5" />
                                                    <span>Coding</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider">
                                                    <BotIcon className="size-3.5" />
                                                    <span>Q&A</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {session.status === "active" ? (
                                            <div className="flex items-center gap-2 text-warning font-bold text-sm">
                                                <div className="size-2 rounded-full bg-warning animate-pulse" />
                                                <span>Awaiting Candidate</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-info font-bold text-sm">
                                                <CheckCircleIcon className="size-4" />
                                                <span>Report Generated</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="text-right pr-6">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                                                onClick={() => navigate(`/ai-interview/${session._id}/review`)}
                                            >
                                                Review Report
                                                <ArrowUpRightIcon className="size-4" />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm btn-square rounded-xl text-error/60 hover:text-error"
                                                onClick={() => setDeleteModal({ isOpen: false, session: session })}
                                                onMouseDown={() => setDeleteModal({ isOpen: true, session: session })}
                                            >
                                                <Trash2Icon className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-24 bg-base-200/20 rounded-3xl border-2 border-dashed border-base-content/5">
                    <div className="bg-base-100 size-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <SearchIcon className="size-8 opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold">No Records Found</h3>
                    <p className="text-base-content/50 mt-2 max-w-xs mx-auto text-sm font-medium">
                        {searchQuery 
                            ? "Try adjusting your search query or filters." 
                            : "Start by creating your first AI interview screening."}
                    </p>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box backdrop-blur-3xl bg-base-100/90 border border-white/10 rounded-3xl shadow-2xl p-8">
                        <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mb-6">
                            <Trash2Icon className="size-8 text-error" />
                        </div>
                        <h3 className="text-3xl font-black mb-2">Delete Record?</h3>
                        <p className="text-base-content/60 font-medium mb-8">
                            Are you sure you want to permanently remove "<strong>{deleteModal.session?.sessionName}</strong>"? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                className="btn btn-ghost flex-1 rounded-2xl font-bold h-14"
                                onClick={() => setDeleteModal({ isOpen: false, session: null })}
                                disabled={isDeleting}
                            >
                                Nevermind
                            </button>
                            <button
                                className="btn btn-error flex-1 rounded-2xl font-bold h-14 text-white shadow-xl shadow-error/20"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? <LoaderIcon className="animate-spin" /> : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModal({ isOpen: false, session: null })}></div>
                </div>
            )}
        </div>
    );
}

export default InterviewerDashboard;
