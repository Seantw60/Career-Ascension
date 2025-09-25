import MenuButton from "../common/MenuButton";
import "./StartMenu.css";

const StartMenu = ({ onPlay, onSettings, onQuit }) => {
  return (
    <div className="start-menu">
      <div className="title-box">
        <h1 className="game-title">Career Ascension</h1>
      </div>

      <div className="menu-buttons">
        <MenuButton onClick={onPlay}>Play</MenuButton>
        <MenuButton onClick={onSettings}>Settings</MenuButton>
        <MenuButton onClick={onQuit}>Quit</MenuButton>
      </div>

      <div className="version-box">v0.1</div>
    </div>
  );
};

export default StartMenu;
