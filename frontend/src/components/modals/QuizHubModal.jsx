import React, { useState } from "react";
import { X, Award, CheckCircle2, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { chatAPI } from "../../lib/api";
import toast from "react-hot-toast";

const TOPICS = [
  "CompTIA Security+",
  "OWASP Web Security",
  "Network Architecture & TCP/IP",
  "Certified Ethical Hacker (CEH)",
  "System Design & Microservices",
  "Cryptography & PKI",
];

export default function QuizHubModal({ onClose }) {
  const [topic, setTopic] = useState("CompTIA Security+");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  const [quizData, setQuizData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const data = await chatAPI.generateQuiz(topic, difficulty, numQuestions);
      setQuizData(data);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      toast.success("Quiz generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate quiz. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let score = 0;
    quizData.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="modal-overlay">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#6366f1]/15 border border-[#6366f1]/30 flex items-center justify-center text-[#818cf8]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">Certification Exam & Knowledge Hub</h2>
              <p className="text-xs text-[var(--text-secondary)]">Test your engineering skills with AI-generated practice questions</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="btn-pill-base btn-pill-icon"
            title="Close Quiz Hub"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {!quizData ? (
            /* Setup Quiz Form */
            <div className="space-y-4 max-w-lg mx-auto py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)]">Quiz Topic:</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="select-field"
                >
                  {TOPICS.map((t, idx) => (
                    <option key={idx} value={t} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Difficulty Level:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="select-field"
                  >
                    <option value="easy" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Easy</option>
                    <option value="medium" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Medium</option>
                    <option value="hard" className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">Hard (Exam Level)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-secondary)]">Questions Count:</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="select-field"
                  >
                    <option value={3} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">3 Questions</option>
                    <option value={5} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">5 Questions</option>
                    <option value={10} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">10 Questions</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isGenerating}
                className="btn-pill-base btn-pill-primary w-full !h-10 text-xs font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating Custom Exam Questions...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Start Practice Quiz Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Active Quiz Interface */
            <div className="space-y-4">
              {/* Question Navigation Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{quizData.topic}</span>
                  <span className="badge-pill badge-indigo">
                    Question {currentIndex + 1} of {quizData.questions.length}
                  </span>
                </div>

                <button
                  onClick={() => setQuizData(null)}
                  className="btn-pill-base btn-pill-secondary !h-7 !px-2.5 !text-[11px]"
                >
                  <RotateCcw className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>Reset Quiz</span>
                </button>
              </div>

              {/* Current Question Block */}
              {quizData.questions[currentIndex] && (
                <div className="space-y-3.5">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] leading-relaxed">
                    {quizData.questions[currentIndex].question}
                  </h3>

                  <div className="space-y-2">
                    {quizData.questions[currentIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;
                      const isCorrect = quizData.questions[currentIndex].correct_answer === optIdx;

                      let borderBg = "bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]";
                      if (isSubmitted) {
                        if (isCorrect) borderBg = "bg-[#10b981]/15 border-[#10b981]/50 text-[#34d399] font-medium";
                        else if (isSelected) borderBg = "bg-[#ef4444]/15 border-[#ef4444]/50 text-[#f87171]";
                      } else if (isSelected) {
                        borderBg = "bg-[#6366f1]/15 border-[#6366f1]/60 text-[var(--text-primary)] font-medium shadow-xs";
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentIndex, optIdx)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${borderBg}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#34d399]" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation reveal on submission */}
                  {isSubmitted && (
                    <div className="p-3.5 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/30 text-xs text-[#818cf8]">
                      <strong className="text-[var(--text-primary)]">Explanation:</strong> {quizData.questions[currentIndex].explanation}
                    </div>
                  )}

                  {/* Nav Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="btn-pill-base btn-pill-secondary"
                    >
                      Previous
                    </button>

                    {!isSubmitted ? (
                      currentIndex === quizData.questions.length - 1 ? (
                        <button
                          onClick={() => setIsSubmitted(true)}
                          className="btn-pill-base btn-pill-primary"
                        >
                          Submit & View Results
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentIndex(prev => Math.min(quizData.questions.length - 1, prev + 1))}
                          className="btn-pill-base btn-pill-primary"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )
                    ) : (
                      <div className="text-xs font-bold text-[#34d399]">
                        Score: {calculateScore()} / {quizData.questions.length} ({Math.round((calculateScore() / quizData.questions.length) * 100)}%)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between shrink-0 px-5">
          <span className="text-xs text-[var(--text-muted)] font-mono">Certification Engine</span>
          <span className="badge-pill badge-indigo">
            AI Quiz Mode
          </span>
        </div>
      </div>
    </div>
  );
}
