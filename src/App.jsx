import { useState, useEffect } from "react";

function App() {
const [newName, setNewName] = useState("");


  const [timerSets, setTimerSets] = useState([]);

  const [screen, setScreen] = useState("home");

  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("timerSets") || "[]");
  setTimerSets(saved);
}, [screen]); // ホームに戻るたびに更新


  useEffect(() => {
    let timer = null;
    if (running) {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatNow = (date) => {
    const hours = date.getHours();
    const ampm = hours < 12 ? "AM" : "PM";
    const h = String(hours % 12 == 0 ? 12 : hours % 12).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${ampm} ${h}:${m}:${s}`;
  };

  return (
    <div style={styles.container}>
      {/* 左上タイトル（全画面共通） */}
      <div style={styles.header}>Study Timer</div>

      {screen === "home" && (
  <>
    <div style={styles.homeWrapper}>
      <p style={styles.now}>{formatNow(now)}</p>

      <button style={styles.button} onClick={() => setScreen("timer")}>
        スタート
      </button>

      <button style={styles.subButton} onClick={() => setScreen("new")}>
        新規作成
      </button>
    </div>

    {/* ←←← ここにタイマー一覧を挿入する！ */}
    {timerSets.length > 0 && (
      <div style={styles.listWrapper}>
        <h2 style={styles.listTitle}>保存されたタイマー</h2>

        {timerSets.map((set, index) => (
          <div key={index} style={styles.listItem}>
            <span>{set.name}</span>

            <div>
              <button
                style={styles.smallButton}
                onClick={() => {
                  console.log("選択されたセット:", set);
                  setScreen("timer");
                }}
              >
                スタート
              </button>

              <button
                style={styles.deleteButton}
                onClick={() => {
                  const updated = [...timerSets];
                  updated.splice(index, 1);
                  setTimerSets(updated);
                  localStorage.setItem("timerSets", JSON.stringify(updated));
                }}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </>
)}


      {screen === "timer" && (
        <>
          <p style={styles.time}>{formatTime(time)}</p>

          <div style={styles.row}>
            {!running && (
              <button style={styles.button} onClick={() => setRunning(true)}>
                スタート
              </button>
            )}
            {running && (
              <button style={styles.stopButton} onClick={() => setRunning(false)}>
                ストップ
              </button>
            )}
            <button
              style={styles.resetButton}
              onClick={() => {
                setRunning(false);
                setTime(0);
              }}
            >
              リセット
            </button>
          </div>

          <button style={styles.backButton} onClick={() => setScreen("home")}>
            ホームに戻る
          </button>
        </>
      )}

      {screen === "new" && (
  <>
    <h1 style={styles.title}>新規作成</h1>

    <input
      style={styles.input}
      type="text"
      placeholder="セット名を入力"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
    />

    <button
      style={styles.button}
      onClick={() => {
        if (!newName.trim()) return alert("名前を入力してください");

        const newSet = {
          name: newName,
          steps: [],       // ← 今は空でOK（後で作る）
          loop: 1,
          longBreak: 0,
        };

        const updated = [...timerSets, newSet];
        setTimerSets(updated);
        localStorage.setItem("timerSets", JSON.stringify(updated));

        setNewName("");
        setScreen("home");
      }}
    >
      保存
    </button>

    <button style={styles.backButton} onClick={() => setScreen("home")}>
      ホームに戻る
    </button>
  </>
)}


      
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },

  header: {
    position: "absolute",
    top: "20px",
    left: "20px",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },

  homeWrapper: {
  marginTop: "100px",   // ← ここで上に寄せる
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
},


  now: {
    fontSize: "7rem",
    marginBottom: "3rem",
    fontFamily: "monospace",
  },

  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },

  text: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },

  time: {
    fontSize: "3.5rem",
    marginBottom: "2rem",
    fontFamily: "monospace",
  },

  row: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
  },

  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },

  subButton: {
    marginTop: "1rem",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#9C27B0",
    color: "white",
    cursor: "pointer",
  },

  stopButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#E53935",
    color: "white",
    cursor: "pointer",
  },

  resetButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#757575",
    color: "white",
    cursor: "pointer",
  },

  backButton: {
    marginTop: "1rem",
    padding: "10px 20px",
    fontSize: "0.9rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2196F3",
    color: "white",
    cursor: "pointer",
  },

  listWrapper: {
  marginTop: "2rem",
  width: "90%",
  maxWidth: "400px",
},

listTitle: {
  fontSize: "1.4rem",
  marginBottom: "1rem",
  fontWeight: "bold",
},

listItem: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
},

smallButton: {
  padding: "6px 12px",
  marginRight: "6px",
  fontSize: "0.8rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4CAF50",
  color: "white",
  cursor: "pointer",
},

deleteButton: {
  padding: "6px 12px",
  fontSize: "0.8rem",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#E53935",
  color: "white",
  cursor: "pointer",
},

input: {
  padding: "10px",
  fontSize: "1rem",
  width: "80%",
  maxWidth: "300px",
  marginBottom: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
},


};

export default App;