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
import { Test } from "./pages/Test";
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
                "http://localhost:5000/auth/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokens.refresh_token}`,
                    },
                }
            );
            localStorage.setItem("jwt_auth_token", res.data.auth_token);
            if (pathname === "/auth/login") {
                navigate("/room/Rooms");
            }
            setTokens({
                auth_token: res.auth_token,
                refresh_token: localStorage.getItem("jwt_refresh_token"),
            });
        } catch (error) {
            if (error) {
                localStorage.removeItem("jwt_auth_token");
                localStorage.removeItem("jwt_refresh_token");
                console.log("Refresh token error: ", error);
                navigate("/auth/login");
            } else {
            }
        }
    };

    const isTokenValid = () => {
        if (!tokens.auth_token) {
            return false;
        }
        const decoded_auth_token = jwtDecode(tokens.auth_token);
        let time = decoded_auth_token.exp * 1000 - Date.now();
        if (time > 0) {
            return true;
        } else {
            return false;
        }
    };

    const handleTokens = (tokens) => {
        setTokens(tokens);
    };

    useEffect(() => {
        if (!tokens.auth_token) {
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
                element={<Test messages={[]} players={[]} roomInfo={{}} />}
            />
        </Routes>
    );
}
export default App;
