import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";

import sound from "../assets/musics/music.ogg";
import music from "../assets/musics/testt.json";

const Container = styled.div`
  margin: auto;
  position: relative;
  width: 90%; /* Ajusta a largura para acomodar totalmente as colunas */
  max-width: 800px;
  height: 700px;
  background-color: #ccc;
  display: flex;
  justify-content: space-between;
  perspective: 200px; /* Adiciona perspectiva 3D ao container */
`;

const PressPoint = styled.div`
  position: absolute;
  width: 100%;
  height: 30px;
  bottom: 20px;
`;

const Column = styled.div`
  flex-grow: 1;
  border: ${(props) =>
    props.id === "empty-start" || props.id === "empty-end"
      ? "none"
      : "1px solid white"}; /* Adiciona borda de 5px preta apenas para colunas não vazias */
  transform: rotateX(10deg); /* Rotaciona as colunas em relação ao eixo X */
  width: calc(100% / 7 - 2px); /* Ajusta a largura das colunas */
`;

const explode = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
`;

const explodeAnimation = css`
  ${explode} 0.5s forwards;
`;

const Note = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}%;
  animation: ${(props) => (props.hit ? explodeAnimation : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #fff;
  font-size: 24px;
`;

const TotalScore = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 24px;
`;

const ScoreValue = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${(props) => (props.hit ? "green" : "transparent")};
  font-size: 20px;
`;

const audioFiles = {
  a: sound,
};

const Game = () => {
  const [notes, setNotes] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const noteSpeed = 50;
  const columns = useMemo(
    () => [
      { id: "empty-start", left: 3, key: "" }, // Coluna vazia no início
      { id: 0, left: 23, key: "a", color: "green" },
      { id: 1, left: 23, key: "s", color: "red" },
      { id: 2, left: 23, key: "j", color: "yellow" },
      { id: 3, left: 23, key: "k", color: "blue" },
      { id: 4, left: 23, key: "l", color: "orange" },
      { id: "empty-end", left: 96.5, key: "" }, // Coluna vazia no final
    ],
    []
  );

  const [pressArea, setPressArea] = useState({ top: 400, bottom: 575 });

  const handleKeyPress = useCallback(
    (event) => {
      const key = event.key.toLowerCase();
      if (key === "p") {
        setPaused((prevPaused) => !prevPaused);
      } else {
        const activeNote = notes.find(
          (note) =>
            note.top >= pressArea.top &&
            note.top <= pressArea.bottom &&
            note.key === key
        );
        if (activeNote) {
          setNotes((prevNotes) =>
            prevNotes.map((note) => {
              if (note.id === activeNote.id) {
                return { ...note, hit: true };
              }
              return note;
            })
          );
          setStreak((prevStreak) => prevStreak + 1);
          setTotalScore((prevTotalScore) => {
            let scoreMultiplier = 1;
            if (streak >= 10 && streak < 20) {
              scoreMultiplier = 2;
            } else if (streak >= 20 && streak < 30) {
              scoreMultiplier = 3;
            } else if (streak >= 30 && streak < 40) {
              scoreMultiplier = 4;
            } else if (streak >= 40) {
              scoreMultiplier = 5;
            }
            return prevTotalScore + 10 * scoreMultiplier;
          });
          setTimeout(() => {
            setNotes((prevNotes) =>
              prevNotes.filter((note) => note.id !== activeNote.id)
            );
          }, 500);
        } else {
          setStreak(0);
        }
      }
    },
    [notes, pressArea, streak]
  );

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        const currentMusicTime = getCurrentMusicTime();
        const notesFromMusic = music[currentMusicTime];
        if (notesFromMusic) {
          console.log(notesFromMusic);
          const newNotes = notesFromMusic
            .map((note, column) => {
              if (note === true) {
                return {
                  id: Date.now() + column + 1,
                  top: -50,
                  left: columns[column + 1].left,
                  key: columns[column + 1].key,
                  color: columns[column + 1].color,
                  hit: false,
                };
              }
              return null;
            })
            .filter((f) => f != null);
          console.log(newNotes);
          setNotes((prevNotes) => [...prevNotes, ...newNotes]);
        }
        //const newNotes = columns.map(column => {
        //  if (column.key && Math.random() < 0.2) {
        //    return { id: Date.now() + column.id, top: -50, left: column.left, key: column.key, color: column.color, hit: false };
        //  }
        //  return null;
        //}).filter(Boolean);
        //setNotes(prevNotes => [...prevNotes, ...newNotes]);
      }, 10);

      return () => clearInterval(interval);
    }
  }, [columns, paused]);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        setNotes((prevNotes) => {
          const newNotes = prevNotes
            .map((note) => {
              const newTop = note.top + noteSpeed;
              if (newTop > 570) {
                return null;
              }
              return { ...note, top: newTop };
            })
            .filter(Boolean);
          return newNotes;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [noteSpeed, paused]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setPaused(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const pressPoint = document.getElementById("press-point");
      if (pressPoint) {
        const rect = pressPoint.getBoundingClientRect();
        const bottom = window.innerHeight - rect.top;
        setPressArea((prevArea) => ({ ...prevArea, bottom }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function getCurrentMusicTime() {
    const millis = new Date().getTime() - startTime;
    const floor50ms = Math.floor(millis / 10);
    return (floor50ms * 10) + 50;
  }

  function start() {
    setStartTime(new Date().getTime());
    setPaused(false);
    setTotalScore(0);
    setStreak(0);
    const audio = new Audio(sound);
    audio.play();
  }

  return (
    <Container>
      {!paused && <PressPoint id="press-point" />}
      <Score>Streak: {streak}</Score>
      <TotalScore>
        Total Score: {totalScore} | timestamp: {getCurrentMusicTime()}
      </TotalScore>
      {columns.map((column) => (
        <Column key={column.id} id={column.id}>
          {column.key && (
            <Note
              size={60} // Tamanho da nota fixa aumentado
              top={pressArea.top + 100} // Centraliza a nota fixa verticalmente
              left={column.left} // Centraliza a nota fixa horizontalmente
              color={column.color}
              fixed
            >
              <b>{column.key.toUpperCase()}</b>{" "}
              {/* Adiciona negrito à letra da coluna */}
            </Note>
          )}
          {notes.map(
            (note) =>
              note.key === column.key && (
                <Note
                  key={note.id}
                  size={60}
                  top={note.top}
                  left={note.left}
                  color={note.color}
                  hit={note.hit}
                >
                  <ScoreValue hit={note.hit}>
                    +
                    {note.hit
                      ? (streak >= 10 && streak < 20
                          ? 2
                          : streak >= 20 && streak < 30
                          ? 3
                          : streak >= 30 && streak < 40
                          ? 4
                          : streak >= 40
                          ? 5
                          : 1) * 10
                      : 0}
                  </ScoreValue>
                </Note>
              )
          )}
        </Column>
      ))}
      {paused && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
          }}
        >
          <button onClick={() => setPaused(false)}>Continue</button>
          <button onClick={start}>Restart</button>
        </div>
      )}
    </Container>
  );
};

export default Game;
