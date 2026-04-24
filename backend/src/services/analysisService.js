/**
 * Analysis Service
 * Processes raw proctoring data and conversation into actionable insights.
 */

/**
 * Analyzes a completed AI interview and returns a structured report.
 * @param {Object} interview - The full AIInterview document
 * @returns {Object} Analysis result
 */
export function analyzeInterview(interview) {
  const conversation = interview.conversation || [];
  const violations = interview.proctoringData?.violations || [];
  const heatmapData = interview.proctoringData?.heatmapData || [];
  const lastStats = interview.proctoringData?.lastStats || {};

  // === Overall Score ===
  const aiTurnsWithScores = conversation
    .slice(1) // skip welcome message
    .filter((m) => m.role === "ai" && m.score != null);

  const overallScore =
    aiTurnsWithScores.length > 0
      ? parseFloat(
          (
            aiTurnsWithScores.reduce((acc, curr) => acc + (curr.score ?? 0), 0) /
            aiTurnsWithScores.length
          ).toFixed(1)
        )
      : 0;

  // === Violation Summary ===
  const tabSwitches = violations.filter(
    (v) => v.type === "tab_off" || v.type === "Tab Switched" || v.type === "Tab Switch"
  ).length;
  const faceNotDetected = violations.filter(
    (v) => v.type === "face_not_detected" || v.type === "Face Not Detected" || v.type === "Face Lost"
  ).length;
  const gazeOffScreen = violations.filter(
    (v) => v.type === "gaze_off_screen" || v.type === "Gaze Off Screen" || v.type === "Gaze Off"
  ).length;
  const copyPasteAttempts = violations.filter(
    (v) => v.type === "copy_paste" || v.type === "Copy/Paste" || v.type === "Copy/Paste Detected"
  ).length;

  const violationSummary = {
    tabSwitches,
    faceNotDetected,
    gazeOffScreen,
    copyPasteAttempts,
    total: violations.length,
  };

  // === Integrity Score ===
  // Each violation type has a weight
  const weightedPenalty =
    tabSwitches * 8 +
    faceNotDetected * 5 +
    gazeOffScreen * 3 +
    copyPasteAttempts * 15;

  const integrityScore = Math.max(0, Math.min(100, 100 - weightedPenalty));

  // === Risk Level ===
  let riskLevel = "Low";
  if (integrityScore < 50) riskLevel = "High";
  else if (integrityScore < 75) riskLevel = "Medium";

  // === Engagement Metrics ===
  const candidateTurns = conversation.filter((m) => m.role === "candidate");
  const questionsAnswered = candidateTurns.length;

  const timestamps = conversation
    .filter((m) => m.timestamp)
    .map((m) => new Date(m.timestamp).getTime())
    .sort((a, b) => a - b);

  const totalDurationMs =
    timestamps.length >= 2
      ? timestamps[timestamps.length - 1] - timestamps[0]
      : 0;
  const totalDurationMinutes = Math.round(totalDurationMs / (1000 * 60));

  const engagementMetrics = {
    questionsAnswered,
    totalDurationMinutes,
  };

  // === Heatmap Analysis ===
  let focusZones = "No data";
  if (heatmapData.length > 0) {
    const avgX =
      heatmapData.reduce((sum, p) => sum + p.x, 0) / heatmapData.length;
    const avgY =
      heatmapData.reduce((sum, p) => sum + p.y, 0) / heatmapData.length;

    // Determine general zone (assuming normalized 0–1920 x 0–1080)
    const normX = avgX / 1920;
    const normY = avgY / 1080;

    if (normX > 0.33 && normX < 0.66 && normY > 0.33 && normY < 0.66) {
      focusZones = "Mostly Center — Focused";
    } else if (normX < 0.33) {
      focusZones = "Left-leaning — Possible second screen";
    } else if (normX > 0.66) {
      focusZones = "Right-leaning — Possible second screen";
    } else {
      focusZones = "Scattered — Low focus";
    }
  }

  const heatmapAnalysis = {
    focusZones,
    dataPointCount: heatmapData.length,
  };

  return {
    overallScore,
    integrityScore,
    riskLevel,
    violationSummary,
    engagementMetrics,
    heatmapAnalysis,
  };
}

/**
 * Extracts Q&A pairs from the conversation for reporting.
 * @param {Array} conversation - The interview conversation array
 * @returns {Array} Array of { question, answer, score, feedback, idealAnswer }
 */
export function extractQAPairs(conversation) {
  const pairs = [];
  const convoSlice = conversation.slice(1); // skip welcome message

  for (let i = 0; i < convoSlice.length; i++) {
    if (convoSlice[i].role === "candidate") {
      const question = i > 0 ? convoSlice[i - 1]?.content : null;
      const evaluation =
        convoSlice[i + 1]?.role === "ai" ? convoSlice[i + 1] : null;

      pairs.push({
        question: question || "AI-Generated Question",
        answer: convoSlice[i].content,
        score: evaluation?.score ?? 0,
        feedback: evaluation?.feedback || "",
        idealAnswer: evaluation?.idealAnswer || "",
      });
    }
  }

  return pairs;
}

/**
 * Analyzes code submissions from a coding interview.
 * @param {Object} interview - The full AIInterview document
 * @returns {Object} Code analysis results
 */
export function analyzeCodeSubmissions(interview) {
  const submissions = interview.codeSubmissions || [];
  const questions = interview.codingQuestions || [];

  if (submissions.length === 0) {
    return {
      totalSubmissions: 0,
      averageCodeScore: 0,
      codeQAPairs: [],
      languagesUsed: [],
    };
  }

  // Average code score
  const scores = submissions
    .map((s) => s.aiReview?.score ?? 0)
    .filter((s) => s > 0);
  const averageCodeScore =
    scores.length > 0
      ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
      : 0;

  // Languages used
  const languagesUsed = [...new Set(submissions.map((s) => s.language))];

  // Build code Q&A pairs for email report
  const codeQAPairs = submissions.map((submission) => {
    const question = questions[submission.questionIndex];
    return {
      questionTitle: question?.title || `Question ${submission.questionIndex + 1}`,
      questionDescription: question?.description || "",
      difficulty: question?.difficulty || "Medium",
      topic: question?.topic || "General",
      language: submission.language,
      code: submission.code,
      correctness: submission.aiReview?.correctness || "",
      timeComplexity: submission.aiReview?.timeComplexity || "",
      spaceComplexity: submission.aiReview?.spaceComplexity || "",
      codeQuality: submission.aiReview?.codeQuality || "",
      suggestions: submission.aiReview?.suggestions || "",
      score: submission.aiReview?.score ?? 0,
    };
  });

  return {
    totalSubmissions: submissions.length,
    averageCodeScore,
    codeQAPairs,
    languagesUsed,
  };
}

