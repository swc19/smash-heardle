import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import ReactPlayer from 'react-player';
import seedrandom from 'seedrandom';
import all_songs from './filtered.json';
import PlayIcon from './Icons/PlayIcon.jsx'
import PauseIcon from './Icons/PauseIcon.jsx';
import Magnifying from './Icons/Magnifying.jsx';
import Calendar from './Icons/Calendar.jsx';
import Dice from './Icons/Dice.jsx';
import StatsIcon from './Icons/StatsIcon.jsx';
import Info from './Icons/Info.jsx';
import About from './Components/About.js';
import Stats from './Components/Stats.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const player = useRef();
  const submit = useRef();
  const search = useRef();
  const [song, setSong] = useState('');
  const [playing, setPlaying] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentGuesses, setCurrentGuesses] = useState([true]);
  const [guessState, setGuessState] = useState([]);
  const [searching, setSearching] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentLength, setCurrentLength] = useState(1);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endScreen, setEndScreen] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [randomActive, setRandomActive] = useState(false);
  const [calendarActive, setCalendarActive] = useState(false);
  const [aboutActive, setAboutActive] = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const [resultDivs, setResultDivs] = useState([]);


  const times = [1, 2, 4, 8, 12, 18];
  const skip_times = [1, 2, 4, 4, 6];

  let all_songs_array = [];
  // add these in order instead of a forEach across the original object
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



  function getTodaysSeed(newDate){
    // Get a constant seed for the day
    const today = newDate ? newDate : date;
    let seed = today.getFullYear()*318 + today.getMonth()*361 + today.getDate()*571;
    return seed;
  }

  function getTodaysGame(newDate, random=false){
    // Get the game for the day, weights are in the switch statement
    let todays_seed = random ? Math.random() : getTodaysSeed(newDate);
    const value = seedrandom(todays_seed);
    const rng_game = Math.floor((value() * 5737 + 1233) % 100);
    switch(true){
      case rng_game < 5:
        return "64";
      case rng_game < 20:
        return "Melee";
      case rng_game < 35:
        return "Brawl";
      case rng_game < 45:
        return "3DS";
      case rng_game < 65:
        return "WiiU";
      default:
        return "Ultimate";
    }
  }

  function getTodaysSong(newDate, random=false){
    // Get the song for the day
    let todays_seed = random ? Math.random() : getTodaysSeed(newDate);
    const value = seedrandom(todays_seed);
    const todays_game = getTodaysGame(newDate, random);
    const rng_song = Math.floor((value() * 287333 + 231729) % all_songs[todays_game].songs.length);
    return all_songs[todays_game].songs[rng_song];
  }

  function handleProgress(state){
    // Update the progress bar, if in the end screen allow indefinite play
    if(!endScreen){
      if(state.playedSeconds >= currentLength){
        player.current.seekTo(0);
        setProgressPercent(0);
        setPlaying(false);
      } else {
        setProgressPercent(state.playedSeconds/18*100);
        setCurrentSeconds(Math.round(state.playedSeconds));
      }
    }
  }

  function handleReady(){
    setReady(true);
  }

  function doNewSong(newDate, random=false){
    // Generate a new song, either through the calendar or random feature
    if(random || newDate.toDateString() !== date.toDateString()){
      if(!random){
        setDate(newDate);
        setCalendarActive(true);
        setRandomActive(false)
      } else {
        setDate(new Date());
        setCalendarActive(false);
        setRandomActive(true);
      }
      const new_song = getTodaysSong(newDate, random);
      setSong(new_song);
      setReady(false);
      setGuesses([]);
      setCurrentGuesses([true]);
      setGuessState([]);
      setCurrentLength(1);
      setCorrect(false);
      setSearching(false);
      setPlaying(false);
      setEndScreen(false);
      if(!random && doneToday(newDate)){
        // If the song is done on a calendar date, show the end screen
        handleEndScreen(JSON.parse(localStorage.getItem('smashHeardleStats'))[newDate.toDateString()]);
      }
    }
  }

  function filterSongs(value){
    // Filter the songs based on the search input
    const re_value = value.replace(/\s+/g,"");
    let nameregex = new RegExp(".*" + re_value.split("").join(".*") + ".*",'i');
    let filtered = all_songs_array.filter(song => nameregex.test(song));
    filtered = filtered.map(song => {
      // highlight the search term in the song name
      let split = song.split("");
      let lower = split.map(letter => letter.toLowerCase());
      let valuesplit = re_value.split("");
      let curr_index = 0;
      for(let i = 0; i < valuesplit.length; i++){
        // generate the highlighted spans for each letter
        // only grab the first instance of the letter based on the search input
        const first_index = lower.indexOf(valuesplit[i].toLowerCase(), curr_index);
        for(let j = 0; j < split.length; j++){
          if(typeof split[j] === 'string' && split[j].toLowerCase() === valuesplit[i].toLowerCase() && j === first_index){
            curr_index = j + 1;
            if(j > 0 && split[j-1] === " " && j < split.length - 1 && split[j+1] === " "){
              split[j] = <span key={split[j] + j} className="bg-gray-400 text-black">{split[j]}</span>;
            } else if(j > 0 && split[j-1] === " "){
              split[j] = <span key={split[j] + j} className="bg-gray-400 text-black">{split[j]}</span>;
            } else if(j < split.length - 1 && split[j+1] === " "){
              split[j] = <span key={split[j] + j} className="bg-gray-400 text-black">{split[j]}</span>;
            } else {
              split[j] = <span key={split[j] + j} className="bg-gray-400 text-black">{split[j]}</span>;
            }
          }
        }
      }
      let marked = split.map(letter => {
        return letter;
      });
      return marked;
    })

    function mostConsecutive(arr){
      // sort filtered by the most consecutive objects in the array
      // this provides better search results
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
    // clean up the song name for inputting into the search bar
    // otherwise you get [object Object] everywhere
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

  function processGuess(guess, skip=false){
    // process a guess based on the search input, or the skip button
    const wrong_guess = `❌  ${guess}`;
    const right_guess = `✔️  ${guess}`;
    let skip_guess;
    setCurrentLength(times[guesses.length+1] || 18);
    if(skip){
      // handle skip
      skip_guess = `🔳  Skipped`;
      setGuesses([...guesses, skip_guess]);
      setCurrentGuesses([...currentGuesses, skip_guess]);
      setGuessState([...guessState, 2])
      if(guesses.length === 5){
        // if skip on the last guess, go to end
        handleEndScreen();
      }
      return;
    }
    const updated_guess = guess === song.title ? right_guess : wrong_guess;
    if(updated_guess === right_guess){
      // if right, end early and show the end screen
      setGuessState([...guessState, 1]);
      setGuesses([...guesses, updated_guess]);
      handleEndScreen();
      setCorrect(true);
      return;
    } else {
      // if wrong, do normal logic
      setGuessState([...guessState, 0]);
      setGuesses([...guesses, updated_guess]);
      setCurrentGuesses([...currentGuesses, true]);
      setCorrect(false);
      if(guesses.length === 5){
        // if wrong on last guess, go to end screen
        handleEndScreen();
      }
    }
  }

  function handleEndScreen(stats){
    // get to the end screen
    setEndScreen(true);
    setPlaying(false);
    setProgressPercent(0);
    setCurrentSeconds(0);
    try{
      // if loading a previously guessed day or refreshing on the same day, show the proper stats
      setGuessState(stats.guesses);
      setCorrect(stats.correct);
      postResults();
    } catch(e){
      // only errors if there isn't stats for today, so do nothing
    }
  }

  function doneToday(newDate){
    // check if user has completed the song on this day
    const this_day = newDate.toDateString();
    try{
      if(JSON.parse(localStorage.getItem('smashHeardleStats'))[this_day]){
        return true;
      }
    } catch(e){
      // error if there aren't stats for this day
    }
    return false;
  }

  function getCompleted(){
    // get the list of dates that the user has completed the heardle
    // this is for the calendar popper highlighting
    let completed = [];
    try{
      Object.keys(JSON.parse(localStorage.getItem('smashHeardleStats'))).forEach(day => {
        if(day !== "Stats"){
          completed.push(new Date(day));
        }
      });
    } catch(e){}
    return completed;
  }

  function writeStats(){
    // write stats to local storage
    // also writes the initial stats if they don't exist
    let stats = {};
    if(!randomActive){
      try{
        if(localStorage.getItem('smashHeardleStats')){
          stats = JSON.parse(localStorage.getItem('smashHeardleStats'));
        }
      } catch(e){}
      if(!stats[date.toDateString()]){
        if(stats["Stats"]){
          const gameStats = stats["Stats"];
          stats["Stats"] = {
            inOne: guessState.length === 1 ? gameStats.inOne + 1 : gameStats.inOne,
            inTwo: guessState.length === 2 ? gameStats.inTwo + 1 : gameStats.inTwo,
            inThree: guessState.length === 3 ? gameStats.inThree + 1 : gameStats.inThree,
            inFour: guessState.length === 4 ? gameStats.inFour + 1 : gameStats.inFour,
            inFive: guessState.length === 5  && correct ? gameStats.inFive + 1 : gameStats.inFive,
            inSix: guessState.length === 6  && correct ? gameStats.inSix + 1 : gameStats.inSix,
            miss: guessState.length === 6 && !correct ? gameStats.miss + 1 : gameStats.miss,
            total: gameStats.total + 1,
            random: gameStats.random,
          }
        } else {
          stats = {
            Stats: {
              inOne: guessState.length === 1 ? 1 : 0,
              inTwo: guessState.length === 2 ? 1 : 0,
              inThree: guessState.length === 3 ? 1 : 0,
              inFour: guessState.length === 4 ? 1 : 0,
              inFive: guessState.length === 5 ? 1 : 0,
              inSix: guessState.length === 6 && correct ? 1 : 0,
              miss: guessState.length === 6 && !correct ? 1 : 0, 
              total: 1,
              random: {
                numCompleted: 0,
                numWon: 0
              } 
            }
          }
        }
      }
      stats[date.toDateString()] = {
        guesses: guessState,
        correct: correct
      }
      localStorage.setItem('smashHeardleStats', JSON.stringify(stats));
    } else {
      // write random stats
      console.log("completed random")
      try{
        if(localStorage.getItem('smashHeardleStats')){
          stats = JSON.parse(localStorage.getItem('smashHeardleStats'));
          stats["Stats"].random = {
            numCompleted: stats["Stats"].random.numCompleted + 1,
            numWon: correct ? stats["Stats"].random.numWon + 1 : stats["Stats"].random.numWon
          }
        } else {
          stats = {
            Stats: {
              inOne: 0,
              inTwo: 0,
              inThree: 0,
              inFour: 0,
              inFive: 0,
              inSix: 0,
              miss: 0, 
              total: 0,
              random: {
                numCompleted: 1,
                numWon: correct ? 1 : 0
              } 
            }
          }
        }
      } catch(e){}
      localStorage.setItem('smashHeardleStats', JSON.stringify(stats));
    }
  }

  function getStats(){
    if(localStorage.getItem('smashHeardleStats')){
      return localStorage.getItem('smashHeardleStats')
    }
    else{
      return null;
    }
  }

  function writeResults(){
    // writes the results to the clipboard, when user clicks the "Share" button on end screen
    let results = 'Super Smash Bros. Heardle \n\n'
    if(correct){
      results+="🔊"
    } else {
      results+="🔇"
    }
    for(let i=0; i < 6; i++){
      switch (guessState[i]) {
        case 0:
          results+="🔴";
          break;
        case 1:
          results+="🟢";
          break;
        case 2:
          results+="⚫";
          break;
        default:
          results+="⚪"
          break;
      }
    }
    setShareVisible(true); // pop up the "copied to clipboard" message
    setTimeout(() => {
      setShareVisible(false);
    }, 5000);
    results += "\n\n#SmashHeardle\nhttps://smash-heardle.com"
    return results;
  }

  function getCorrect(){
    // generate the message for the end screen
    const idx = guessState.indexOf(1)+1;
    if(correct){
      // can also check if idx is not -1 (there's a correct answer)
      return `You got it within ${times[idx-1]} second${idx > 1 ? "s" : ""}!`;
    } else {
      // custom messages based on different modes
      if(randomActive){
        return "You didn't get this one. Try again!";
      } else if(calendarActive){
        return "You didn't get this day's Smash Heardle. Try another day!";
      } else {
        return "You didn't get today's Smash Heardle. Try again tomorrow!"
      }
    }
  }

  function postResults(){
    // generate the divs for the end screen
    function getColor(i){
      if(guessState[i] === 0){
        return "bg-red-500"; // wrong
      } else if(guessState[i] === 1){
        return "bg-green-500"; // right
      } else if(guessState[i] === 2){
        return "bg-white"; // skip
      } else {
        // "black out" the answer if they didn't make it to this guess yet
        return "bg-black";
      }
    }
    setResultDivs([
      <div className="flex flex-row justify-center items-middle mb-4">
        <div className={`h-4 w-4 rounded-sm mr-1 ${getColor(0)}`}></div>
        <div className={`h-4 w-4 rounded-sm mr-1 ${getColor(1)}`}></div>
        <div className={`h-4 w-4 rounded-sm mr-1 ${getColor(2)}`}></div>
        <div className={`h-4 w-4 rounded-sm mr-1 ${getColor(3)}`}></div>
        <div className={`h-4 w-4 rounded-sm mr-1 ${getColor(4)}`}></div>
        <div className={`h-4 w-4 rounded-sm ${getColor(5)}`}></div>
      </div>]);
  }
  function closeAbout(){
    // function for the about component
    setAboutActive(false);
  }
  function closeStats(){
    // function for the share component
    setStatsActive(false);
  }

  useEffect(() => {
    document.title = 'Smash Bros. Heardle'
    setSong(getTodaysSong());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try{
      const todays_stats = JSON.parse(localStorage.getItem('smashHeardleStats'))[date.toDateString()];
      if(doneToday(date) && !randomActive){
        handleEndScreen(todays_stats);
      }
    } catch(e){}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  useEffect(() => {
    // close out the search results if user clicks outside to replay the song or whatever
    const clickOutside = (e) => {
      if(search.current && !search.current.contains(e.target)){
        setSearching(false);
      }
    }
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('click', clickOutside);
    }
  }, [search]);
  
  useEffect(() => {
    // ensure that the stats are written correctly
    // without this there's possibilities for race conditions
    if(guessState.length > 0 && endScreen){
      writeStats();
      postResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endScreen])

  return (
    <div className="text-center bg-slate-800 min-h-screen text-white flex justify-center">
      {/* Main Wrapper */}
      <div><About visible={aboutActive} close={closeAbout} /></div> 
      <div><Stats visible={statsActive} close={closeStats} stats = {getStats()}/></div>
      <div className="mb-10 relative w-full mt-4 xl:w-1/2 xl:my-10">
        {/* Content */}
        <div className="grid grid-cols-7 grid-rows-1 place-items-center relative z-50">
          {/* Top Bar */}
          <button className="col-start-1" onClick={() => {
            setAboutActive(true);
          }}><Info /></button>
          <button 
            disabled={localStorage.getItem('smashHeardleStats') ? false : true} 
            className="col-start-2 mr-8 xl:mr-16 disabled:opacity-50" onClick={()=> {
            setStatsActive(true);
          }}><StatsIcon /></button>
          <span className="col-start-3 col-span-3 w-full text-xl xl:text-3xl">Super Smash Bros. Heardle</span>
          <div>
            <DatePicker
            className='mt-1 xl:-mr-12 z-50'
            selected={date} 
            showPopperArrow={false}
            onChange={(newDate) => {doNewSong(newDate, false);}} 
            maxDate={new Date()}
            highlightDates={getCompleted()}
            customInput={
              <button className="relative">
                <Calendar calendarActive={calendarActive}/>
              </button>
            }
            />
          </div>
          <button className="flex justify-center rounded-lg col-start-7 -ml-8 xl:-ml-12" onClick={() => {
            doNewSong(null, true);
          }}><Dice randomActive={randomActive}/></button>
        </div>
        <hr className='w-full mt-1'/>
        <div className={`${endScreen ? "hidden" : ""} flex flex-col items-center relative w-full text-xs xl:text-base mt-8 z-0`}>
          {/* Previously Entered Guesses */}
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 mb-2 pl-4">{guesses[0]}</span>
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 mb-2 pl-4">{guesses[1]}</span>
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 mb-2 pl-4">{guesses[2]}</span>
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 mb-2 pl-4">{guesses[3]}</span>
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 mb-2 pl-4">{guesses[4]}</span>
          <span className="flex justify-start items-center border-solid border-black border-2 w-3/4 h-14 pl-4">{guesses[5]}</span>
        </div>
        <div className={`${endScreen ? "" : "hidden"} relative mt-8 z-30 mx-8 text-lg bg-slate-800 pb-8`}>
          {/* End Screen */}
          <div>{randomActive ? "This " : "Today's "} song was {song.title}</div>
          <div className='my-4'>{getCorrect()}</div>
          <div className="flex flex-row justify-center">{resultDivs[0]}</div>
          <span className={`${shareVisible ? "" : "hidden"} flex justify-center opacity-75 text-sm `}>Copied to clipboard!</span>
          <button className='bg-green-600 rounded-lg w-16 h-8' onClick={() => {
            navigator.clipboard.writeText(writeResults());
          }}>Share</button>
        </div>
        <div className={`${endScreen ? "" : "hidden"} flex w-full xl:w-full h-1/3 xl:h-[40%] relative justify-center bg-slate-800`}>
          {/* Player */}
          {song ?
            <div className="flex w-3/4 xl:w-3/4 z-10">
              <ReactPlayer 
                ref={player}
                url={`https://youtube.com/watch?v=${song.video_id}`}
                width="100%"
                height="85%"
                playing={playing}  
                volume={.8}
                controls={true}
                muted={false}
                onProgress={(state) => {
                  handleProgress(state);
                }}
                onReady={() => {
                  handleReady();
                }}
                progressInterval={10}
              /> 
            </div>
            : null}
        </div>
        
        <div className="flex flex-col justify-center items-center w-full h-3/4 absolute mb-16 xl:mb-0 bottom-0 z-0 ">
          {/* Heardle Controls */}
          {ready ? 
            <><div className={searching ? `${filteredSongs.length < 8 ? "flex flex-col justify-end" : ""} z-40 w-5/6 overflow-y-scroll h-96 mb-[5rem]` : "hidden"}>
                {filteredSongs.length > 0 ?
                  filteredSongs.map((song, index) => {
                    if (index < 100) {
                      return (
                        <div
                          className="flex justify-start items-center break-words text-sm pl-4 w-full h-16 border border-white bg-black hover:bg-slate-600 cursor-pointer"
                          key={index}
                          ref={search}
                          onClick={() => {
                            setSearching(false);
                            submit.current.value = cleanUp(song);
                          } }>
                          <span>{song}</span>
                        </div>
                      );
                    } else { return (null); }
                  }) : null}
              </div>
              <div className="flex flex-row justify-start my-2 w-3/4 absolute bottom-0 mb-52 z-10">
                <div className={`${currentGuesses[0] ? "" : "opacity-30"} w-[calc(100%/18)] bg-white h-6 border-r border-black`}></div>
                <div className={`${currentGuesses[1] ? "" : "opacity-30"} w-[calc(100%/18)] bg-white h-6 border-r border-black`}></div>
                <div className={`${currentGuesses[2] ? "" : "opacity-30"} w-[calc(100%/9)] bg-white h-6 border-r border-black`}></div>
                <div className={`${currentGuesses[3] ? "" : "opacity-30"} w-[calc(100%/(18/4))] bg-white h-6 border-r border-black`}></div>
                <div className={`${currentGuesses[4] ? "" : "opacity-30"} w-[calc(100%/(18/4))] bg-white h-6 border-r border-black`}></div>
                <div className={`${currentGuesses[5] ? "" : "opacity-30"} w-[calc(100%/3)] bg-white h-6 border-r border-black`}></div>
              </div>
              <div className="flex flex-row justify-start items-center h-6 w-3/4 absolute bottom-0 mb-52 z-10">
                <span
                  className={`flex h-6 bg-gray-900 opacity-50`}
                  style={{ width: `${parseFloat(progressPercent)}%` }}></span>
              </div>
              <div className="flex flex-row justify-between w-3/4 absolute bottom-0 mb-44 text-lg">
                <span>0:{currentSeconds < 10 ? "0" : ""}{currentSeconds}</span>
                <span>0:18</span>
              </div>
              <div className="flex flex-row justify-center items-center w-3/4 my-4 absolute bottom-0 mb-32 border border-black">
                <span className="absolute left-0 px-2"><Magnifying /></span>
                <input
                  disabled={endScreen}
                  type="text"
                  ref={submit}
                  className="w-full pl-10 py-2  text-black text-lg" placeholder="Any Guesses?"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.length > 0) {
                      processGuess(e.target.value);
                      e.target.value = "";
                      setSearching(false);
                    }
                  } }
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setSearching(true);
                      filterSongs(e.target.value);
                    } else {
                      setSearching(false);
                    }
                  } } />

              </div><div className="flex w-full justify-evenly items-center mb-4 absolute bottom-0">
                <button
                  disabled={endScreen}
                  className="mr-2 bg-slate-600 h-12 w-24 px-2 rounded-lg disabled:opacity-50" onClick={() => {
                    processGuess('', true);
                    submit.current.value = "";
                    setSearching(false);
                  } }>{guesses.length >= 5 ? "Give Up" : `Skip +${skip_times[guesses.length]}s`}</button>
                <div
                  disabled={endScreen}
                  className="flex justify-center items-center" onClick={() => {setPlaying(!playing); player.current.seekTo(0);}}>{playing ? <PauseIcon /> : <PlayIcon />}</div>
                <button
                  disabled={endScreen}
                  className="ml-2 bg-green-600 h-12 w-24 px-2 rounded-lg disabled:opacity-50"
                  onClick={() => {
                    if (submit.current.value.length > 0) {
                      processGuess(submit.current.value);
                      submit.current.value = "";
                      setSearching(false);
                    }
                  } }>Submit</button>
              </div>
              <span className='absolute bottom-0 -mb-4'>
                {calendarActive ? `You are playing the Heardle from ${date.toDateString()}.` : ""}
              </span>
              </>
          : 
          <span className="absolute bottom-0 mb-52 text-lg">Loading Player...</span>}
        </div>
      </div>
      {/* DEBUG CONTROLS */}
      {/* <button 
          className="absolute bottom-0 left-0 mb-6 ml-6 bg-red-500 h-12 w-36 px-2 rounded-lg text-black"
          onClick={() => {
            localStorage.removeItem('smashHeardleStats');
          }}>clear local storage [debug]</button>
      <button 
      className="absolute bottom-12 left-0 mb-8 ml-6 bg-blue-500 h-12 w-36 px-2 rounded-lg text-black"
      onClick={() => {
        console.log(localStorage.getItem('smashHeardleStats'));
      }}>log local storage [debug]</button> */}
    </div>
  );
}

export default App;
