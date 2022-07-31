import logo from './logo.svg';
import './App.css';
import React, {useState, useRef} from 'react';
import ReactPlayer from 'react-player';
import seedrandom from 'seedrandom';
import all_songs from './All.json';



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
    // if guess hidden id = song id
    // set as correct, move to next screen
  }

  React.useEffect(() => {
    setSong(getTodaysSong());
  }, []);

  
  return (
    <div className="text-center bg-slate-800 min-h-screen text-white flex justify-center">
      <div className="my-10 w-1/2 border-black border-2 relative">
        <div className="mb-5">smash heardle</div>
        <div className="flex flex-col items-center absolute top-10 w-full z-1">
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
        <div className="flex flex-col justify-center items-center w-full absolute bottom-0 border-2 border-black z-0">
          <div className="my-2">progress bar here</div>
          <div className="w-full my-4 z-0">
            <input type="text" ref={submit} className="w-3/4 h-8 text-black" placeholder="Guess" onKeyPress={(e) => {
              if(e.key === "Enter" && submit.current.value.length > 0){
                //processGuess(submit.current.value);
                const guess = e.target.value;
                setGuesses([...guesses, guess]);
                e.target.value = "";
              }
            }
            }/><button className="ml-2" onClick={() => {
              if(submit.current.value.length > 0){
                //processGuess(submit.current.value);
                const guess = submit.current.value;
                setGuesses([...guesses, guess]);
                submit.current.value = "";
              }
            }}>Submit</button>
          </div>
          <div className="rounded-full font-bold border-2 border-black w-16 h-16 flex justify-center items-center" onClick={() => togglePlay(playing)}>{playing ? <span>pause</span> : <span>play</span>}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
