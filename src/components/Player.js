import "antd/dist/antd.css";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
import { ErrorMessage } from "./ErrorMessage";
import styles from "../pages/LobyPage.module.css";
import React from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

export const Player = (props) => {
    const [errors, setErrors] = useState([]);
    const handleClick = () => {
        const get_friend_profile = async (user_id, setPopUp) => {
            try {
                const url = new URL("http://localhost:5000/user/profile");
                url.search = new URLSearchParams({ user_id: user_id });
                const auth_token = localStorage.getItem("jwt_auth_token");
                const decoded_auth_token = jwtDecode(auth_token);
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                if (user_id === decoded_auth_token.user_claims.user_id) {
                    setPopUp({
                        ...res.data.message,
                        isFriend: false,
                        isSelfProfile: true,
                        type: "USERPROFILE",
                    });
                } else {
                    let friend = props.myProfile.friends.find((friend) => {
                        return friend._id === user_id;
                    });
                    setPopUp({
                        ...res.data.message,
                        isFriend: friend && true,
                        isSelfProfile: false,
                        type: "USERPROFILE",
                    });
                }
            } catch (error) {
                setErrors((prev) => {
                    return ["Couldnt get user profile"];
                });
            }
        };
        get_friend_profile(props.info.user_id, props.handlePopUpInfo);
    };
    return (
        <div className={styles.playersDiv}>
            <div className={styles.playerDiv}>
                <div className={styles.playerInfoDiv}>
                    <button
                        className={styles["avatar" + props.info.avatar]}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    />
                    <div className={styles.rEDTEAMDiv}>
                        {props.info.user_name}
                    </div>
                </div>
                <div className={styles.playerStatsDiv}>
                    {props.isAdmin && (
                        <img
                            className={styles.adminStatDiv}
                            alt=""
                            src="../emojionestar.svg"
                        />
                    )}
                    {props.info.is_ready && (
                        <img
                            className={styles.adminStatDiv}
                            alt=""
                            src="../bircircle.svg"
                        />
                    )}
                </div>
            </div>
            {errors.length === 1 && (
                <ErrorMessage message={errors.pop()} isNotification={true} />
            )}
        </div>
    );
};
