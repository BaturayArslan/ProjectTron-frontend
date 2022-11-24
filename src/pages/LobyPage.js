import "bootstrap/dist/css/bootstrap.min.css";
import {
    Dropdown,
    DropdownButton,
    SplitButton,
    Button,
    Form,
} from "react-bootstrap";
import { useLocation, redirect, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import styles from "./LobyPage.module.css";
import { Player } from "../components/Player";

const COLORS = {
    1: "RED",
    2: "BLUE",
    3: "GREEN",
    4: "PURPLE",
};

const LobyPage = () => {
    const location = useLocation();
    const { roomId } = location.state;
    const navigate = useNavigate();
    const auth_token = localStorage.getItem("jwt_auth_token");
    const decoded_auth_token = jwtDecode(auth_token);

    const [roomInfo, setRoomInfo] = useState(false);
    const [teamColors, setTeamColors] = useState([1, 2]);
    const [players, setPlayers] = useState([]);

    const socket = useRef(
        new WebSocket(
            `ws://localhost:5000/ws/room/${roomId}?Authorization=${auth_token}`
        )
    );
    socket.current.onopen = (e) => {
        alert("[open] Connection established.");
    };

    socket.current.onmessage = (e) => {
        const events = JSON.parse(e.data);
        eventHandler(events);
    };

    socket.current.onclose = (event) => {
        console.log("socket closed: ", event);
    };

    socket.current.onerror = (error) => {
        navigate("/room/Rooms");
        console.log("websocket error : ", error);
    };

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
                default:
                    break;
            }
        }
    };

    const handleLeaveRoom = () => {
        e.preventDefault();
        socket.current.close();
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

        socket.current.send(JSON.stringify(event));
    };

    const handleChangeTeamColor = (index, name) => {
        const color = 1;
        for (let [key, value] of Object.entries(COLORS)) {
            if (value === name) {
                color = key;
            }
        }
        players.forEach((player) => {
            if (parseInt(player.color) === teamColors[index]) {
                let event = {
                    event_number: 5,
                    info: {
                        user_id: player.user_id,
                        color: color,
                    },
                };
                socket.current.send(JSON.stringify(event));
            }
        });
        setTeamColors((prev) => {
            prev[index] = color;
            return [...prev];
        });
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
                    <div className={styles.teamDiv}>
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
                                        />
                                    );
                                }
                                return (
                                    <Player
                                        isAdmin={false}
                                        info={player}
                                        key={index}
                                    />
                                );
                            }
                        })}
                        {parseInt(
                            players.find((element) => {
                                return (
                                    element.user_id ===
                                    decoded_auth_token.user_claims.user_id
                                );
                            }).color
                        ) === teamColors[0] && (
                            <div className={styles.changeColorContainerDiv}>
                                <DropdownButton
                                    className={
                                        styles.dropdownButtonWithDropdown
                                    }
                                    title="Change Color"
                                    variant="warning"
                                    align="start"
                                    drop="end"
                                >
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                0,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        RED
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                0,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        BLUE
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                0,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        GREEN
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                0,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        PURPLE
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        )}
                    </div>
                    <div className={styles.teamDiv}>
                        <div className={styles.teamBannerDiv}>
                            <div className={styles.rEDTEAMDiv}>
                                {COLORS[teamColors[1]]} TEAM
                            </div>
                        </div>
                        {players.map((player) => {
                            if (player.color === teamColors[1]) {
                                if (player.user_id === roomInfo.admin) {
                                    return (
                                        <Player isAdmin={true} info={player} />
                                    );
                                }
                                return <Player isAdmin={false} info={player} />;
                            }
                        })}
                        {parseInt(
                            players.find((element) => {
                                return (
                                    element.user_id ===
                                    decoded_auth_token.user_claims.user_id
                                );
                            }).color
                        ) === teamColors[1] && (
                            <div className={styles.changeColorContainerDiv}>
                                <DropdownButton
                                    className={
                                        styles.dropdownButtonWithDropdown
                                    }
                                    title="Change Color"
                                    variant="warning"
                                    align="start"
                                    drop="end"
                                >
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                1,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        RED
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                1,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        BLUE
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                1,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        GREEN
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={(e) => {
                                            handleChangeTeamColor(
                                                1,
                                                e.target.value
                                            );
                                        }}
                                    >
                                        PURPLE
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        )}
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
                    <div className={styles.lobyChatMessagesDiv} />
                    <Form.Group className={styles.textareaStandardFormGroup}>
                        <Form.Control as="textarea" placeholder="Chat..." />
                    </Form.Group>
                </div>
            </div>
        );
    } else {
        <div>Loading....</div>;
    }
};

export default LobyPage;
