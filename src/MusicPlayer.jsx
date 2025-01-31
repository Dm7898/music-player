import { useEffect, useRef, useState } from "react";
import musicImg from "../public/download.png";
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";
import { GoFileDirectoryFill } from "react-icons/go";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  function handleFileChange(e) {
    const files = [...e.target.files]
      .filter((file) => file.type.startsWith("audio/"))
      .map((file, index) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        index,
      }));
    setSongs(() => [...files]);
    setCurrSongIndex(0);
  }

  function handlePlayPause() {
    if (songs.length === 0) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function playSong(index) {
    setCurrSongIndex(index);
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSongIndex]);

  function handleChangeSong(step) {
    if (songs.length === 0) return;
    const index = (currentSongIndex + step + songs.length) % songs.length;
    setCurrSongIndex(index);
  }

  function updateProgress() {
    if (!audioRef.current) return;
    const precent =
      (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(precent || 0);
  }
  function handleSetProgress(e) {
    if (!audioRef.current || isNaN(audioRef.current.duration)) return;
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  }

  return (
    <section className="flex flex-col gap-2 items-center justify-center h-screen">
      {songs.length > 0 ? (
        <div
          className="lg:w-3/5 w-full bg-white/5 flex flex-col gap-5 rounded p-2 lg:p-10 
                     shadow-[inset_1px_1px_0.12px_rgba(255,255,255,0.4),_1px_9px_10px_rgba(0,0,0,0.1)] 
                     backdrop-blur-2xl"
        >
          <div className="flex justify-between items-center gap-4">
            <div className="w-5/12 lg:w-2/5">
              <img
                src={musicImg}
                alt="img"
                className={`w-36 h-36 md:w-50 md:h-50 rounded-[50%] ${
                  isPlaying ? "spin-animate" : ""
                }`}
              />
            </div>
            <div className="w-7/12 lg:w-3/5 flex flex-col gap-2 justify-center items-center">
              <h4 className="text-center">{songs[currentSongIndex].name}</h4>
              <div className="flex gap-2 text-2xl">
                <button
                  className="cursor-pointer bg-[#84e63d] p-2 lg:p-3 rounded-full shadow-2xl hover:bg-[#91f549c9] active:scale-95 transition"
                  onClick={() => handleChangeSong(-1)}
                >
                  <TbPlayerTrackPrevFilled />
                </button>
                <button
                  className="cursor-pointer bg-[#84e63d] p-2 lg:p-3 rounded-full shadow-2xl hover:bg-[#91f549c9] active:scale-95 transition"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <FaRegCirclePause /> : <FaRegCirclePlay />}
                </button>
                <button
                  className="cursor-pointer bg-[#84e63d] p-2 lg:p-3  rounded-full shadow-2xl hover:bg-[#91f549c9] active:scale-95 transition"
                  onClick={() => handleChangeSong(1)}
                >
                  <TbPlayerTrackNextFilled />
                </button>
              </div>

              <input
                className="w-full"
                type="range"
                value={progress}
                min="0"
                max="100"
                onChange={handleSetProgress}
              />
            </div>
          </div>
          <ul className="scroll-container flex flex-col gap-2 text-sm h-90 overflow-y-auto scroll-smooth  rounded-md p-2">
            {songs.map((song, index) => (
              <li
                key={index}
                className="flex justify-between items-center gap-2 bg-[#84e63d] text-[#020202] p-1 px-2 rounded"
                onClick={() => playSong(index)}
              >
                <span>{song.name}</span>
                <button className="bg-white rounded-full px-3 py-3 cursor-pointer">
                  <FaRegCirclePlay />
                </button>
              </li>
            ))}
          </ul>

          <audio
            ref={audioRef}
            src={songs.length > 0 ? songs[currentSongIndex].url : ""}
            onTimeUpdate={updateProgress}
            onEnded={() => handleChangeSong(1)}
          ></audio>
        </div>
      ) : (
        <>
          <h1
            className="text-3xl md:text-6xl font-extrabold text-white 
               text-center drop-shadow-[0_3px_8px_rgba(0,0,0,0.4)] mb-4 font-mono  curved-text"
          >
            Feel the Beat.
            <br /> Play the Vibes.
          </h1>
          <label
            htmlFor="file-upload"
            className="bg-[#84e63d] text-[#020202] flex items-center gap-1 px-4 py-2 rounded cursor-pointer hover:bg-[#91f549e4]"
          >
            <GoFileDirectoryFill className="text-xl" />{" "}
            <span>Upload Files</span>
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            webkitdirectory=""
            multiple
            className="hidden bg-white p-2 rounded text-[#020202]"
          />
        </>
      )}
    </section>
  );
}
