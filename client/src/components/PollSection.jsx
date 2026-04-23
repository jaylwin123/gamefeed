import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CONFETTI_COLORS = ["#7c3aed", "#06b6d4", "#ec4899", "#f59e0b", "#34d399"];

function Confetti({ pieces }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti-fall"
          style={{
            left: p.left,
            top: "-4px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function PollSection({ poll, newsletterId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [votes, setVotes] = useState(
    poll.votes && poll.votes.length
      ? poll.votes
      : new Array(poll.options.length).fill(0),
  );
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [barVisible, setBarVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem(`gf_vote_${newsletterId}`);
    if (stored !== null) {
      setVoted(true);
      setSelectedOption(parseInt(stored, 10));
    }
  }, [newsletterId]);

  useEffect(() => {
    if (voted) {
      const timer = setTimeout(() => setBarVisible(true), 80);
      return () => clearTimeout(timer);
    }
  }, [voted]);

  async function handleVote(index) {
    if (voted) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await api.post("/news/poll-vote", {
        newsletterId,
        optionIndex: index,
      });
      setVotes(res.data.votes);
      setVoted(true);
      setSelectedOption(index);
      localStorage.setItem(`gf_vote_${newsletterId}`, String(index));

      const pieces = Array.from({ length: 24 }, (_, i) => ({
        id: idRef.current++,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        left: `${4 + (i / 24) * 92}%`,
        delay: `${(i / 24) * 0.45}s`,
        size: `${4 + (i % 3) * 2}px`,
      }));
      setConfettiPieces(pieces);
      setTimeout(() => setConfettiPieces([]), 1600);
    } catch (err) {
      if (err.response?.status === 409) {
        setVoted(true);
      }
    }
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0);
  const maxVotes = Math.max(...votes);

  function getPercentage(count) {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  }

  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div
      className="relative rounded-xl border border-white/[0.08] overflow-hidden"
      style={{
        background: "rgba(26,26,46,0.8)",
        boxShadow: "inset 0 0 80px rgba(236,72,153,0.04)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ec4899, transparent)",
        }}
      />
      <Confetti pieces={confettiPieces} />
      <div className="p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-archivo text-sm tracking-widest text-accent-pink bg-accent-pink/10 border border-accent-pink/30 rounded px-2.5 py-1">
              ENCUESTA
            </span>
          </div>
          <div className="font-mono-jet text-xs text-text-muted">
            <b className="text-accent-pink">
              {totalVotes.toLocaleString("es-ES")}
            </b>{" "}
            votos
          </div>
        </div>
        <h3 className="font-grotesk font-bold text-lg text-text-primary mb-5">
          {poll.question}
        </h3>
        <div className="space-y-2.5">
          {poll.options.map((option, i) => {
            const pct = getPercentage(votes[i]);
            const isSelected = selectedOption === i;
            const isWinner = voted && votes[i] === maxVotes && maxVotes > 0;

            return (
              <button
                key={i}
                onClick={() => handleVote(i)}
                disabled={voted}
                className={[
                  "w-full text-left rounded-lg border overflow-hidden transition-all duration-300",
                  isSelected
                    ? "border-accent-pink"
                    : isWinner && voted
                      ? "border-accent-yellow/50"
                      : "border-white/[0.08]",
                  isSelected && voted ? "bg-accent-pink/[0.06]" : "",
                  !voted && "hover:border-accent-pink cursor-pointer",
                  voted && "cursor-default",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="relative px-4 py-3">
                  {voted && (
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-l-lg"
                      style={{
                        width: barVisible ? `${pct}%` : "0%",
                        background: isSelected
                          ? "rgba(236,72,153,0.2)"
                          : "rgba(236,72,153,0.08)",
                      }}
                    />
                  )}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded flex items-center justify-center font-archivo text-xs flex-shrink-0"
                        style={{
                          background: isSelected
                            ? "rgba(236,72,153,0.25)"
                            : "rgba(255,255,255,0.05)",
                          border: `1px solid ${isSelected ? "#ec4899" : "rgba(255,255,255,0.1)"}`,
                          color: isSelected
                            ? "#ec4899"
                            : "var(--text-muted, #888)",
                        }}
                      >
                        {letters[i]}
                      </span>
                      <span
                        className={`text-sm font-medium ${isSelected ? "text-accent-pink" : "text-text-primary"}`}
                      >
                        {isWinner && voted && (
                          <span className="mr-1.5">👑</span>
                        )}
                        {option}
                      </span>
                    </div>
                    {voted && (
                      <span
                        className={`font-mono-jet text-sm font-bold tabular-nums ${isSelected ? "text-accent-pink" : "text-text-muted"}`}
                      >
                        {pct}%
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 font-mono-jet text-xs text-text-muted">
          <span>
            Total:{" "}
            <b className="text-accent-pink">
              {totalVotes.toLocaleString("es-ES")}
            </b>{" "}
            votos
          </span>
          {voted ? (
            <span className="text-success">✓ ¡Gracias por votar!</span>
          ) : isAuthenticated ? (
            <span>Click para votar</span>
          ) : (
            <span>
              <button
                onClick={() => navigate("/login")}
                className="text-accent-cyan hover:underline"
              >
                Iniciá sesión
              </button>
              {" o "}
              <button
                onClick={() => navigate("/register")}
                className="text-accent-cyan hover:underline"
              >
                registrate
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
