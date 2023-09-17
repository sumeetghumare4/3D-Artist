import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import './Style/Generate.css';
import img1 from '../images/img1.png';
import img2 from '../images/img2.png';
import img3 from '../images/img3.png';

const Generate = () => {
  const [selectedScene, setSelectedScene] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [prompts, setPrompts] = useState({});
  const [renderedImage, setRenderedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSceneSelection = (scene) => {
    setSelectedScene(scene);
    setSelectedItem(null);
    setPrompts({});
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowPromptInput(true);
  };

  const handlePromptSubmit = (e) => {
    e.preventDefault();
    setPrompts({
      ...prompts,
      [selectedItem]: promptText,
    });
    setPromptText('');
  };

  const SCENE_NAMES = {
    1: "Living Room",
    2: "Bedroom",
    3: "Office Space",
  };

  const SCENE_ITEMS = {
    "Living Room": ["Sofa", "Fireplace", "Table", "Lamp"],
    "Bedroom": ["Bed", "Nightstand", "Lamp", "Closet"],
    "Office Space": ["Desk", "Chair", "Bookshelf", "Plant"],
  };

  const funFacts = [
    'The first 3D printer was created in the mid-1980s by Chuck Hull.',
    '3D modeling can be used in various industries, including film, architecture, healthcare, and video games.',
    // Add more fun facts here
  ];

  const [funFactIndex, setFunFactIndex] = useState(0);

  const rotateFunFacts = () => {
    const intervalId = setInterval(() => {
      const newIndex = (funFactIndex + 1) % funFacts.length;
      setFunFactIndex(newIndex);
    }, 5000);
  
    return () => clearInterval(intervalId);
  };
  
  useEffect(rotateFunFacts, [funFactIndex]);

  const selectedItems = Object.keys(prompts);

  const ROOM_TYPE_MAPPING = {
    "Office Space": "office",
    "Living Room": "livingroom",
    "Bedroom": "bedroom"
  };

  const selectedSceneName = SCENE_NAMES[selectedScene] || '-';
  const items = SCENE_ITEMS[selectedSceneName] || [];
  const roomTypeValue = ROOM_TYPE_MAPPING[selectedSceneName];

  const handleGenerateClick = async () => {
    setIsLoading(true);
    const promptValues = Object.values(prompts);

    console.log('Starting request to generate with prompts:', promptValues);
    try {
      const response = await fetch('http://localhost:8000/start_task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompts: promptValues,
          user_defined_categories: selectedItems,
          room_type: roomTypeValue
        }),
      });
      const result = await response.json();
      console.log('Received response from backend:', result);
      if (result.status === 'success') {
        const taskId = result.task_id;
        const pollInterval = setInterval(async () => {
          const statusResponse = await fetch(`http://localhost:8000/task_status/${taskId}`);
          const statusResult = await statusResponse.json();
          if (statusResult.status === 'completed') {
            clearInterval(pollInterval);
            const imageUrl = `${statusResult.result}?timestamp=${new Date().getTime()}`;
            setRenderedImage(imageUrl);
            setIsLoading(false);
          }
        }, 1000);
      } else {
        console.error('Error starting task', result);
      }
    } catch (error) {
      console.error('Error making request to start task', error);
    }
  };
  
  function downloadImage() {
    if (renderedImage) {
      fetch(renderedImage)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'rendered_image.png';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading image:', error);
        });
    } else {
      console.log('No rendered image to download');
    }
  }

  return (
    <div className="container generate-container">
      <h1 className="title">
        Generate <span className="gradient-text">Your Design</span><br />
      </h1>

      <h3>
        <strong>Please choose a scene to place your object or</strong>{''}
        <Link to="/blank" className="underline-link">start a blank project</Link>
      </h3>

      <div className="scene-selection">
        {[
          { scene: 1, name: "Living Room", image: img1 },
          { scene: 2, name: "Bedroom", image: img2, comingSoon: true },
          { scene: 3, name: "Office Space", image: img3, comingSoon: true },
        ].map(({ scene, name, image, comingSoon }) => (
          <div className="scene" key={scene}>
            <div
              className={`scene-box ${selectedScene === scene ? "selected" : ""} ${
                comingSoon ? "disabled" : ""
              }`}
              onClick={() => !comingSoon && handleSceneSelection(scene)}
            >
              <img src={image} alt={`Scene`} />
            </div>
            <div className="scene-text">
              Scene {scene}: {name}
              {comingSoon && <div className="coming-soon">Coming soon</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="scene-selected">
        <span className="selected-label">Selected:</span>
        <span className="selected-scene">{selectedSceneName}</span>
      </div>

      <h4>What would you like to redesign?</h4>
      <div className="comment-container"> 
        <p className="comment-under-design">(You can specify multiple objects at once)</p>
      </div>
      <div className="items-container">
        {items.map((item) => (
          <button
            key={item}
            className={`item-button ${selectedItem === item ? 'selected' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {showPromptInput && (
        <div className="prompt-container">
          <label htmlFor="prompt-input">Enter your prompt for {selectedItem}:</label>
          <form onSubmit={handlePromptSubmit}>
            <input
              className="prompt-input"
              type="text"
              id="prompt-input"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Enter your prompt..."
            />
          </form>
        </div>
      )}

      <div className="selected-prompts">
        <h4>Selected Prompts:</h4>
        {Object.entries(prompts).map(([item, prompt], index) => (
          <div key={index} className="prompt-item">
            <span>{item}: </span>
            <span>{prompt}</span>
          </div>
        ))}
        <button className="generate-button" onClick={handleGenerateClick}>
          Generate
        </button>
      </div>

      

      {isLoading && (
        <div className="loading-section">
          <p>Don't worry, we are making your models. Here are some fun facts while you are waiting!</p>
          <div className="loading-container">
            <ReactLoading type={"cubes"} color={"#333"} height={'100%'} width={'100%'} />
          </div>    
          <div className="fun-fact-container">
            <p>{funFacts[funFactIndex]}</p>
          </div> 
        </div>
      )}
      {renderedImage && (
        <div className="generated-image-container">
          <img src={renderedImage} alt="Generated Design" key={renderedImage} />
          <button className="download-button" onClick={downloadImage}>Download .png</button>
        </div>
      )}

      <div className="empty-space"></div>
    </div>
  );
};

export default Generate;
