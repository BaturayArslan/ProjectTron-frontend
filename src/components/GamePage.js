import "./GamePage.css";
import styles from "./LobyPage.module.css";

import { React, useState, useEffect } from "react";
import { Alert, message, Input } from "antd";

export const GamePage = (props) => {
    const [messages, setMessages] = useState([...props.messages]);
    const [players, setPlayers] = useState([...props.players]);
    const [roomInfo, setRoomInfo] = useState({ ...props.roomInfo });

    const [textAreaValue, setTextAreaValue] = useState("");
    const handleTexArea = (e) => {
        setTextAreaValue(e.target.value);
    };

    const listener = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            const activeElement = document.activeElement;
            if (
                activeElement.tagName === "TEXTAREA" &&
                activeElement.value !== ""
            ) {
                let event = {
                    event_number: 4,
                    info: {
                        user_name: decoded_auth_token.user_claims.user_name,
                        user_id: decoded_auth_token.user_claims.user_id,
                        msg: textAreaValue,
                    },
                };
                socket.send(JSON.stringify(event));
                setTextAreaValue("");
            }
        }
    };

    return (
        <div className="game">
            <div className="flex-container">
                <div className="blue-team">
                    <span className="team">Blue Team</span>
                    <span className="num-15">15</span>
                </div>
                <div className="red-team">
                    <span className="num-15-1">15</span>
                    <span className="red-team-1">Blue Team</span>
                </div>
                <img
                    className="close-button-container"
                    src="./closeButtonContainer"
                />
            </div>
            <img className="game-container" src="./gameContainer" />

            <div className={styles.lobyChatDiv}>
                <div
                    className={styles.lobyChatMessagesDiv}
                    id="myMessageAreaDiv"
                >
                    {messages.map((message, index) => {
                        if (message.user_name === "system") {
                            return (
                                <div
                                    className={styles.systemMessage}
                                    key={index}
                                >
                                    [System Message] {message.msg}
                                </div>
                            );
                        } else {
                            return (
                                <div className={styles.userMessage} key={index}>
                                    {message.user_name} : {message.msg}
                                </div>
                            );
                        }
                    })}
                </div>
                <Input.TextArea
                    className={styles.textareaBorderInputTextArea}
                    size="middle"
                    placeholder={`Chat...`}
                    value={textAreaValue}
                    onChange={handleTexArea}
                    onPressEnter={listener}
                />
            </div>
        </div>
    );
};
