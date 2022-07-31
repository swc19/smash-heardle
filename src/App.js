import './App.css';
import React, {useState, useRef} from 'react';
import ReactPlayer from 'react-player';
import seedrandom from 'seedrandom';
import all_songs from './All.json';
import PlayIcon from './Icons/PlayIcon.jsx'
import PauseIcon from './Icons/PauseIcon.jsx';
import Magnifying from './Icons/Magnifying.jsx';



function App() {
  const player = useRef();
  const submit = useRef();
  const [song, setSong] = useState('');
  const [playing, setPlaying] = useState(false);
  const [guesses, setGuesses] = useState([]);

  function getTodaysSeed(){
    const today = new Date();
    const seed = today.getFullYear() + today.getMonth() + today.getDate();
    return seed;
  }

  function getTodaysGame(){
    const todays_seed = getTodaysSeed();
    const value = seedrandom(todays_seed);
    const rng_game = Math.floor((value() * 5737 + 1233) % 5);
    switch(rng_game){
      case 0:
        return "64";
      case 1:
        return "Melee";
      case 2:
        return "Brawl";
      case 3:
        return "4";
      default:
        return "Ultimate";
    }
  }

  function getTodaysSong(){
    const todays_seed = getTodaysSeed();
    const todays_game = getTodaysGame();
    const rng_song = Math.floor((todays_seed * 287333 + 231729) % all_songs[todays_game].songs.length);
    return all_songs[todays_game].songs[rng_song];
  }

  function togglePlay(playing){
    player.current.seekTo(0);
    setPlaying(!playing);
  }

  function processGuess(guess){
    // if guess name = song id
    // set as correct, move to next screen
    let wrong_guess = `❌  ${guess}`;
    let right_guess = `✔️  ${guess}`;
    const updated_guess = guess === song.title ? right_guess : wrong_guess;
    setGuesses([...guesses, updated_guess]);
  }

  React.useEffect(() => {
    setSong(getTodaysSong());
  }, []);

  
  return (
    <div className="text-center bg-slate-800 min-h-screen text-white flex justify-center">
      <div className="my-10 w-1/2 border-black border-2 relative">
        <div className="mb-5">smash heardle</div>
        <div className="flex flex-col items-center absolute top-10 w-full">
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[0]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[1]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[2]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[3]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[4]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all">{guesses[5]}</span>
        </div>
        <div className="hidden">
          {song ? 
            <ReactPlayer 
              ref={player}
              url={`https://youtube.com/watch?v=${song.video_id}`}
              controls={true}
              playing={playing}  
              volume={.8}
              muted={false}
            /> 
            : "Loading..."}
        </div>
        <div className="flex flex-col justify-center items-center w-full absolute bottom-0 border-2 border-black">
          <div className="my-2">progress bar here</div>
          <div className="flex flex-row justify-center items-center w-3/4 my-4 relative">
            <span className="absolute left-0 px-2"><Magnifying /></span>
            <input type="text" ref={submit} className="w-full pl-10 h-8  text-black text-lg" placeholder="Any Guesses?" onKeyPress={(e) => {
              if(e.key === "Enter" && e.value.length > 0){
                //processGuess(e.current.value);
                const guess = e.target.value;
                setGuesses([...guesses, guess]);
                e.target.value = "";
              }
            }
            }/>
          </div>
          <div className="flex w-full justify-evenly items-center">
            <button className="mr-2 bg-slate-600 h-12 w-24 px-2 rounded-lg" onClick={() => {
              //Skip logic 
            }}>Skip</button>
            <div className="flex justify-center items-center" onClick={
              () => togglePlay(playing)}>{playing ? <PauseIcon /> : <PlayIcon />
              }</div>
            <button className="ml-2 bg-green-600 h-12 w-24 px-2 rounded-lg" onClick={() => {
              if(submit.current.value.length > 0){
                processGuess(submit.current.value);
                submit.current.value = "";
              }
            }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
