import axiosInstance from "../lib/axios";

// Create a session
export async function createSession(sessionData) {
    const response = await axiosInstance.post("/sessions", sessionData);
    return response.data;
}

// Get active sessions
export async function getActiveSessions() {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
}

// Search sessions with filters
export async function searchSessions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.status) params.append("status", filters.status);
    if (filters.page) params.append("page", filters.page);
    if (filters.limit) params.append("limit", filters.limit);

    const response = await axiosInstance.get(`/sessions/search?${params.toString()}`);
    return response.data;
}

// Get sessions created by current user
export async function getMySessions(status = "all") {
    const params = status !== "all" ? `?status=${status}` : "";
    const response = await axiosInstance.get(`/sessions/my-sessions${params}`);
    return response.data;
}

// Get recent sessions (completed, where user was host or participant)
export async function getMyRecentSessions() {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
}

// Get session by ID
export async function getSessionById(id) {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
}

// Update session problem (host only)
export async function updateSessionProblem(id, problem, difficulty) {
    const response = await axiosInstance.put(
        `/sessions/${id}/problem`,
        { problem, difficulty }
    );
    return response.data;
}

// Join a session with password
export async function joinSession(id, password) {
    const response = await axiosInstance.post(
        `/sessions/${id}/join`,
        { password }
    );
    return response.data;
}

// End a session
export async function endSession(id) {
    const response = await axiosInstance.post(
        `/sessions/${id}/end`,
        {}
    );
    return response.data;
}

// Delete a session
export async function deleteSession(id) {
    const response = await axiosInstance.delete(`/sessions/${id}`);
    return response.data;
}

// Update proctoring data
export async function updateProctoringData(id, proctoringData) {
    const response = await axiosInstance.post(
        `/sessions/${id}/proctoring`,
        proctoringData
    );
    return response.data;
}
