import React, { Component } from "react";
import { Link } from "react-router-dom";
import LanreWebcamCapture from "./lanre_camera";
import "../App/App.css";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Header from "../Header/Header";


const getPadTime = (time) => time.toString().padStart(2,'0');

// Working Timer
export default function DipstikTimer() {
    const [timeLeft, setTimeLeft] = useState(0) 
    const [isCounting, setIsCounting] = useState(false) 

    const minutes = getPadTime(Math.floor(timeLeft / 60));
    const seconds = getPadTime(timeLeft - minutes * 60);

    useEffect(() => {
        
        const interval = setInterval(() => {
            isCounting && setTimeLeft ((timeLeft) => (timeLeft > 1 ? timeLeft - 1 : 0))
        }, 1000);
        return() => {
            clearInterval(interval);
        };
    },[isCounting])

    const handleReset = () => {
        setIsCounting(false);
        setTimeLeft(0);
    }

    const handle60s = () => {
        setTimeLeft(60);
        setIsCounting(true);
    }

    const handle120s = () => {
        setTimeLeft(120);
        setIsCounting(true);
    }


    let navigate = useNavigate();
    
    function skip() {
        setIsCounting(false);
        navigate("/dipstick-home/dipstik-timer/dipstik-camera", { replace: true });
    }


    if (timeLeft == 0 && isCounting){
        navigate("/dipstick-home/dipstik-timer/dipstik-camera", { replace: true });
    }


    return (
        <div>
            <Header />

            <div className="timer-container">

                <div className="timer"> 
                    <div className="time">
                        <span>{minutes}:</span>
                        <span>{seconds}</span>
                    </div>
                   
                </div>

                <div className="buttons">
                    <button className="timer-button" onClick={handle60s}>60s</button>
                    <button className="timer-button" onClick={handle120s}>120s</button>
                    <button className="timer-button" onClick={handleReset}>Reset</button>
                    <button className="timer-button" onClick={skip}>Skip</button>
                </div>
                
                <Link to="/dipstik-home">
					<button> Back </button>
				</Link>
            </div>


        </div>
    )
}

// source: https://www.youtube.com/watch?v=uxFoo32N8e0