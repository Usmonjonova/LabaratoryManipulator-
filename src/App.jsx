import './App.css';
import { useEffect, useRef, useState } from 'react';
import arrowDown from './assets/images/arrow-bar-down.svg';
import arrowLeft from './assets/images/arrow-bar-left.svg';
import arrowRight from './assets/images/arrow-bar-right.svg';
import arrowUp from './assets/images/arrow-bar-up.svg';
import { formatDateTime, generateOptimized, generateOriginal } from './functions';

function sortAndCount(input) {
  let result = [];
  let count = 1;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === input[i + 1]) {
      count++;
    } else {
      result.push([count.toString(), input[i]]);
      count = 1;
    }
  }
  return result;
}

function App() {
  const buttonRef = useRef([]);
  const inputRef = useRef(null);
  const [box, setBox] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [formatedValue, setFormatedValue] = useState([])
  const storedHistory = JSON.parse(localStorage.getItem('commandHistory'));
  const [isFocused, setIsFocused] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [shake, setShake] = useState(false);
  const arrowKeys = [
    { name: "arrow Up", img: arrowUp, firstChar: "U" },
    { name: "arrow Left", img: arrowLeft, firstChar: "L" },
    { name: "arrow Right", img: arrowRight, firstChar: "R" },
    { name: "arrow Down", img: arrowDown, firstChar: "D" },
  ];
  const validCommands = /^[UDLR]+$/;

  const greenIndexes = [15, 41, 28, 56, 73];

  const gridItems = Array.from({ length: 100 }, (_, index) => (
    <div
      id={`grid-item-${index}`}
      key={index}
      className={`w-10 h-10 flex items-center justify-center text-sm border ${greenIndexes.includes(index) ? 'bg-green-400' : (index === box ? 'bg-transparent' : 'bg-gray-100 border-gray-300')}`}
    >
    </div>
  ));

  function handleChange(e) {
    const value = e.target.value.toUpperCase();
    if (validCommands.test(value) || value === '') {
      setInputValue(value);
      setFormatedValue(sortAndCount(value))
      console.log();

    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }




  function handleDirection(direction, index) {
    setIsFocused(index);
    setActiveButton(index);

    setTimeout(() => {
      setActiveButton(null);
    }, 200);

    let newBox = box;

    switch (direction) {
      case 'U':
        newBox = box - 10;
        if (newBox >= 0) setBox(newBox);
        break;
      case 'L':
        newBox = box - 1;
        if (newBox % 10 !== 9 && newBox >= 0) setBox(newBox);
        break;
      case 'D':
        newBox = box + 10;
        if (newBox < 100) setBox(newBox);
        break;
      case 'R':
        newBox = box + 1;
        if (newBox % 10 !== 0 && newBox < 100) setBox(newBox);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    let commands = [...inputValue];
    let currentBox = box;

    function executeNextCommand() {
      if (commands.length === 0) return;

      const direction = commands.shift();
      switch (direction) {
        case 'U':
          currentBox -= 10;
          if (currentBox >= 0) setBox(currentBox);
          break;
        case 'L':
          currentBox -= 1;
          if (currentBox % 10 !== 9 && currentBox >= 0) setBox(currentBox);
          break;
        case 'D':
          currentBox += 10;
          if (currentBox < 100) setBox(currentBox);
          break;
        case 'R':
          currentBox += 1;
          if (currentBox % 10 !== 0 && currentBox < 100) setBox(currentBox);
          break;
        default:
          break;
      }

      setTimeout(executeNextCommand, 300);
    }

    executeNextCommand();
    handleHistory();
  }

  function handleHistory() {
    const existingHistory = JSON.parse(localStorage.getItem('commandHistory')) || [];

    const newEntry = {
      original: generateOriginal(formatedValue),
      optimized: generateOptimized(formatedValue),
      timeStamp: formatDateTime(),
    };

    existingHistory.push(newEntry);
    localStorage.setItem('commandHistory', JSON.stringify(existingHistory));
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      let direction = null;
      let index = null;

      switch (event.key) {
        case "ArrowUp":
          direction = "U";
          index = 0;
          break;
        case "ArrowLeft":
          direction = "L";
          index = 1;
          break;
        case "ArrowDown":
          direction = "D";
          index = 3;
          break;
        case "ArrowRight":
          direction = "R";
          index = 2;
          break;
        default:
          return;
      }

      handleDirection(direction, index);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [box]);

  return (
    <div className="lg:container lg:mx-auto px-8 h-screen">
      <h1 className="text-left mt-3 mb-3 text-4xl font-semibold">Laboratory Manipulator Control</h1>
      <div className="flex justify-around">
        <div className="w-[700px] h-[650px] border border-gray-300 p-4 rounded-xl">
          <h2 className="font-semibold mb-3 text-3xl">Control Panel</h2>
          <div className="grid grid-cols-10 gap-2 relative">
            {gridItems}
            <div
              className="absolute transition-all duration-300"
              style={{
                top: `${Math.floor(box / 10) * 3}rem`,
                left: `${(box % 10) * 4.75}rem`,
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: greenIndexes.includes(box) ? 'linear-gradient(to top left, #00FF00 50%, #0000FF 50%)' : '#0000FF',
              }}
            />
          </div>
          <div className="flex justify-between align-items-center mt-4">
            <div className="direction">
              {arrowKeys.map((key, index) => (
                <button
                  key={index}
                  ref={(el) => (buttonRef.current[index] = el)}
                  style={{
                    backgroundColor: activeButton === index ? "black" : "#2f2f2f",
                  }}
                  className={`item item-${index + 1} ${isFocused === index ? "focus" : ""}`}
                  onClick={() => handleDirection(key.firstChar, index)}
                >
                  <img src={key.img} alt={key.name} />
                </button>
              ))}
            </div>
            <form className="w-[70%]" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="command" className="form-label font-semibold">Enter command</label>
                <input
                  ref={inputRef}
                  type="text"
                  id="command"
                  className={`form-control ${shake ? 'animate-shake' : ''}`} // Animatsiya klassi
                  placeholder="U, R, D, L"
                  value={inputValue}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="btn btn bg-black text-white btn-lg">Execute Command</button>
            </form>
          </div>
        </div>
        <div className="w-[700px] h-[650px] border border-gray-300 p-4 rounded-xl">
          <h2 className="font-semibold mb-3 text-3xl">Command History</h2>
          <table className="table caption-top">
            <caption>List of users</caption>
            <thead>
              <tr>
                <th scope="col">Original</th>
                <th scope="col">Optimized</th>
                <th scope="col">TimeStamp</th>
              </tr>
            </thead>
            <tbody>
              {storedHistory ? (
                storedHistory.map((history, index) => (
                  <tr key={index}>
                    <th scope="row">{history?.original}</th>
                    <td>{history?.optimized}</td>
                    <td>{history?.timeStamp}</td>
                  </tr>
                ))
              ) : (
                <p>No history</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
