import React from 'react';
import ChatBox from './componets/ChatBot';
import "./style/App.css"
const App = () => {
  return (
    <div className="App">
      <div className="d-flex justify-content-center pt-1">
        <a href="https://www.facebook.com/ndphii.2002/" target="_blank" rel="noreferrer" className="block-icon col-2"><i className="fa-brands fa-facebook" id="fb"></i><p>Facebook</p></a>
        <a href="https://github.com/ndphii" target="_blank" rel="noreferrer" className="block-icon col-2"><i className="fa-brands fa-github" id="gh"></i><p>Github</p></a>
        <a href="https://www.pinterest.com/ndphii/" target="_blank" rel="noreferrer" className="block-icon col-2"><i className="fa-brands fa-pinterest" id="pt"></i><p>Pinterest</p></a>
        <a href="mailto:phind76.spam@gmail.com" target="_blank" rel="noreferrer" className="block-icon col-2"><i className="fa-brands fa-google-plus" id="gg"></i><p>Google</p></a>
      </div>
      <ChatBox />

    </div>
  );
};

export default App;
