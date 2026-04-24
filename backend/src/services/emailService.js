import { Resend } from "resend";
import { ENV } from "../lib/env.js";

// Initialize Resend with your API Key
const resend = new Resend(ENV.RESEND_API_KEY);

/**
 * Sends the full post-interview report email to the interviewer.
 * Uses Resend API for production-ready delivery.
 */
export async function sendInterviewReport({
  to,
  candidateName,
  candidateEmail,
  resumeUrl,
  overallScore,
  qaPairs,
  violations,
  integrityScore,
  interviewDate,
  jobDescription,
  engagementMetrics,
  violationSummary,
  riskLevel,
  codeQAPairs = [],
  interviewType = "qa",
}) {
  const scoreColor =
    overallScore >= 8
      ? "#22c55e"
      : overallScore >= 6
      ? "#3b82f6"
      : overallScore >= 4
      ? "#eab308"
      : "#ef4444";

  const riskColor =
    riskLevel === "Low"
      ? "#22c55e"
      : riskLevel === "Medium"
      ? "#eab308"
      : "#ef4444";

  const qaRowsHtml = qaPairs
    .map(
      (qa, i) => `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 16px; color: #94a3b8; font-size: 14px; vertical-align: top; width: 40px;">#${i + 1}</td>
        <td style="padding: 16px; vertical-align: top;">
          <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Q: ${qa.question || "AI-Generated Question"}</div>
          <div style="color: #94a3b8; font-size: 13px; margin-bottom: 6px;">A: ${qa.answer || "No response"}</div>
          ${qa.feedback ? `<div style="color: #60a5fa; font-size: 12px; font-style: italic; margin-top: 8px;">💡 ${qa.feedback}</div>` : ""}
          ${qa.idealAnswer ? `<div style="color: #a78bfa; font-size: 12px; margin-top: 4px;">✅ Ideal: ${qa.idealAnswer}</div>` : ""}
        </td>
        <td style="padding: 16px; vertical-align: top; text-align: center;">
          <span style="background: ${qa.score >= 7 ? "#22c55e20" : qa.score >= 4 ? "#eab30820" : "#ef444420"}; color: ${qa.score >= 7 ? "#22c55e" : qa.score >= 4 ? "#eab308" : "#ef4444"}; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 14px;">
            ${qa.score ?? 0}/10
          </span>
        </td>
      </tr>`
    )
    .join("");

  // Code submissions section for coding interviews
  const codeSubmissionsHtml = codeQAPairs.length > 0 ? `
    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; margin-bottom: 24px;">
      <div style="padding: 20px 24px; border-bottom: 1px solid #334155;">
        <h3 style="color: #e2e8f0; font-size: 16px; margin: 0;">💻 Code Submissions</h3>
        <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Candidate's coding solutions with AI evaluation</p>
      </div>
      ${codeQAPairs.map((cq, i) => `
        <div style="padding: 20px 24px; border-bottom: 1px solid #334155;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <span style="color: #60a5fa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Q${i + 1} • ${cq.topic} • ${cq.difficulty}</span>
              <h4 style="color: #f1f5f9; font-size: 16px; margin: 4px 0;">${cq.questionTitle}</h4>
            </div>
            <span style="background: ${cq.score >= 7 ? "#22c55e20" : cq.score >= 4 ? "#eab30820" : "#ef444420"}; color: ${cq.score >= 7 ? "#22c55e" : cq.score >= 4 ? "#eab308" : "#ef4444"}; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 14px;">
              ${cq.score}/10
            </span>
          </div>
          <div style="background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 12px; overflow-x: auto;">
            <pre style="color: #e2e8f0; font-family: monospace; font-size: 12px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${cq.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
            <span style="background: #0f172a; padding: 4px 10px; border-radius: 6px; color: #94a3b8; font-size: 11px;">⏱️ Time: <strong style="color: #60a5fa;">${cq.timeComplexity}</strong></span>
            <span style="background: #0f172a; padding: 4px 10px; border-radius: 6px; color: #94a3b8; font-size: 11px;">💾 Space: <strong style="color: #a78bfa;">${cq.spaceComplexity}</strong></span>
          </div>
          ${cq.correctness ? `<div style="color: #22c55e; font-size: 12px; margin-bottom: 6px;">✅ ${cq.correctness}</div>` : ""}
          ${cq.suggestions ? `<div style="color: #eab308; font-size: 12px; font-style: italic;">💡 ${cq.suggestions}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  const violationListHtml =
    violations.length > 0
      ? violations
          .slice(0, 10)
          .map(
            (v) =>
              `<div style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #1e293b; border-radius: 8px; margin-bottom: 6px;">
                <span style="color: #eab308;">⚠️</span>
                <span style="color: #94a3b8; font-size: 12px;">${v.type?.replace("_", " ")} — ${new Date(v.timestamp).toLocaleTimeString()}</span>
              </div>`
          )
          .join("")
      : `<div style="text-align: center; padding: 20px; color: #22c55e;">✅ No violations detected</div>`;

  const interviewTypeLabel = interviewType === "coding" ? "AI Coding Interview Report" : "AI Interview Report";

  const html = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background: #0f172a; font-family: sans-serif;">
  <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="color: #e2e8f0; font-size: 28px; margin: 0;">🧠 Talent IQ</h1>
      <p style="color: #64748b; font-size: 14px; margin-top: 8px;">${interviewTypeLabel}</p>
    </div>

    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0;">Candidate</p>
          <h2 style="color: #f1f5f9; font-size: 24px; margin: 8px 0;">${candidateName}</h2>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">${candidateEmail}</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid ${scoreColor}; display: flex; align-items: center; justify-content: center;">
            <span style="color: ${scoreColor}; font-size: 24px; font-weight: 800;">${overallScore}</span>
          </div>
          <p style="color: #64748b; font-size: 10px; margin-top: 8px;">SCORE / 10</p>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
      <div style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
        <p style="color: #64748b; font-size: 11px; text-transform: uppercase; margin: 0;">Integrity</p>
        <p style="color: ${integrityScore >= 70 ? "#22c55e" : "#ef4444"}; font-size: 24px; font-weight: 800; margin: 8px 0 0 0;">${integrityScore}%</p>
      </div>
      <div style="flex: 1; background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
        <p style="color: #64748b; font-size: 11px; text-transform: uppercase; margin: 0;">Risk Level</p>
        <p style="color: ${riskColor}; font-size: 24px; font-weight: 800; margin: 8px 0 0 0;">${riskLevel}</p>
      </div>
    </div>

    ${violationListHtml}
    ${codeSubmissionsHtml}

    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 16px; overflow: hidden; margin-top: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        ${qaRowsHtml}
      </table>
    </div>
  </div>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: "Talent IQ <onboarding@resend.dev>", // Replace with your domain once verified
      to: [to],
      subject: `🧠 Interview Report: ${candidateName} — Score ${overallScore}/10`,
      html: html,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      return { success: false, error };
    }

    console.log("✅ Interview report email sent via Resend:", data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    return { success: false, error: error.message };
  }
}
