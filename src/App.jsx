import './App.css';
import { useEffect, useState } from 'react';
import arrowDown from './assets/images/arrow-bar-down.svg';
import arrowLeft from './assets/images/arrow-bar-left.svg';
import arrowRight from './assets/images/arrow-bar-right.svg';
import arrowUp from './assets/images/arrow-bar-up.svg';
import { formatDateTime, generateOptimized, generateOriginal, sortAndCount } from './functions';

function App() {
  const [box, setBox] = useState(0);
  const [inputValue, setInputValue] = useState([])
  const storedHistory = JSON.parse(localStorage.getItem('commandHistory'));

  const gridItems = Array.from({ length: 100 }, (_, index) => (
    <div
      id={`grid-item-${index}`}
      key={index}
      className={`w-10 h-10 flex items-center justify-center text-sm border ${index === box ? 'bg-blue-400 text-white' : 'bg-gray-100 border-gray-300'}`}
    >
    </div>

  ));

  function handleChange(e) {
    setInputValue(sortAndCount(e.target.value));
  }

  function handleDirection(direction) {
    switch (direction) {
      case 'U':
        setBox((prevBox) => prevBox - 10);
        break;
      case 'L':
        setBox((prevBox) => prevBox - 1);
        break;
      case 'D':
        setBox((prevBox) => prevBox + 10);
        break;
      case 'R':
        setBox((prevBox) => prevBox + 1);
        break;
      default:
        break;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    inputValue.forEach((value) => {

      switch (value[1]) {
        case 'U':
          setBox((prevBox) => prevBox - 10 * Number(value[0]));
          break;
        case 'L':
          setBox((prevBox) => prevBox - Number(value[0]));
          break;
        case 'D':
          setBox((prevBox) => prevBox + 10 * Number(value[0]));
          break;
        case 'R':
          setBox((prevBox) => prevBox + Number(value[0]));
          break;
        default:
          break;
      }
    });

    handleHistory()
  }

  function handleHistory() {
    const commandHistory = [
      {
        original: generateOriginal(inputValue),
        optimized: generateOptimized(inputValue),
        timeStamp: formatDateTime()
      },
    ]

    localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
  }

  return (
    <div className="lg:container lg:mx-auto px-8 h-screen">
      <h1 className="text-left mt-3 mb-3 text-4xl font-semibold">
        Laboratory Manipulator Control
      </h1>
      <div className="flex justify-around">
        <div className="w-[700px] h-[650px] border border-gray-300 p-4 rounded-xl">
          <h2 className="font-semibold mb-3 text-3xl">Control Panel</h2>
          <div className="grid grid-cols-10 gap-2">
            {gridItems}
          </div>
          <div className="flex justify-between align-items-center mt-4">
            <div className="direction">
              <button onClick={() => handleDirection("U")} className="item item-1"><img src={arrowUp} alt="arrow up" /></button>
              <button onClick={() => handleDirection("L")} className="item item-2"><img src={arrowLeft} alt="arrow left" /></button>
              <button onClick={() => handleDirection("D")} className="item item-4"><img src={arrowDown} alt="arrow down" /></button>
              <button onClick={() => handleDirection("R")} className="item item-3"><img src={arrowRight} alt="arrow right" /></button>
            </div>
            <form className="w-[70%]" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="command" className="form-label font-semibold">Enter command</label>
                <input onChange={handleChange} type="text" className="form-control" id="command" aria-describedby="emailHelp" placeholder='U, R, D, L' />
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
              {
                storedHistory ? (
                  storedHistory.map((history, index) => (
                    <tr key={index}>
                      <th scope="row">{history?.original}</th>
                      <td>{history?.optimized}</td>
                      <td>{history?.timeStamp}</td>
                    </tr>
                  ))
                ) : (
                    <p>No history</p>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
