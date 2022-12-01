import React from "react";


export default class Stats extends React.Component {
    handleClickOutside = (e) => {
        if (e.target.className === "w-full h-full bg-black opacity-70 absolute top-0 left-0") {
            return this.props.close();
        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }


    displayStats() {
        if(this.props.stats){
            const stats = JSON.parse(this.props.stats);
            const gameStats = stats["Stats"];
            const statDisplay = {
                one: gameStats.inOne,
                two: gameStats.inTwo,
                three: gameStats.inThree,
                four: gameStats.inFour,
                five: gameStats.inFive,
                six: gameStats.inSix,
                miss: gameStats.miss,
                total: gameStats.total,
                randomCompleted: gameStats.random.numCompleted,
                randomCorrects: gameStats.random.numWon,
            }
            return statDisplay;
        }
        else{
            this.props.close();
        }
    }
    render() {
        if(this.props.visible){
            return (
                <div className="flex w-full h-full justify-center items-center absolute top-0 left-0 z-[100]">
                    <div className="w-full h-full bg-black opacity-70 absolute top-0 left-0"></div>
                    <div className="w-2/3 xl:w-1/3 h-1/2 bg-white z-30 opacity-95 text-black xl:text-lg -mt-64">
                        <div className="grid grid-cols-6 items-center grid-rows-1 h-1/6 ">
                            <span className="col-start-3 col-span-2 text-xl">
                                Stats 
                            </span>
                            <button onClick={this.props.close} className="col-start-6 text-black h-8 w-4  text-2xl place-self-center">X</button>
                        </div>
                        <hr className=" bg-black h-1" />
                        <div className="grid grid-cols-7 items-end justify-items-center grid-rows-1 h-1/3 pt-4 text-sm text-white">
                            <div style={{height: `max(calc(100%*${this.displayStats().one/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().one}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().two/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().two}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().three/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().three}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().four/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().four}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().five/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().five}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().six/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().six}</div>
                            <div style={{height: `max(calc(100%*${this.displayStats().miss/this.displayStats().total}), 20%)`}} className={`w-1/2 bg-black rounded-t-md`}>{this.displayStats().miss}</div>
                        </div>
                        <hr className=" bg-black h-1 -mt-0.5" />
                        <div className="grid grid-cols-7 items-center grid-rows-1 h-1/8">
                            <span>1</span>
                            <span>2</span>
                            <span>3</span>
                            <span>4</span>
                            <span>5</span>
                            <span>6</span>
                            <span>X</span>
                        </div>
                        <hr className=" bg-black h-1 -mt-0.5" />
                        <div className="grid grid-cols-3 items-center grid-rows-1 h-1/6 pt-8">
                            <div>
                                {this.displayStats().total}<br />
                                Played
                            </div>
                            <div>
                                {this.displayStats().total - this.displayStats().miss}<br />
                                Won
                            </div>
                            <div>
                                {+((this.displayStats().total - this.displayStats().miss)/(this.displayStats().total)*100).toFixed(2)}%<br />
                                Win Rate
                            </div>
                        </div>
                        <div className="grid grid-cols-2 items-center grid-rows-1 h-1/6 pt-8">
                            <div>
                                {this.displayStats().randomCompleted}<br />
                                Random Heardles
                            </div>
                            <div>
                                {this.displayStats().randomCorrects}<br />
                                Random Wins
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }

}

