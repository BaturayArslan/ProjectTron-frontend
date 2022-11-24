import "antd/dist/antd.css";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
import { ErrorMessage } from "./ErrorMessage";
import styles from "../pages/RoomsPage.module.css";
import React from "react";
import axios from "axios";

export const Friend = (props) => {
    const calculate_unread_messages = (friend) => {
        const messages = props.unReadMessages;
        const timestamp = Math.floor(friend.last_opened * 1000);
        const unread_arr = messages.filter(
            (element) =>
                Math.floor(element.timestamp * 1000) > timestamp &&
                friend._id === element.sender
        );
        if (unread_arr.length === 0) {
            return "";
        }
        return unread_arr.length;
    };

    const [errors, setErrors] = useState([]);
    const handleClick = (element) => {
        const get_friend_profile = async (user_id, setPopUp) => {
            try {
                const url = new URL("http://localhost:5000/user/profile");
                url.search = new URLSearchParams({ user_id: user_id });
                const auth_token = localStorage.getItem("jwt_auth_token");
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                setPopUp({
                    ...res.data.message,
                    isFriend: true,
                    isSelfProfile: false,
                    type: "USERPROFILE",
                });
            } catch (error) {
                console.log("Couldnt get friend profile", error);
                setErrors((prev) => {
                    return ["Couldnt get friend profile"];
                });
            }
        };
        get_friend_profile(element._id, props.definePopUpInfo);
    };

    return (
        <Fragment>
            {props.friends.map((item, index) => {
                return (
                    <div className={styles.friendDiv} key={index}>
                        <button
                            className={styles.avatarButton1}
                            onClick={(e) => {
                                handleClick(item);
                            }}
                        />
                        <button
                            className={styles.nameButton}
                            id={item._id}
                            onClick={props.openChatBox}
                        >
                            {item.username}
                        </button>
                        <div className={styles.antDesignlockFilledDiv2}>
                            {props.unReadMessages.length == 0 ? (
                                <div className={styles.roomNmaeStrong}></div>
                            ) : (
                                <div className={styles.roomNmaeStrong}>
                                    {calculate_unread_messages(item)}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            {errors.length === 1 && (
                <ErrorMessage message={errors.pop()} isNotification={true} />
            )}
        </Fragment>
    );
};
