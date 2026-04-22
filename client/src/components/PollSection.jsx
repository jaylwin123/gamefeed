import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    const stored = localStorage.getItem(`gf_vote_${newsletterId}`);
    if (stored !== null) {
      setVoted(true);
      setSelectedOption(parseInt(stored, 10));
    }
  }, [newsletterId]);

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
    } catch (err) {
      if (err.response?.status === 409) {
        setVoted(true);
      }
    }
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  function getPercentage(count) {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 100);
  }

  return (
    <div className="bg-bg-card border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold text-accent-pink bg-accent-pink/10 border border-accent-pink/30 rounded px-2 py-1">
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

          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              disabled={voted}
              className={[
                "w-full text-left rounded-lg border overflow-hidden transition-all duration-300",
                isSelected ? "border-accent-purple" : "border-border-dark",
                !voted && "hover:border-accent-purple cursor-pointer",
                voted && "cursor-default",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="relative px-4 py-3">
                {voted && (
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      isSelected ? "bg-accent-purple/20" : "bg-accent-cyan/10"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-accent-purple" : "text-text-primary"
                    }`}
                  >
                    {option}
                  </span>
                  {voted && (
                    <span
                      className={`text-sm font-bold ${
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
