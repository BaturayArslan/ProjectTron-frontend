import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./LoginPage.module.css";
import { LoginPageForm } from "../components/LoginPageForm";
import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

export const LoginPage = (props) => {
    const [oauthWindow, setOauthWindow] = useState(null);
    const navigate = useNavigate();

    const openFacebook = (e) => {
        e.preventDefault();
        let popup_window = window.open(
            "https://tron.hbarslan.com/oauth/",
            "newWindow",
            "width=300,height:250"
        );
        setOauthWindow(popup_window);
    };

    useEffect(() => {
        if (!oauthWindow) {
            return;
        }
        window.addEventListener("message", (event) => {
            let token = event.data;
            if (token.auth_token && token.refresh_token) {
                oauthWindow.close();
                props.handleTokens(token);
                localStorage.setItem("jwt_auth_token", token.auth_token);
                localStorage.setItem("jwt_refresh_token", token.refresh_token);
                let decoded_auth_token = jwtDecode(token.auth_token);
                if (decoded_auth_token.user_claims.user_name) {
                    navigate("/room/Rooms");
                } else {
                    navigate("/complete_login/complete");
                }
            }
        });
        const intervalID = setInterval(() => {
            oauthWindow.postMessage("check", "https://tron.hbarslan.com");
        }, 500);

        return (intervalID) => {
            clearInterval(intervalID);
            window.removeEventListener("message", window);
        };
    }, [oauthWindow]);

    return (
        <main className={styles.loginPageMain}>
            <div className={styles.loginBarResponsiveDiv}>
                <div className={styles.loginDiv}>
                    <div className={styles.logoDiv}>
                        <a className={styles.logoA}>Tron</a>
                    </div>
                    <i className={styles.bannerI}>Log in to your account</i>
                    <a
                        className={styles.facebook}
                        href="https://tron.hbarslan.com/oauth/"
                        onClick={openFacebook}
                    >
                        <img
                            className={styles.vectorIcon}
                            alt=""
                            src="../vector6.svg"
                        />
                        <i className={styles.facebookI}>Facebook</i>
                    </a>
                    <label className={styles.dividerLabel}>
                        <i className={styles.orI}>or</i>
                    </label>
                    <LoginPageForm handleTokens={props.handleTokens} />
                </div>
            </div>
            <div className={styles.backgroundDiv}>
                <img
                    className={styles.tronLegacyWallpapers1080P7Icon}
                    alt=""
                    src="../tronlegacywallpapers1080p78backgroundpictures@1x.png"
                />
            </div>
        </main>
    );
};

export default LoginPage;
