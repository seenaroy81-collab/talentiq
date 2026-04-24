import AIInterview from "../models/AIInterview.js";
import User from "../models/User.js";
import { analyzeInterview, extractQAPairs, analyzeCodeSubmissions } from "./analysisService.js";
import { sendInterviewReport } from "./emailService.js";
import { ENV } from "../lib/env.js";

/**
 * Shared logic to analyze an interview and send the email report.
 * Called by both Inngest (production) and the Controller (dev fallback).
 */
export async function processInterviewAndSendReport(interviewId) {
  try {
    // 1. Fetch interview with session data
    const interview = await AIInterview.findById(interviewId).populate("sessionId");

    if (!interview) {
      console.error(`Interview not found: ${interviewId}`);
      return { success: false, error: "Interview not found" };
    }

    // 2. Run analysis
    const analysis = analyzeInterview(interview);
    const qaPairs = extractQAPairs(interview.conversation);

    // 3. Code analysis (for coding interviews)
    let codeAnalysis = { codeQAPairs: [] };
    if (interview.interviewType === "coding") {
      codeAnalysis = analyzeCodeSubmissions(interview);
      console.log(`💻 Code Analysis: ${codeAnalysis.totalSubmissions} submissions, avg score: ${codeAnalysis.averageCodeScore}`);
    }

    console.log(`📊 Analysis complete for ${interview.candidateName}: Score ${analysis.overallScore}/10`);

    // 4. Determine interviewer email
    const session = interview.sessionId;
    let interviewerEmail = session?.interviewerEmail;

    // If no email on session, try to find the host user's email
    if (!interviewerEmail && session?.host) {
      const hostUser = await User.findById(session.host);
      interviewerEmail = hostUser?.email;
    }

    if (!interviewerEmail) {
      console.warn("⚠️ No interviewer email found — skipping email report");
      return { success: false, error: "No interviewer email" };
    }

    // 5. Build resume URL
    let resumeUrl = interview.resumeUrl;
    if (resumeUrl && !resumeUrl.startsWith("http")) {
      // Use ENV.API_BASE_URL from our env loader
      resumeUrl = `${ENV.API_BASE_URL}${resumeUrl}`;
    }

    // 6. Send email
    const emailResult = await sendInterviewReport({
      to: interviewerEmail,
      candidateName: interview.candidateName,
      candidateEmail: interview.candidateEmail || session?.candidateEmail || "",
      resumeUrl,
      overallScore: analysis.overallScore,
      qaPairs,
      violations: interview.proctoringData?.violations || [],
      integrityScore: analysis.integrityScore,
      interviewDate: interview.createdAt,
      jobDescription: interview.jobDescription || session?.description || "",
      engagementMetrics: analysis.engagementMetrics,
      violationSummary: analysis.violationSummary,
      riskLevel: analysis.riskLevel,
      codeQAPairs: codeAnalysis.codeQAPairs,
      interviewType: interview.interviewType || "qa",
    });

    return { success: emailResult.success, analysis };
  } catch (error) {
    console.error("❌ processInterviewAndSendReport error:", error);
    return { success: false, error: error.message };
  }
}

