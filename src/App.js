import {
    Routes,
    Route,
    useNavigationType,
    useLocation,
    Navigate,
    useNavigate,
} from "react-router-dom";
import LobyPage from "./pages/LobyPage";
import RoomsPage from "./pages/RoomsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CompleteLoginPage from "./pages/CompleteLoginPage";
import { GamePage } from "./pages/GamePage";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

function App() {
    const action = useNavigationType();
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    const [tokens, setTokens] = useState({
        auth_token: localStorage.getItem("jwt_auth_token"),
        refresh_token: localStorage.getItem("jwt_refresh_token"),
    });

    const refresh_auth_token = async () => {
        try {
            let res = await axios.post(
                "https://tron.hbarslan.com/auth/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokens.refresh_token}`,
                    },
                }
            );
            localStorage.setItem("jwt_auth_token", res.data.auth_token);
            if (location.pathname === "/auth/login") {
                navigate("/room/Rooms");
            }
            setTokens((prev) => {
                return { ...prev, auth_token: res.data.auth_token };
            });
        } catch (error) {
            localStorage.removeItem("jwt_auth_token");
            localStorage.removeItem("jwt_refresh_token");
            setTokens((prev) => {
                return { auth_token: null, refresh_token: null };
            });
            console.log("Refresh token error: ", error);
            navigate("/auth/login");
        }
    };

    const isTokenValid = () => {
        if (!tokens.refresh_token || !tokens.auth_token) {
            return false;
        }
        const decoded_refresh_token = jwtDecode(tokens.refresh_token);
        const decoded_auth_token = jwtDecode(tokens.auth_token);
        let auth_time = decoded_auth_token.exp * 1000 - Date.now();
        let refresh_time = decoded_refresh_token.exp * 1000 - Date.now();
        if (auth_time > 0 && refresh_time > 0) {
            return true;
        } else {
            return false;
        }
    };

    const isRefreshValid = () => {
        const decoded_refresh_token = jwtDecode(tokens.refresh_token);
        let refresh_time = decoded_refresh_token.exp * 1000 - Date.now();
        if (refresh_time > 0) {
            return true;
        }
        return false;
    };

    const handleTokens = (tokens) => {
        setTokens(tokens);
    };

    useEffect(() => {
        if (!tokens.auth_token || !tokens.refresh_token) {
            return;
        }
        let decoded_auth_token = jwtDecode(tokens.auth_token);
        let time = decoded_auth_token.exp * 1000 - Date.now() - 10000;
        let timemoutID = setTimeout(refresh_auth_token, time);
        return (timemoutID) => clearTimeout(timemoutID);
    }, [tokens]);

    useEffect(() => {
        if (action !== "POP") {
            window.scrollTo(0, 0);
        }
    }, [action]);

    useEffect(() => {
        let title = "";
        let metaDescription = "";

        //TODO: Update meta titles and descriptions below
        switch (pathname) {
            case "/":
                title = "";
                metaDescription = "";
                break;
            case "/roomspage":
                title = "";
                metaDescription = "";
                break;
            case "/auth/register":
                title = "";
                metaDescription = "";
                break;
            case "/auth/login":
                title = "";
                metaDescription = "";
                break;
        }

        if (title) {
            document.title = title;
        }

        if (metaDescription) {
            const metaDescriptionTag = document.querySelector(
                'head > meta[name="description"]'
            );
            if (metaDescriptionTag) {
                metaDescriptionTag.content = metaDescription;
            }
        }
    }, [pathname]);

    return (
        <Routes>
            {isTokenValid() ? (
                <Route
                    exact
                    path="/"
                    element={<Navigate replace to="/room/Rooms" />}
                />
            ) : (
                <Route
                    exact
                    path="/"
                    element={<Navigate replace to="/auth/login" />}
                />
            )}

            <Route
                exact
                path="/room/Rooms"
                element={
                    <RoomsPage isTokenValid={isTokenValid} tokens={tokens} />
                }
            />

            <Route path="/room/:roomId" element={<LobyPage />} />

            <Route path="/auth/register" element={<RegisterPage />} />

            <Route
                path="/auth/login"
                element={<LoginPage handleTokens={handleTokens} />}
            />

            <Route
                path="/complete_login/complete"
                element={<CompleteLoginPage />}
            />

            <Route
                path="/test/game"
                element={<GamePage messages={[]} players={[]} roomInfo={{}} />}
            />
        </Routes>
    );
}
export default App;
