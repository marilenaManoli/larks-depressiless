import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faArrowsRotate, faPaperPlane, faUpload, faCameraRotate, faCameraAlt, faCameraRetro, faVideoCamera, faPlaneArrival, faPlaneCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import * as cvstfjs from "@microsoft/customvision-tfjs";

let BASEURL = "";
process.env.NODE_ENV === "development"
	? (BASEURL = process.env.REACT_APP_DEV)
	: (BASEURL = process.env.REACT_APP_PROD);

//This component is used to take pictures
//pictures are stored in the imageSrc variable after taking it
//Not sure what to do after picture is stored in the imageSrc variable
const LanreWebcamCapture = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageSent, setImageSent] = useState(false);
  const [backFacing, setBackFacing] = React.useState(true);
	let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", imageSrc);
    setImageSent(true);
    const response = await axios(BASEURL+"dipstik/upload",{
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response);
      console.log(response.data);

      // save the results in session storage
      sessionStorage.setItem("bilirubin",response.data.bilirubin);
      sessionStorage.setItem("blood", response.data.blood);
      sessionStorage.setItem("glucose", response.data.glucose);
      sessionStorage.setItem("ketones", response.data.ketones);
      sessionStorage.setItem("leukocytes", response.data.leukocytes);
      sessionStorage.setItem("nitrite", response.data.nitrite);
      sessionStorage.setItem("ph", response.data.ph);
      sessionStorage.setItem("protein", response.data.protein);
      sessionStorage.setItem("specific_gravity", response.data.specific_gravity);
      sessionStorage.setItem("urobilinogen", response.data.urobilinogen);

      if(response != null) {
        navigate("/dipstik/dipstik-results")
      }
    })
    .catch(error=> {
      console.error(error);
    });

    console.log(response);

  }

//takes pictures without flash
  const handleTakePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc);
  };

//resets picture source and retakes picture
const handleRetakePicture = () => {
  setImageSrc(null);
};

  // Using button to change what camera is being used
	// Should work based on MDN documentation: https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
	// But I cannot test properly as its running on a laptop.
	// const switchCameraFacing = React.useCallback(() => {
  const switchCameraFacing = React.useCallback(() => {
		if (backFacing){
			setBackFacing(false);
		}
		else{
			setBackFacing(true);
		}
	
	},[backFacing]);

  
//  // //**************************************************************** 
//  // // COMBINED
  // 	Trying to do the dimensions stuff.
	// Rounded to floats to ensure dimensions used here make sense, only issue I see right now - the videos will record in different format each time.
	const size = useWindowSize();
	var cameraHeight = Math.round(size.height);
  var cameraWidth = Math.round(size.width);

	// This code attempts for the dimensions of the camera to be in a 1:1 aspect ratio, by taking the previous measurements of the size of the screen.
	// Takes the smaller of the two calcs of width and height, to ensure it will fit on the screen.
	var minValue = cameraWidth;

  if (cameraWidth > 400){
    cameraWidth = 400;
  }

  if (cameraHeight > 719) {
    cameraHeight = 719;
  }

  if (cameraHeight < minValue){
      minValue = cameraHeight;
      cameraWidth = minValue;
  }else{
      cameraHeight = cameraHeight;
      cameraWidth = cameraWidth * 0.9;
  };

	var cameraConstraints;

  // show back camera first
	if (backFacing) {
    cameraConstraints = {
			width: {
				// min: cameraWidth,
				// max: cameraWidth,
			},
			height: {
				// min: cameraHeight,
				// max: cameraHeight,
			},
			facingMode: { exact: "environment" },
		};
		
	} else {
    var x = "user";
		cameraConstraints = {
			width: {
				// min: cameraWidth,
				// max: cameraWidth,
			},
			height: {
				// min: cameraHeight,
				// max: cameraHeight,
			},
			facingMode: { x },
		};
	}
// // // COMBINED END
// // //****************************************************************


//two buttons, one for taking pictures with flash and one for without
  return (
    <>
    {/* Show camera */}
    <div>
    {!imageSrc && imageSent == false &&  (
			<>
        <div className="camera-container">
          <div className="overlay-ancestor">
            <div className="camera-overlay"></div>
            <Webcam className="lanre-webcam" videoConstraints={cameraConstraints} ref={webcamRef} marginWidth={"0px"} screenshotQuality="1" />
            <div className="camera-buttons-container">
              {/* <button onClick={switchCameraFacing} className="camera-button"><FontAwesomeIcon icon={faCameraRotate} className="camera-icon"/></button> */}
              {/* <button onClick={handleTakePicture} className="camera-button"><FontAwesomeIcon icon={faCamera} className="camera-icon"/></button> */}
              <button onClick={handleTakePicture} className="camera-button"></button>
            </div>
          </div>
        </div>
      </>
		)}
    </div>

    {/* Show taken image */}
      <div>
        {imageSrc && imageSent == false && (
          <>
            <div className="taken-pic-container">
              <img src={imageSrc} width={minValue} alt="Captured photo" />
              <div className="taken-pic-buttons-overlay-container">
                <button onClick={handleRetakePicture} className="camera-button"><FontAwesomeIcon icon={faArrowsRotate} className="camera-icon"/></button>
                <button onClick={handleSubmit} className="camera-button"><FontAwesomeIcon icon={faPaperPlane} className="camera-icon"/></button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Show a message that results are being processed */}
      <div>
        {imageSrc && imageSent == true  && (
          <div >
            <div className="loader-container">
              <div className="spinner"></div>
            </div>
            <h1> Processing your results</h1>
          </div>
        )}
      </div>
    </>
  );
};

// Found at:
// https://usehooks.com/useWindowSize/
function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = React.useState({
	  width: undefined,
	  height: undefined,
	});
	React.useEffect(() => {
	  // Handler to call on window resize
	  function handleResize() {
		// Set window width/height to state
		setWindowSize({
		  width: window.innerWidth,
		  height: window.innerHeight,
		});
	  }
	  // Add event listener
	  window.addEventListener("resize", handleResize);
	  // Call handler right away so state gets updated with initial window size
	  handleResize();
	  // Remove event listener on cleanup
	  return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
  }

export default LanreWebcamCapture;
