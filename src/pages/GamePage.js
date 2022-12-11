import "./GamePage.css";
import styles from "./LobyPage.module.css";
import "../components/FriendRequest.css";
import { React, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PortalPopup from "../components/PortalPopup";
import { Alert, message, Input } from "antd";
import { Button } from "react-bootstrap";
import jwtDecode from "jwt-decode";

class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener("keydown", (e) => {
            if (
                (e.key === "w" ||
                    e.key === "a" ||
                    e.key === "s" ||
                    e.key === "d") &&
                !e.repeat
            ) {
                let event = {
                    event_number: 20,
                    info: {
                        user_id: this.game.player.user_id,
                        key: e.key,
                    },
                };
                this.game.connection.send(JSON.stringify(event));
            }
        });
        window.addEventListener("keyup", (e) => {
            if (
                e.key === "w" ||
                e.key === "a" ||
                e.key === "s" ||
                e.key === "d"
            ) {
                let event = {
                    event_number: 21,
                    info: {
                        user_id: this.game.player.user_id,
                        key: e.key,
                    },
                };
                this.game.connection.send(JSON.stringify(event));
            }
        });
        window.addEventListener("keypress", (e) => {
            if (e.key === " ") {
                let event = {
                    event_number: 22,
                    info: {
                        user_id: this.game.player.user_id,
                    },
                };
                this.game.connection.send(JSON.stringify(event));
            }
        });
    }
}

class Tile {
    static TILE_WIDTH = 8;
    static DISTANCE_BETWEEN = 16;

    constructor(player, x, y, color) {
        this.player = player;
        (this.x = x), (this.y = y);
        this.color = color;
    }

    update() {}

    draw(ctx) {
        ctx.lineTo(this.x, this.y);
    }
}

class Player {
    constructor(game, user, start_position) {
        this.game = game;
        this.width = user.width;
        this.height = user.height;
        this.x = start_position.x;
        this.y = start_position.y;
        this.start_x = start_position.x;
        this.start_y = start_position.y;
        this.start_rotationAngle = start_position.rotation;
        this.user_id = user.user_id;
        this.color = user.color;
        this.rotationAngle = start_position.rotation;
        this.speed = user.speed;
        this.maxSpeed = user.maxSpeed;
        this.renderTile = true;
        this.tiles = user.tiles;
        this.win_round = user.win_round;
        this.img = new Image();
        if (this.color === 1) {
            this.loadImage("/redCycle.png").then((image) => {
                this.game.draw(this.game.context);
            });
        } else {
            this.loadImage("/blueCycle.png").then((image) => {
                this.game.draw(this.game.context);
            });
        }
    }
    update(data) {
        this.x = data.x;
        this.y = data.y;
        this.rotationAngle = data.rotationAngle;
        this.speed = data.speed;
        this.renderTile = data.renderTile;
        this.win_round = data.win_round;
        this.tiles = data.tiles.map((tile) => {
            return new Tile(this, tile.x, tile.y, this.color);
        });
    }

    draw(context) {
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.rotate((Math.PI / 180) * this.rotationAngle);
        context.drawImage(
            this.img,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        //context.fillRect(0, 0, 50, 50);
        context.restore();

        context.save();
        context.lineWidth = Tile.TILE_WIDTH;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = this.color === 1 ? "#f55503" : "#3dfdfe";
        context.beginPath();
        this.tiles.forEach((tile, index) => {
            if (index === 0) context.moveTo(this.tiles[0].x, this.tiles[0].y);
            tile.draw(context);
        });
        context.stroke();
    }
    loadImage(src) {
        const promise = new Promise((resolve, reject) => {
            this.img.onload = () => resolve(this.img);
            this.img.onerror = () => reject;
            this.img.src = src;
        });
        return promise;
    }
}

export class Game {
    constructor(width, height, socket) {
        this.width = width;
        this.height = height;
        this.connection = socket;
        this.context = null;
        this.onlinePlayers = [];
    }

    update(players_arr) {
        const user = players_arr.find((element) => {
            return element.user_id === this.player.user_id;
        });
        this.player.update(user);
        this.onlinePlayers.forEach((onlinePlayer) => {
            let data = players_arr.find((element) => {
                return element.user_id === onlinePlayer.user_id;
            });
            onlinePlayer.update(data);
        });
    }

    draw(context) {
        this.player.draw(context);
        this.onlinePlayers.forEach((onlinePlayer) => {
            onlinePlayer.draw(context);
        });
    }

    addPlayers(user, onlinePlayers, start_positions) {
        const user_position = start_positions.find((element) => {
            return user.user_id === element.user_id;
        });
        this.player = new Player(this, user, user_position);
        for (let onlinePlayer of onlinePlayers) {
            let position = start_positions.find((element) => {
                return onlinePlayer.user_id === element.user_id;
            });
            this.onlinePlayers.push(new Player(this, onlinePlayer, position));
        }
        this.input = new InputHandler(this);
    }
    setContext = (ctx) => {
        this.context = ctx;
    };

    endRound() {
        let players_arr = [...this.onlinePlayers, this.player];
        players_arr.forEach((player) => {
            player.x = player.start_x;
            player.y = player.start_y;
            player.rotationAngle = player.start_rotationAngle;
            player.speed = 0;
            player.tiles = [];
            player.renderTile = true;
        });
    }
}

export const GamePage = (props) => {
    const { socket, game, scoreBoard, startPositions, messages } = props;

    const auth_token = localStorage.getItem("jwt_auth_token");
    const decoded_auth_token = jwtDecode(auth_token);
    const id = decoded_auth_token.user_claims.user_id;

    useEffect(() => {
        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");
        canvas.width = game.width;
        canvas.height = game.height;
        props.setContext((prev) => {
            return ctx;
        });
        game.setContext(ctx);

        return () => {
            socket.close();
        };
    }, []);

    const [textAreaValue, setTextAreaValue] = useState("");
    const handleTexArea = (e) => {
        setTextAreaValue((prev) => {
            return e.target.value;
        });
    };

    useEffect(() => {
        let elem = document.getElementById("myMessageAreaDiv");
        elem.scrollTo(0, elem.scrollHeight);
    });

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

    const [popUpInfo, setPopUpInfo] = useState(false);
    const closePopup = useCallback(() => {
        setPopUpInfo(false);
    }, []);

    const navigate = useNavigate();
    const handleClose = () => {
        navigate("/room/Rooms", { replace: true });
    };

    return (
        <div className="game">
            <div className="banner-container">
                <div className="score-container">
                    <div className="blue-team">
                        <span className="team">Blue Team</span>
                        <span className="num-15">{scoreBoard[1]}</span>
                    </div>
                    <div className="red-team">
                        <span className="num-15-1">{scoreBoard[0]}</span>
                        <span className="red-team-1">Red Team</span>
                    </div>
                </div>
                <div
                    className="close-button-container"
                    onClick={(e) => {
                        setPopUpInfo((prev) => {
                            return true;
                        });
                    }}
                >
                    <img src="/closeButtonContainer.svg" />
                </div>
            </div>

            <canvas className="game-container" id="canvas1" />

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
                    size="small"
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
                    <div className="friend-request-contain">
                        <span className="request-message">
                            Do You Wanna Leave Room
                        </span>
                        <div className="button-container">
                            <Button
                                variant="success"
                                size="lg"
                                className="button-default-1"
                                onClick={(e) => {
                                    handleClose();
                                }}
                            >
                                Yes
                            </Button>
                            <Button
                                variant="danger"
                                size="lg"
                                onClick={(e) => {
                                    closePopup();
                                }}
                                className="button-default"
                            >
                                No
                            </Button>
                        </div>
                    </div>
                </PortalPopup>
            )}
        </div>
    );
};
