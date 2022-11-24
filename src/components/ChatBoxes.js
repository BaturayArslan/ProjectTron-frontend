import "antd/dist/antd.css";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Button, Input } from "antd";
import styles from "../pages/RoomsPage.module.css";
import React from "react";
import { ChatBox } from "./ChatBox";

export const ChatBoxes = (props) => {
    return (
        <div className={styles.messagesBarDiv}>
            {props.boxes.map((element) => {
                let myUnreadMessages = props.unReadMessages.map((message) => {
                    if (message.sender === element._id) {
                        return message;
                    }
                });
                return (
                    <ChatBox
                        name={element.username}
                        avatar={element.avatar}
                        key={element._id}
                        id={element._id}
                        isOpen={element.isOpen}
                        removeChatBox={props.removeChatBox}
                        last_opened={element.last_opened}
                        unReadMessages={myUnreadMessages}
                        tokens={props.tokens}
                        isTokenValid={props.isTokenValid}
                        update_last_opened={props.update_last_opened}
                    />
                );
            })}
        </div>
    );
};
