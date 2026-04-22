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

  return (
    <div className="relative bg-bg-card border border-border-dark rounded-xl p-6">
      <Confetti pieces={confettiPieces} />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold font-display tracking-widest text-accent-pink bg-accent-pink/10 border border-accent-pink/30 rounded px-2 py-1">
          ENCUESTA
        </span>
        <span className="text-xs text-text-muted">{totalVotes} votos</span>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-4">
        {poll.question}
      </h3>
      <div className="space-y-3">
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
                  ? "border-accent-purple"
                  : isWinner && voted
                    ? "border-accent-yellow/50"
                    : "border-border-dark",
                !voted && "hover:border-accent-purple cursor-pointer",
                voted && "cursor-default",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative px-4 py-3">
                {voted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-l-lg ${
                      isSelected ? "bg-accent-purple/20" : "bg-accent-cyan/10"
                    }`}
                    style={{ width: barVisible ? `${pct}%` : "0%" }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-accent-purple" : "text-text-primary"
                    }`}
                  >
                    {isWinner && voted && <span className="mr-1.5">👑</span>}
                    {option}
                  </span>
                  {voted && (
                    <span
                      className={`text-sm font-bold tabular-nums ${
                        isSelected ? "text-accent-purple" : "text-text-muted"
                      }`}
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
      {voted && (
        <p className="text-xs text-text-muted mt-4 text-center">
          ¡Gracias por votar! Vuelve la próxima semana.
        </p>
      )}
      {!voted && !isAuthenticated && (
        <p className="text-xs text-text-muted mt-4 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-accent-cyan hover:underline"
          >
            Iniciá sesión
          </button>{" "}
          o{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-accent-cyan hover:underline"
          >
            creá una cuenta
          </button>{" "}
          para votar.
        </p>
      )}
    </div>
  );
}
