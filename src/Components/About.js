import React from "react";


export default class About extends React.Component {

    handleClickOutside = (e) => {
        if (e.target.className === "w-full h-full bg-black opacity-70 absolute top-0 left-0") {
            return this.props.close();
        }
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        if(this.props.visible){
            return (
                <div className="flex w-full h-full justify-center items-center absolute top-0 left-0 z-[100]">
                    <div className="w-full h-full bg-black opacity-70 absolute top-0 left-0"></div>
                    <div className="w-2/3 xl:w-1/3 h-1/2 xl:h-1/2 bg-white z-30 opacity-95 text-black lg:text-lg -mt-64">
                        <div className="grid grid-cols-6 items-center grid-rows-1 h-1/6">
                            <span className="col-start-3 col-span-2 text-xl">
                                About 
                            </span>
                            <button onClick={this.props.close} className="col-start-6 text-black h-8 w-4  text-2xl place-self-center">X</button>
                        </div>
                        <hr className=" bg-black h-1" />
                        <div className="p-4">
                            This app is heavily inspired by <a href="https://heardle.app" className="underline">Heardle</a>. 
                            Currently, it includes songs from every Smash game, so expect duplicates, especially with Ultimate having such a huge soundtrack.
                        </div>
                        <div className="pl-4 pr-4 xl:pt-2">
                            Made from scratch by swc19, let me know if there are any issues!
                        </div>
                        <span className="pb-2"><a href="https://github.com/swc19" className="underline" >Github</a>,&nbsp;  
                        <a href="https://twitter.com/itsSdubs" className="underline" >Twitter</a>,&nbsp;
                        <a href="https://twitch.com/swc19" className="underline" >Twitch</a></span>
                        <div className="align-bottom pl-4 pr-4 md:mt-6 lg:mt-8">
                            If you enjoy this game, please consider supporting me on Ko-Fi. <br /><br />
                            <a href="https://ko-fi.com/swc19" target="_blank" rel="noreferrer">
                                <button
                                className="bg-slate-300 w-1/2 xl:w-1/3 rounded-md">
                                    swc19's Ko-Fi
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }
    }
}