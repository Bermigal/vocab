import { useState, useEffect } from "react";
import { allWords } from "../allWords";

function getRoundWords(words, round, size = 10) {
  const grouped = {};
  for (const word of words) {
    const letter = word.en[0].toLowerCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(word);
  }

  const letters = Object.keys(grouped).sort();
  const pickedLetters = [];

  let i = round * size;
  let attempts = 0;
  while (pickedLetters.length < size && attempts < letters.length) {
    const letter = letters[i % letters.length];
    if (!pickedLetters.includes(letter)) {
      pickedLetters.push(letter);
    }
    i++;
    attempts++;
  }

  const selected = pickedLetters.map(letter => {
    const group = grouped[letter];
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
    <div style={{
      backgroundColor: "#fdfaf4",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      padding: "1rem"
    }}>
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <img src="/logo2.png" alt="Top Berman English" style={{ width: "80px", marginLeft: "auto" }} />
      </header>

      <h1 style={{
        textAlign: "center",
        fontSize: "2rem",
        margin: "1rem 0",
        color: "#003366"
      }}>טופ ברמן אנגלית, זה קל</h1>

      <h2 style={{
        textAlign: "center",
        marginBottom: "2rem",
        color: "#005599"
      }}>למדו את המילים הבאות</h2>

      {current && (
        <div style={{
          backgroundColor: "#ffffff",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>{current.en}</div>
          {showHebrew && <div style={{ fontSize: "1.5rem", color: "green", marginBottom: "1rem" }}>{current.he}</div>}

          {!showHebrew && (
            <button onClick={() => setShowHebrew(true)} style={buttonStyle}>
              הצג תרגום
            </button>
          )}
          <div style={{ marginTop: "1rem" }}>
            <button onClick={playAudio} style={buttonStyle}>🔊 שמע מילה</button>{" "}
            <button onClick={markForReview} style={buttonStyle}>⭐ תרגול חוזר</button>{" "}
            <button onClick={next} style={buttonStyle}>➡️ הבא</button>
          </div>
          <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#888" }}>
            מילה {index + 1} מתוך {currentSet.length} | סבב {round + 1} מתוך 65
          </div>
        </div>
      )}

      {reviewWords.length > 0 && (
        <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "1rem" }}>
          <h3 style={{ textAlign: "center", color: "#003366" }}>מילים לשינון חוזר:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviewWords.map((w, i) => (
              <li key={i}>{w.en} - {w.he}</li>
            ))}
          </ul>
        </div>
      )}

      <footer style={{
        textAlign: "center",
        marginTop: "3rem",
        padding: "1rem",
        color: "#999",
        fontSize: "0.9rem"
      }}>
        כל הזכויות שמורות לליאור ברמן אמיר
      </footer>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#0055aa",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "0.5rem 1rem",
  margin: "0.25rem",
  cursor: "pointer",
  fontSize: "1rem"
};
