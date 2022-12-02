import "./Test.css";
import styles from "./LobyPage.module.css";
import { React, useState, useEffect } from "react";
import { Alert, message, Input } from "antd";
import jwtDecode from "jwt-decode";
import cycle from "./1.png";

const bezier = function (t, p0, p1, p2, p3) {
    var cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;

    var x = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + p0.x;
    var y = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + p0.y;

    return { x: x, y: y };
};

class InputHandler {
    constructor(game) {
        this.game = game;
        window.addEventListener("keydown", (e) => {
            if (
                (e.key === "w" ||
                    e.key === "a" ||
                    e.key === "s" ||
                    e.key === "d") &&
                this.game.keys.indexOf(e.key) === -1
            ) {
                this.game.keys.push(e.key);
            }
        });
        window.addEventListener("keyup", (e) => {
            if (this.game.keys.indexOf(e.key) !== -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                this.game.keyDownTimes[e.key] = 0;
            }
        });
        window.addEventListener("keypress", (e) => {
            if (e.key === " ") {
                this.game.player.renderTile = !this.game.player.renderTile;
            }
        });
    }
}

class Tile {
    static width = 8;
    static height = 8;
    constructor(game, x, y) {
        this.game = game;
        (this.x = x), (this.y = y), (this.lifeTime = 0);
        this.maxLifeTime = 5000;
        this.isGonnaDelete = false;
    }

    update(deltatime) {
        if (this.lifeTime > this.maxLifeTime) this.isGonnaDelete = true;
        else this.lifeTime += deltatime;
    }

    draw(ctx) {
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

class Player {
    constructor(game, user_info) {
        this.game = game;
        this.width = 50;
        this.height = 20;
        this.x = 0;
        this.y = 0;
        this.info = user_info;
        this.speedY = 0;
        this.speedX = 0;
        this.rotationAngle = 0;
        this.speed = 0;
        this.maxSpeed = 5;
        this.deltaX = 0;
        this.deltaY = 0;
        this.renderTile = true;
        this.tiles = [];
        this.img = new Image();
        this.img.src = cycle;
    }
    update(deltaTime) {
        if (this.game.keys.includes("w") && this.speed <= this.maxSpeed) {
            this.game.keyDownTimes.w += deltaTime;
            const t = (1 / 2000) * this.game.keyDownTimes.w;
            this.speed +=
                bezier(
                    t,
                    { x: 0, y: 1 },
                    { x: 0, y: 1 },
                    { x: 0, y: 0 },
                    { x: 1, y: 0 }
                ).y / 12;
        } else if (this.game.keys.includes("s") && this.speed > 0) {
            const t = (1 / 1000) * this.game.keyDownTimes.s;
            this.game.keyDownTimes.s += deltaTime;
            this.speed -=
                bezier(
                    t,
                    { x: 0, y: 1 },
                    { x: 0, y: 1 },
                    { x: 0, y: 0 },
                    { x: 1, y: 0 }
                ).y / 5;
        } else {
            if (this.speed < 0) {
                this.speed = 0;
            } else {
                this.speed -= 3 / 100;
            }
        }
        if (this.game.keys.includes("a")) {
            this.rotationAngle -= 4;
        } else if (this.game.keys.includes("d")) {
            this.rotationAngle += 4;
        }
        this.calculateTrace();
        this.tiles.forEach((tile) => {
            tile.update(deltaTime);
        });
        this.tiles = this.tiles.filter((tile) => {
            return !tile.isGonnaDelete;
        });
        this.x += this.speed * Math.cos((Math.PI / 180) * this.rotationAngle);
        this.y += this.speed * Math.sin((Math.PI / 180) * this.rotationAngle);
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
        context.restore();
        this.tiles.forEach((tile) => {
            context.beginPath();
            context.moveTo(this.x, this.y);
            tile.draw(context);
        });
    }

    calculateTrace() {
        this.deltaX += Math.abs(this.speedX);
        this.deltaY += Math.abs(this.speedY);
        if (
            (this.deltaX >= Tile.width || this.deltaY >= Tile.height) &&
            this.renderTile
        ) {
            this.tiles.push(
                new Tile(this.game, this.x, this.y + this.height / 2)
            );
            this.deltaX = 0;
            this.deltaY = 0;
        }
    }
}

class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.input = new InputHandler(this);
        this.keys = [];
        this.keyDownTimes = { w: 0, a: 0, s: 0, d: 0 };
    }

    update(deltaTime) {
        this.player.update(deltaTime);
    }

    draw(context) {
        this.player.draw(context);
    }

    addPlayers(user, enemies) {
        this.player = new Player(this, user);
    }
}

export const Test = (props) => {
    const [messages, setMessages] = useState([...props.messages]);
    const [players, setPlayers] = useState([...props.players]);
    const [roomInfo, setRoomInfo] = useState({ ...props.roomInfo });

    useEffect(() => {
        // const decoded_auth_token = jwtDecode(
        //     localStorage.getItem("jwt_auth_token")
        // );
        // const id = decoded_auth_token.user_claims.user_id;
        // const user = players.find((element) => {
        //     return element.user_id === id;
        // });
        // const enemies = players.filter((element) => {
        //     return element.user_id !== id;
        // });

        const canvas = document.getElementById("canvas1");
        const ctx = canvas.getContext("2d");
        canvas.width = 500;
        canvas.height = 500;

        const game = new Game(canvas.width, canvas.height);
        game.addPlayers({ color: 1 }, []);
        let lastime = 0;

        function animate(timestamp) {
            const deltaTime = timestamp - lastime;
            lastime = timestamp;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.update(deltaTime);
            game.draw(ctx);
            requestAnimationFrame(animate);
        }
        animate();
    }, []);

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
            <div className="banner-container">
                <div className="score-container">
                    <div className="blue-team">
                        <span className="team">Blue Team</span>
                        <span className="num-15">15</span>
                    </div>
                    <div className="red-team">
                        <span className="num-15-1">15</span>
                        <span className="red-team-1">Blue Team</span>
                    </div>
                </div>
                <div className="close-button-container">
                    <img src="./closeButtonContainer.svg" />
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
                        size="small"
                        placeholder={`Chat...`}
                        value={textAreaValue}
                        onChange={handleTexArea}
                        onPressEnter={listener}
                    />
                </div>
            </div>
        </div>
    );
};
