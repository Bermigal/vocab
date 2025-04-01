import { useState, useEffect } from "react";
import { allWords } from "../allWords";

function getRoundWords(words, round, size = 10, maxRounds = 65) {
  const grouped = {};
  for (const word of words) {
    const letter = word.en[0].toLowerCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(word);
  }
  const letters = Object.keys(grouped).sort();
  const start = (round % maxRounds) * size;
  const roundLetters = letters.slice(start, start + size);
  const selected = roundLetters.map(l => {
    const group = grouped[l];
    return group[Math.floor(Math.random() * group.length)];
  }).filter(Boolean);
  return selected;
}

export default function Home() {
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState([]);
  const [showHebrew, setShowHebrew] = useState(false);
  const [reviewWords, setReviewWords] = useState([]);

  useEffect(() => {
    const set = getRoundWords(allWords, round);
    setCurrentSet(set);
    setIndex(0);
    setShowHebrew(false);
  }, [round]);

  const current = currentSet[index];

  const next = () => {
    if (index < currentSet.length - 1) {
      setIndex(index + 1);
      setShowHebrew(false);
    } else {
      setRound((prev) => (prev + 1) % 65);
    }
  };

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(current.en);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const markForReview = () => {
    setReviewWords(prev => [...prev, current]);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>ללמוד אנגלית עם ברמן, זה פשוט!</h1>
      <h2 style={{ marginBottom: "1.5rem" }}>למדו את המילים הבאות</h2>

      {current && (
        <>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{current.en}</div>
          {showHebrew && <div style={{ fontSize: "1.5rem", color: "green" }}>{current.he}</div>}

          {!showHebrew && (
            <button onClick={() => setShowHebrew(true)} style={{ marginBottom: "1rem" }}>
              הצג תרגום
            </button>
          )}
          <div style={{ marginTop: "1rem" }}>
            <button onClick={playAudio}>🔊 שמע מילה</button>{" "}
            <button onClick={markForReview}>⭐ תרגול חוזר</button>{" "}
            <button onClick={next}>➡️ הבא</button>
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
            מילה {index + 1} מתוך {currentSet.length} | סבב {round + 1} מתוך 65
          </div>
        </>
      )}

      {reviewWords.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>מילים לשינון חוזר:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviewWords.map((w, i) => (
              <li key={i}>{w.en} - {w.he}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
