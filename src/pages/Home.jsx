import React, { useEffect, useState } from 'react';
import { Howl } from 'howler';
import { PRESS_KEY, SOUND_URL } from '../constants';
import Timer from '../components/Timer';
import Spinner from '../components/Spinner';

export default function Home() {
  const START_TIME = 10;
  const [startTime, setStartTime] = useState(START_TIME * 60000);
  const [sameTime, setSameTime] = useState(true);
  const [start, setStart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [whitePreTime, setwhitePreTime] = useState(startTime);
  const [blackPreTime, setblackPreTime] = useState(startTime);
  const [whiteTime, setWhiteTime] = useState(startTime);
  const [blackTime, setBlackTime] = useState(startTime);
  const [currentInterval, setCurrentInterval] = useState(null);
  const [isSwap, setIsSwap] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(true);

  const sound = new Howl({
    src: [SOUND_URL],
    volume: 0.5,
    onload: () => {
      setLoading(false);
    },
  });

  const handleTimeChange = (e) => {
    if (start) return;
    setStartTime(e.target.value * 60000);
    setWhiteTime(e.target.value * 60000);
    setBlackTime(e.target.value * 60000);
  };

  const handleBlackTimeChange = (e) => {
    if (start) return;
    setblackPreTime(e.target.value * 60000);
    setBlackTime(e.target.value * 60000);
  };

  const handleWhiteTimeChange = (e) => {
    if (start) return;
    setwhitePreTime(e.target.value * 60000);
    setWhiteTime(e.target.value * 60000);
  };

  const handleSameTimeChange = () => {
    if (start) return;
    setSameTime(!sameTime);
    if (sameTime) {
      setWhiteTime(whitePreTime);
      setBlackTime(blackPreTime);
      return;
    }
    setWhiteTime(startTime);
    setBlackTime(startTime);
  };

  const changePlayer = () => {
    if (!isPlaying) return;
    sound.play();
    if (currentPlayer === 'white') {
      setCurrentPlayer('black');
      return;
    }
    setCurrentPlayer('white');
  };

  const handleStart = () => {
    if (start) return;
    setIsPaused(false);
    setStart(true);
    setIsPlaying(true);
    sound.play();
  };

  const handlePause = () => {
    if (ended) return;
    if (isPaused) {
      setIsPlaying(true);
      setIsPaused(false);
      sound.play();
      return;
    }
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleReset = () => {
    if (!start) return;
    clearInterval(currentInterval);
    setCurrentPlayer('white');
    setCurrentInterval(null);
    setIsPlaying(false);
    setIsPaused(false);
    setStart(false);
    setEnded(false);
    if (sameTime) {
      setWhiteTime(startTime);
      setBlackTime(startTime);
      return;
    }
    setWhiteTime(whitePreTime);
    setBlackTime(blackPreTime);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === PRESS_KEY) {
      if (!start) {
        handleStart();
        return;
      }
      if (isPaused) {
        handlePause();
        return;
      }
      changePlayer();
    }
  };

  const stopGame = () => {
    setIsPlaying(false);
    clearInterval(currentInterval);
    setEnded(true);
    if (currentPlayer === 'white') {
      console.log('black win');
      return;
    }
    console.log('white win');
  };

  const updateTime = (setter, time, lastDate) => {
    const elapsedTime = Date.now() - lastDate;
    setter((prevTime) => {
      if (prevTime - elapsedTime <= 0) {
        stopGame();
        clearInterval(currentInterval);
        return 0;
      }
      return prevTime - elapsedTime;
    });
    return Date.now();
  };

  useEffect(() => {
    clearInterval(currentInterval);
    if (!isPlaying) return;
    let lastDate = Date.now();
    if (currentPlayer === 'white') {
      setCurrentInterval(
        setInterval(() => {
          lastDate = updateTime(setWhiteTime, whiteTime, lastDate);
        }, 50),
      );
      return;
    }
    setCurrentInterval(
      setInterval(() => {
        lastDate = updateTime(setBlackTime, blackTime, lastDate);
      }, 50),
    );
  }, [currentPlayer, isPlaying]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section
      onKeyDown={handleKeyPress}
      className="h-screen outline-none"
      role="link"
      tabIndex={0}
    >
      <h1>Chess Timer</h1>
      <div>
        <div className="flex gap-4">
          {sameTime ? (
            <label htmlFor="starttime">
              Start time:
              <input
                name="starttime"
                type="number"
                className="mx-2 border border-black text-right"
                value={startTime / 60000}
                onChange={(e) => handleTimeChange(e)}
              />
              min
            </label>
          ) : (
            <div className="flex flex-col items-start">
              <label htmlFor="starttime">
                White time:
                <input
                  name="starttime"
                  type="number"
                  className="mx-2 border border-black text-right"
                  value={whitePreTime / 60000}
                  onChange={(e) => handleWhiteTimeChange(e)}
                />
                min
              </label>
              <label htmlFor="starttime">
                Black Time:
                <input
                  name="starttime"
                  type="number"
                  className="mx-2 border border-black text-right"
                  value={blackPreTime / 60000}
                  onChange={(e) => handleBlackTimeChange(e)}
                />
                min
              </label>
            </div>
          )}
          <label htmlFor="sameTime" className="flex gap-2">
            Use same time:
            <input
              type="checkbox"
              name="sameTime"
              id="sameTime"
              checked={sameTime}
              onChange={handleSameTimeChange}
            />
          </label>
        </div>
        <div>
          <p>{`Current player: ${currentPlayer}`}</p>
        </div>
        <div className="flex w-full justify-center gap-20">
          <div className="flex flex-row gap-10">
            {isSwap ? (
              <>
                <Timer player="Black" time={blackTime} />
                <Timer player="White" time={whiteTime} />
              </>
            ) : (
              <>
                <Timer player="White" time={whiteTime} />
                <Timer player="Black" time={blackTime} />
              </>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          {!start ? (
            <button type="button" onClick={handleStart}>
              Start
            </button>
          ) : (
            <button type="button" onClick={handlePause}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button type="button" onClick={handleReset}>
            Reset
          </button>
          <button type="button" onClick={changePlayer}>
            Change Player
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSwap(!isSwap);
            }}
          >
            Swap
          </button>
        </div>
      </div>
    </section>
  );
}
