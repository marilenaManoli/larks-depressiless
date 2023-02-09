import { useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const logout = () => {
		sessionStorage.clear();	// clear the session, including the token that keeps us logged in
		navigate("/", { replace: true }); // send us to the "/" URL
		window.location.reload(false);	// refresh the page
	};

	return (
		<header className="App-header-primary">
				<h1 id="header_name"> LARKS APP</h1>
				<div id="header_buttons">
					<button data-cy="logoutBttn" id="logout_button" className="logout-button" onClick={logout}>
						Logout
					</button>
				</div>
		</header>
	);
};

export default Header;
