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
                    <div className=" w-2/3 xl:w-1/5 h-1/3 xl:h-1/2 bg-white z-30 opacity-80 text-black xl:text-lg -mt-64">
                        <div className="grid grid-cols-6 items-center grid-rows-1 h-1/6 ">
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
                        <div className="pt-4">
                            Made by swc19
                        </div>
                        <span className="pb-2"><a href="https://github.com/swc19" className="underline" >Github</a>, 
                        <a href="https://twitter.com/itsSdubs" className="underline" >Twitter</a>, 
                        <a href="https://twitch.com/swc19" className="underline" >Twitch</a></span>
                    </div>
                </div>
            )
        }
    }
}