import "./MenuButton.css";

const MenuButton = ({ onClick, children }) => {
  return (
    <button className="menu-btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default MenuButton;