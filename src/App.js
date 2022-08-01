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
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searching, setSearching] = useState(false);
  const [correct, setCorrect] = useState(false);


  let all_songs_array = [];
  all_songs["64"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })
  all_songs["Melee"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })
  all_songs["Brawl"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })
  all_songs["3DS"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })
  all_songs["WiiU"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })
  all_songs["Ultimate"].songs.forEach(song => {
    all_songs_array.push(song.title)
  })



  function getTodaysSeed(){
    const today = new Date();
    const seed = today.getFullYear() + today.getMonth() + today.getDate();
    return seed;
  }

  function getTodaysGame(random=false){
    let todays_seed = random ? Math.random() : getTodaysSeed();
    const value = seedrandom(todays_seed);
    const rng_game = Math.floor((value() * 5737 + 1233) % 6);
    switch(rng_game){
      case 0:
        return "64";
      case 1:
        return "Melee";
      case 2:
        return "Brawl";
      case 3:
        return "3DS";
      case 4:
        return "WiiU";
      default:
        return "Ultimate";
    }
  }

  function getTodaysSong(random=false){
    let todays_seed = random ? Math.random() : getTodaysSeed();
    const value = seedrandom(todays_seed);
    const todays_game = getTodaysGame(random);
    const rng_song = Math.floor((value() * 287333 + 231729) % all_songs[todays_game].songs.length);
    return all_songs[todays_game].songs[rng_song];
  }

  function togglePlay(playing){
    player.current.seekTo(0);
    setPlaying(!playing);
  }

  function doRandomSong(){
    const random_song = getTodaysSong(true);
    setSong(random_song);
    setGuesses([]);
    setCorrect(false);
  }

  function filterSongs(value){
    const re_value = value.replace(/\s+/g,"");
    let nameregex = new RegExp(".*" + re_value.split("").join(".*") + ".*",'gi');
    let filtered = all_songs_array.filter(song => nameregex.test(song));
    filtered = filtered.map(song => {
      let split = song.split("");
      let lower = split.map(letter => letter.toLowerCase());
      let valuesplit = re_value.split("");
      let curr_index = 0;
      for(let i = 0; i < valuesplit.length; i++){
        const first_index = lower.indexOf(valuesplit[i].toLowerCase(), curr_index);
        for(let j = 0; j < split.length; j++){
          if(typeof split[j] === 'string' && split[j].toLowerCase() === valuesplit[i].toLowerCase() && j === first_index){
            curr_index = j + 1;
            // black magic
            if(j > 0 && split[j-1] === " " && j < split.length - 1 && split[j+1] === " "){
              split[j] = <span>&nbsp;<span className="bg-gray-400 text-black">{split[j]}</span>&nbsp;</span>;
            } else if(j > 0 && split[j-1] === " "){
              split[j] = <span>&nbsp;<span className="bg-gray-400 text-black">{split[j]}</span></span>;
            } else if(j < split.length - 1 && split[j+1] === " "){
              split[j] = <span><span className="bg-gray-400 text-black">{split[j]}</span>&nbsp;</span>;
            } else {
              split[j] = <span><span className="bg-gray-400 text-black">{split[j]}</span></span>;
            }
          }
        }
      }
      let marked = split.map(letter => {
        return letter;
      });
      return marked;
    })

    //sort filtered by the most consecutive objects in the array
    function mostConsecutive(arr){
      let max = 0;
      let count = 0
      for(let i=0; i<arr.length; i++){
        if(i<arr.length-1 && typeof arr[i] === typeof arr[i+1] && typeof arr[i] === 'object'){
          count++;
        } else {
          count = 0;
        }
        if(count > max){
          max = count;
        }
      }
      return max;
    }
    filtered.sort((a, b) => {
      return mostConsecutive(b) - mostConsecutive(a);
    });


    setFilteredSongs(filtered);
  }

  function cleanUp(html){
    let cleaned = html.map(letter => {
      if(typeof letter === 'string'){
        return letter;
      } else {
        // letter with a space before it or both before and after
        if(typeof letter.props.children[1] === 'object'){
          return letter.props.children[1].props.children;
        }
        // letter with a space after it
        if(typeof letter.props.children[0] === 'object'){
          return letter.props.children[0].props.children;
        }
        // regular letter
        if(typeof letter.props.children === 'object'){
          return letter.props.children.props.children;
        }
        return letter.props.children;
      }
    }).join("");
    return cleaned;
  }

  function processGuess(guess){
    // if guess name = song id
    // set as correct, move to next screen
    let wrong_guess = `❌  ${guess}`;
    let right_guess = `✔️  ${guess}`;
    const updated_guess = guess === song.title ? right_guess : wrong_guess;
    updated_guess === right_guess ? setCorrect(true) : setCorrect(false);
    setGuesses([...guesses, updated_guess]);
  }

  React.useEffect(() => {
    setSong(getTodaysSong());
  }, []);

  
  return (
    <div className="text-center bg-slate-800 min-h-screen text-white flex justify-center">
      <div className="my-10 w-1/2 border-black border-2 relative">
        <div className="mb-5">smash heardle</div>
        <div className="flex flex-col items-center relative w-full">
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[0]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[1]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[2]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[3]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all mb-2">{guesses[4]}</span>
          <span className="flex justify-center items-center border-solid border-black border-4 w-3/4 h-14 break-all">{guesses[5]}</span>
        </div>
        <div className={guesses.length === 6 || correct ? "relative" : "hidden"}>
          {correct ? "gg" : `literally went 0-2, it was actually ${song.title}`}
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
        <div className="flex flex-col justify-center items-center w-full h-full absolute bottom-0">
          <div className={searching ? `${filteredSongs.length < 8 ? "flex flex-col justify-end" : ""} z-40 w-5/6 overflow-y-scroll h-96 absolute bottom-0 mb-[11rem]` : "hidden"}>
            {filteredSongs.length > 0 ? 
              filteredSongs.map((song, index) => {
                if(index < 100){
                  return (
                    <div 
                      className="flex justify-start overflow-x-auto text-sm pl-4 items-center w-full h-12 border border-white bg-black hover:bg-slate-800 cursor-pointer" 
                      key={index}
                      onClick={() => {
                        setSearching(false);
                        submit.current.value = cleanUp(song);
                      }}>
                      {song}
                    </div>
              )} else{return(null)}
              }) : null}
          </div>
          <div className="my-2 absolute bottom-0 mb-48 z-10">progress bar here</div>
          <div className="flex flex-row justify-center items-center w-3/4 my-4 absolute bottom-0 mb-32 border border-black">
            <span className="absolute left-0 px-2"><Magnifying /></span>
            <input 
              disabled={guesses.length === 6 || correct} 
              type="text" 
              ref={submit} 
              className="w-full pl-10 py-2  text-black text-lg" placeholder="Any Guesses?" 
              onKeyPress={(e) => {
                if(e.key === "Enter" && e.target.value.length > 0){
                  processGuess(e.target.value);
                  e.target.value = "";
                  setSearching(false);
                }
              }} 
              onChange={(e) => {
                if(e.target.value.length > 0){
                  setSearching(true);
                  filterSongs(e.target.value)
                } else {
                  setSearching(false);
                }
              }} />
                  
          </div>
          <div className="flex w-full justify-evenly items-center mb-4 absolute bottom-0">
            <button className="mr-2 bg-slate-600 h-12 w-24 px-2 rounded-lg" onClick={() => {
              //Skip logic 
            }}>Skip</button>
            <div className="flex justify-center items-center" onClick={
              () => togglePlay(playing)}>{playing ? <PauseIcon /> : <PlayIcon />
              }</div>
            <button 
              className="ml-2 bg-green-600 h-12 w-24 px-2 rounded-lg" 
              onClick={() => {
                if(submit.current.value.length > 0){
                  processGuess(submit.current.value);
                  submit.current.value = "";
                  setSearching(false);
                }
              }}>Submit</button>
          </div>
        </div>
        <button className="bg-green-600 h-12 w-24 px-2 rounded-lg absolute top-0 right-0 mr-2" onClick={() => {
          doRandomSong();
        } }>Random</button>
      </div>
    </div>
  );
}

export default App;
