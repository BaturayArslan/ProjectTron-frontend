import { React, useState, useEffect } from "react";
import "./FriendRequest.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { message } from "antd";

export const FriendRequest = (props) => {
    return (
        <div className="friend-request-contain">
            <span className="request-message">
                {props.event.from_user_name} has been sent a friend request to
                you
            </span>
            <div className="button-container">
                <Button
                    variant="success"
                    size="lg"
                    className="button-default-1"
                    onClick={(e) => {
                        props.handleAcceptFriend(
                            props.event.from_user_id,
                            props.socket
                        );
                    }}
                >
                    Accept
                </Button>
                <Button
                    variant="danger"
                    size="lg"
                    onClick={(e) => {
                        props.handleDeclineFriend(
                            props.event.from_user_id,
                            props.socket
                        );
                    }}
                    className="button-default"
                >
                    Decline
                </Button>
            </div>
        </div>
    );
};
