import "bootstrap/dist/css/bootstrap.min.css";
import {
    Dropdown,
    DropdownButton,
    SplitButton,
    Button,
    Form,
} from "react-bootstrap";
import { Alert, message, Input } from "antd";
import { useLocation, redirect, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import jwtDecode from "jwt-decode";
import styles from "./LobyPage.module.css";
import { Player } from "../components/Player";
import PortalPopup from "../components/PortalPopup";
import { PopUp } from "../components/PopUp";
import { ErrorMessage } from "../components/ErrorMessage";

const COLORS = {
    1: "RED",
    2: "BLUE",
    3: "GREEN",
    4: "PURPLE",
};

const LobyPage = () => {
    const location = useLocation();
    const { roomId, myProfile } = location.state;
    const navigate = useNavigate();
    const auth_token = localStorage.getItem("jwt_auth_token");
    const decoded_auth_token = jwtDecode(auth_token);

    const [socket, setSocket] = useState(null);
    const [successMessage, setSuccessMessage] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [roomInfo, setRoomInfo] = useState(false);
    const [teamColors, setTeamColors] = useState([1, 2]);
    const [players, setPlayers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [textAreaValue, setTextAreaValue] = useState("");
    const [popUpInfo, setPopUpInfo] = useState(false);

    const closePopup = useCallback(() => {
        setPopUpInfo(false);
    }, []);

    useEffect(() => {
        setSocket((prev) => {
            let socket = new WebSocket(
                `ws://localhost:5000/ws/room/${roomId}?Authorization=${auth_token}`
            );
            socket.onopen = (e) => {
                console.log("[open] Connection established.");
            };

            socket.onmessage = (e) => {
                const events = JSON.parse(e.data);
                eventHandler(events);
            };

            socket.onclose = (event) => {
                console.log("socket closed: ", event);
            };

            socket.onerror = (error) => {
                navigate("/room/Rooms");
                console.log("websocket error : ", error);
            };
            return socket;
        });
    }, []);

    const eventHandler = (events) => {
        for (let event of events) {
            switch (event.event_number) {
                case 1:
                    let arr = [];
                    setPlayers((prev) => {
                        for (let [player_id, player_info] of Object.entries(
                            event.info
                        )) {
                            arr.push(player_info);
                        }
                        return arr;
                    });
                    break;
                case 2:
                    let arr2 = [];
                    setPlayers((prev) => {
                        for (let [player_id, player_info] of Object.entries(
                            event.info
                        )) {
                            arr2.push(player_info);
                        }
                        return arr2;
                    });
                    break;
                case 17:
                    setRoomInfo((prev) => {
                        return event.info;
                    });
                    break;
                case 9:
                    setPlayers((prev) => {
                        const id = event.info.user_id;
                        const newPlayers = prev.map((element) => {
                            if (element.user_id === id) {
                                element.is_ready = event.info.is_ready;
                            }
                            return element;
                        });
                        return newPlayers;
                    });
                    break;
                case 5:
                    setPlayers((prev) => {
                        const id = event.info.user_id;
                        const newPlayers = prev.map((element) => {
                            if (element.user_id === id) {
                                element.color = event.info.color;
                            }
                            return element;
                        });
                        return newPlayers;
                    });
                    break;
                case 3:
                    setMessages((prev) => {
                        return [
                            ...prev,
                            { user_name: "system", msg: event.message },
                        ];
                    });
                    break;
                case 4:
                    setMessages((prev) => {
                        return [...prev, event.info];
                    });
                    break;
                case 7:
                    setPopUpInfo((prev) => {
                        let info = {
                            type: "FRIENDREQUEST",
                            event: event.info,
                            handleAcceptFriend: handleAcceptFriend,
                            handleDeclineFriend: handleDeclineFriend,
                        };
                        return info;
                    });
                    break;
                case 8:
                    if (event.info.answer) {
                        setSuccessMessage((prev) => {
                            return [`${event.info.from_user_name} accepted.`];
                        });
                    } else {
                        setErrorMessage((prev) => {
                            return [`${event.info.from_user_name} declined.`];
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const handleLeaveRoom = () => {
        socket.close();
        navigate("/room/Rooms");
    };

    const handleReady = () => {
        const id = decoded_auth_token.user_claims.user_id;
        const player = players.find((element) => {
            return element.user_id === id;
        });

        const event = {
            event_number: 9,
            info: {
                user_id: id,
                is_ready: !player.is_ready,
            },
        };

        socket.send(JSON.stringify(event));
    };

    const handleChangeColor = (color) => {
        let event = {
            event_number: 5,
            info: {
                user_id: decoded_auth_token.user_claims.user_id,
                color: color,
            },
        };
        socket.send(JSON.stringify(event));
    };

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
    useEffect(() => {
        if (roomInfo) {
            let elem = document.getElementById("myMessageAreaDiv");
            elem.scrollTo(0, elem.scrollHeight);
        }
    });

    const handlePopUpInfo = (data) => {
        setPopUpInfo((prev) => {
            return data;
        });
    };

    const handleAddFriend = (friend_id) => {
        let event = {
            event_number: 6,
            info: {
                user_id: decoded_auth_token.user_claims.user_id,
                user_name: decoded_auth_token.user_claims.user_name,
                to_user_id: friend_id,
            },
        };
        socket.send(JSON.stringify(event));
        setSuccessMessage((prev) => {
            return ["Friend Request Has Been Send"];
        });
        closePopup();
    };

    const handleAcceptFriend = (user_id, socket) => {
        let event = {
            event_number: 8,
            info: {
                user_id: user_id,
                from_user_id: decoded_auth_token.user_claims.user_id,
                from_user_name: decoded_auth_token.user_claims.user_name,
                answer: true,
            },
        };
        socket.send(JSON.stringify(event));
        closePopup();
    };

    const handleDeclineFriend = (user_id, socket) => {
        let event = {
            event_number: 8,
            info: {
                user_id: user_id,
                from_user_id: decoded_auth_token.user_claims.user_id,
                from_user_name: decoded_auth_token.user_claims.user_name,
                answer: false,
            },
        };
        socket.send(JSON.stringify(event));
        closePopup();
    };

    if (roomInfo) {
        return (
            <div className={styles.lobyPageDiv}>
                <div className={styles.lobyBannerDiv}>
                    <div className={styles.nameDiv}>
                        <div
                            className={styles.roomNameDiv}
                        >{`Room Name: `}</div>
                        <div className={styles.helloworldDiv}>
                            {roomInfo.name}
                        </div>
                    </div>
                    <div className={styles.nameDiv}>
                        <div className={styles.roomNameDiv}>{`Max User `}</div>
                        <div className={styles.helloworldDiv}>
                            {roomInfo.max_user}
                        </div>
                    </div>
                    <div className={styles.nameDiv}>
                        <div className={styles.roomNameDiv}>Max Round</div>
                        <div className={styles.helloworldDiv}>
                            {roomInfo.max_point}
                        </div>
                    </div>
                </div>
                <div className={styles.lobyDiv}>
                    <div
                        className={styles.teamDiv}
                        onClick={(e) => {
                            handleChangeColor(teamColors[0]);
                        }}
                    >
                        <div className={styles.teamBannerDiv}>
                            <div className={styles.rEDTEAMDiv}>
                                {COLORS[teamColors[0]]} TEAM
                            </div>
                        </div>
                        {players.map((player, index) => {
                            if (parseInt(player.color) === teamColors[0]) {
                                console.log(player, teamColors[0], roomInfo);
                                if (player.user_id === roomInfo.admin) {
                                    return (
                                        <Player
                                            isAdmin={true}
                                            info={player}
                                            key={index}
                                            handlePopUpInfo={handlePopUpInfo}
                                            myProfile={myProfile}
                                        />
                                    );
                                }
                                return (
                                    <Player
                                        isAdmin={false}
                                        handlePopUpInfo={handlePopUpInfo}
                                        info={player}
                                        key={index}
                                        myProfile={myProfile}
                                    />
                                );
                            }
                        })}
                    </div>
                    <div
                        className={styles.teamDiv}
                        onClick={(e) => {
                            handleChangeColor(teamColors[1]);
                        }}
                    >
                        <div className={styles.teamBannerDiv}>
                            <div className={styles.rEDTEAMDiv}>
                                {COLORS[teamColors[1]]} TEAM
                            </div>
                        </div>
                        {players.map((player, index) => {
                            if (player.color === teamColors[1]) {
                                if (player.user_id === roomInfo.admin) {
                                    return (
                                        <Player
                                            isAdmin={true}
                                            info={player}
                                            key={index}
                                            handlePopUpInfo={handlePopUpInfo}
                                            myProfile={myProfile}
                                        />
                                    );
                                }
                                return (
                                    <Player
                                        isAdmin={false}
                                        info={player}
                                        key={index}
                                        handlePopUpInfo={handlePopUpInfo}
                                        myProfile={myProfile}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>
                <div className={styles.lobbyButtonsDiv}>
                    <div className={styles.leftButtonsDiv}>
                        <Button
                            className={styles.buttonDefault}
                            variant="danger"
                            size="lg"
                            onClick={(e) => {
                                handleLeaveRoom();
                            }}
                        >
                            Leave Room
                        </Button>
                    </div>
                    <div className={styles.rightButtonsDiv}>
                        {decoded_auth_token.user_claims.user_id ===
                            roomInfo.admin && (
                            <Button
                                className={styles.buttonDefault}
                                variant="primary"
                                size="lg"
                            >
                                Start Game
                            </Button>
                        )}
                        <Button
                            className={styles.buttonDefault}
                            variant="primary"
                            size="lg"
                            onClick={(e) => {
                                handleReady();
                            }}
                        >
                            Ready
                        </Button>
                    </div>
                </div>
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
                                    <div
                                        className={styles.userMessage}
                                        key={index}
                                    >
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
                {popUpInfo && (
                    <PortalPopup
                        overlayColor="rgba(113, 113, 113, 0.3)"
                        placement="Centered"
                        onOutsideClick={closePopup}
                    >
                        <PopUp
                            onClose={closePopup}
                            data={popUpInfo}
                            updateFriends={false}
                            handleAddFriend={handleAddFriend}
                            socket={socket}
                        />
                    </PortalPopup>
                )}
                {successMessage.length === 1 &&
                    message.success(successMessage.pop(), 10)}
                {errorMessage.length === 1 &&
                    message.error(errorMessage.pop(), 10)}
            </div>
        );
    } else {
        <div>Loading....</div>;
    }
};

export default LobyPage;
