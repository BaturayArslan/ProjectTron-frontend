import "antd/dist/antd.css";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Button, Input } from "antd";
import styles from "../pages/RoomsPage.module.css";
import React from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { ErrorMessage } from "./ErrorMessage";

export const ChatBox = (props) => {
    const [isOpen, setIsOpen] = useState(props.isOpen);
    const toggleIsOpen = () => {
        setIsOpen((prev) => (prev ? false : true));
    };

    const [messages, setMessages] = useState([]);
    const [errors, setErrors] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem("jwt_auth_token") || !props.isTokenValid()) {
            return;
        }
        const auth_token = localStorage.getItem("jwt_auth_token");
        const url = new URL("https://tron.hbarslan.com/user/get_messages");
        url.search = new URLSearchParams({ friend_id: props.id });
        const get_messages = async () => {
            try {
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                setMessages(res.data.message[0].friends.messages);
            } catch (error) {
                if (error.response) {
                    console.log(error);
                    setErrors((prev) => {
                        return "Couldnt get messages. ";
                    });
                }
            }
        };
        get_messages();
    }, [props.tokens]);

    useEffect(() => {
        if (messages.length !== 0) {
            props.unReadMessages.forEach((element, index) => {
                if (
                    element.timestamp > messages[messages.length - 1].timestamp
                ) {
                    setMessages((prev) => {
                        return [
                            ...prev,
                            {
                                msg: element.msg,
                                timestamp: element.timestamp,
                                isFromMe: false,
                            },
                        ];
                    });
                }
            });
        } else {
            props.unReadMessages.forEach((element, index) => {
                setMessages((prev) => {
                    return [
                        ...prev,
                        {
                            msg: element.msg,
                            timestamp: element.timestamp,
                            isFromMe: false,
                        },
                    ];
                });
            });
        }
    });

    const send_message = async (value) => {
        const auth_token = localStorage.getItem("jwt_auth_token");
        let res = await fetch("https://tron.hbarslan.com/user/send_message", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                friend_id: props.id,
                msg: value,
            }),
            mode: "cors",
        });
        let res_json = await res.json();
        if (res.status === 200) {
            setMessages((prev) => {
                return [
                    ...prev,
                    {
                        msg: res_json.message.msg,
                        timestamp: res_json.message.timestamp,
                        isFromMe: true,
                    },
                ];
            });
            setTextAreaValue("");
        } else {
            console.log(res_json);
        }
    };
    const listener = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            const activeElement = document.activeElement;
            if (
                activeElement.tagName === "TEXTAREA" &&
                activeElement.value !== ""
            ) {
                send_message(textAreaValue);
            }
        }
    };

    const [textAreaValue, setTextAreaValue] = useState("");
    const handleOnChange = (e) => {
        setTextAreaValue(e.target.value);
    };

    const handleOnClick = (e) => {
        props.update_last_opened(props.id, setErrors);
    };

    useEffect(() => {
        if (isOpen) {
            let elem = document.getElementById("myMessageAreaDiv");
            elem.scrollTo(0, elem.scrollHeight);
        }
    });

    return (
        <React.Fragment>
            {isOpen ? (
                <div className={styles.messageboxDiv} onClick={handleOnClick}>
                    <div className={styles.bannerDiv}>
                        <div className={styles.userInfoDiv}>
                            <img
                                className={styles.rectangleIcon}
                                alt=""
                                src="../rectangle-5@1x.png"
                            />
                            <i className={styles.user123ddsdI}>{props.name}</i>
                        </div>
                        <div className={styles.userInfoDiv}>
                            <button
                                className={styles.minusButton}
                                onClick={toggleIsOpen}
                            >
                                <img
                                    className={styles.vectorIcon5}
                                    alt=""
                                    src="../vector5.svg"
                                />
                            </button>
                            <button
                                className={styles.closeButton1}
                                onClick={props.removeChatBox}
                            >
                                <img
                                    className={styles.vectorIcon6}
                                    alt=""
                                    src="../vector2.svg"
                                />
                            </button>
                        </div>
                    </div>
                    <div
                        className={styles.messageAreaDiv}
                        id="myMessageAreaDiv"
                    >
                        {messages.map((element, index) => {
                            if (element.isFromMe) {
                                return (
                                    <div
                                        className={styles.myMessageDiv}
                                        key={index}
                                    >
                                        <i className={styles.user123ddsdI}>
                                            {element.msg}
                                        </i>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        className={styles.friendMessageDiv}
                                        key={index}
                                    >
                                        <i className={styles.user123ddsdI}>
                                            {element.msg}
                                        </i>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    <Input.TextArea
                        className={styles.textareaBorderInputTextArea}
                        size="middle"
                        placeholder={`Textarea placeholder`}
                        value={textAreaValue}
                        onChange={handleOnChange}
                        onPressEnter={listener}
                    />
                </div>
            ) : (
                <div className={styles.messageboxDiv1} onClick={handleOnClick}>
                    <div className={styles.messageboxclosedDiv}>
                        <button
                            className={styles.friendMessageButton}
                            onClick={toggleIsOpen}
                        >
                            {props.name}
                        </button>
                        <button
                            className={styles.closeButton}
                            onClick={props.removeChatBox}
                        >
                            <img
                                className={styles.vectorIcon1}
                                alt=""
                                src="../vector4.svg"
                            />
                        </button>
                    </div>
                </div>
            )}
            {errors.length === 1 && (
                <ErrorMessage message={errors.pop()} isNotification={true} />
            )}
        </React.Fragment>
    );
};
