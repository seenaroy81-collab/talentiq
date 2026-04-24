import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  VideoIcon,
  BotIcon,
  BrainCircuitIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-gray-900/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300 group"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <BotIcon className="size-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-sans tracking-tight">
                Talent IQ
              </span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold text-sm backdrop-blur-md transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <span>Login</span>
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-32 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
            <SparklesIcon className="size-4 text-purple-400" />
            <span className="text-sm font-semibold tracking-wide text-white/80">Next-Generation Autonomous Interviews</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8">
            Filter <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Genius</span>
            <br /> Without Lifting a Finger.
          </h1>

          <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
            Deploy hyper-realistic AI interviewers to conduct technical and behavioral screenings autonomously. Get deep actionable insights instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignInButton mode="modal">
              <button className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-500/25 transition-all hover:scale-105 hover:-translate-y-1 flex items-center gap-3">
                Deploy AI Interviewer
                <ArrowRightIcon className="size-5" />
              </button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* CAPABILITIES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-32 border-t border-white/5">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Built for Scale and Precision
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto font-medium">
            Our autonomous AI platform evaluates candidates based on your exact parameters, mimicking elite senior engineers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="size-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
              <BotIcon className="size-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Hyper-Realistic AI</h3>
            <p className="text-white/60 leading-relaxed font-medium">
              Engage candidates with conversational AI that dynamically adapts to their answers in real-time.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="size-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuitIcon className="size-7 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Automated Evaluation</h3>
            <p className="text-white/60 leading-relaxed font-medium">
              Receive exhaustive post-interview reports with code analysis, communication scoring, and hire recommendations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="size-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Code2Icon className="size-7 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Live Environment</h3>
            <p className="text-white/60 leading-relaxed font-medium">
              Candidates code in a fully featured monaco-editor while our AI proctor observes execution and syntax validity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
