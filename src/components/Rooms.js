import "antd/dist/antd.css";
import { useState, useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
import UserProfile from "./UserProfile";
import PortalPopup from "./PortalPopup";
import styles from "../pages/RoomsPage.module.css";
import { Room } from "./Room";
import { ErrorMessage } from "./ErrorMessage";
import axios from "axios";

export const Rooms = (props) => {
    const [roomsArray, setRoomsArray] = useState([]);
    const [errors, setErrors] = useState([]);
    const [refreshRooms, setRefreshRooms] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem("jwt_auth_token") || !props.isTokenValid()) {
            return;
        }
        const get_room_info = async () => {
            try {
                const auth_token = localStorage.getItem("jwt_auth_token");
                let res = await axios.get("http://localhost:5000/room/Rooms", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                setRoomsArray((prev) => {
                    return res.data.message;
                });
            } catch (error) {
                console.log(error);
                setErrors((prev) => {
                    return ["Couldnt get room data."];
                });
            }
        };
        get_room_info();
    }, [props.tokens, refreshRooms]);

    const [events, setEvents] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem("jwt_auth_token")) {
            return;
        }
        const get_events = async () => {
            try {
                let timestamp = false;
                if (events.length !== 0) {
                    timestamp = events[events.length - 1].timestamp;
                }
                const auth_token = localStorage.getItem("jwt_auth_token");
                const url = new URL("http://localhost:5000/room/update");
                if (timestamp) {
                    url.search = new URLSearchParams({
                        timestamp: timestamp,
                    });
                }
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                update_rooms(res.data.events);
            } catch (error) {
                if (error.response.status === 400) {
                    setRefreshRooms((prev) => {
                        return [...prev];
                    });
                    setEvents((prev) => {
                        return [];
                    });
                } else {
                    console.log("ERROR get_event: ", error);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    setEvents((prev) => {
                        return [...prev];
                    });
                }
            }
        };
        get_events();
    }, [events]);

    const update_rooms = (events) => {
        events.forEach((event) => {
            switch (event.name) {
                case "room creation":
                    setRoomsArray((prev) => {
                        return [...prev, event.data];
                    });
                    setEvents((prev) => {
                        return [...prev, event];
                    });
                    break;
                case "user join":
                    setRoomsArray((prev) => {
                        let room = prev.find((element) => {
                            return element._id === event.room_id;
                        });
                        const index = prev.indexOf(room);
                        room.users.push("room");
                        prev[index] = room;
                        return [...prev];
                    });
                    setEvents((prev) => {
                        return [...prev, event];
                    });
                    break;
                case "user leaves":
                    setRoomsArray((prev) => {
                        let room = prev.find((element) => {
                            return element._id === event.room_id;
                        });
                        const index = prev.indexOf(room);
                        room.users.pop();
                        prev[index] = room;
                        return [...prev];
                    });
                    setEvents((prev) => {
                        return [...prev, event];
                    });
                    break;
                case "room deletion":
                    setRoomsArray((prev) => {
                        let arr = prev.filter(
                            (item) => item._id !== event.room_id
                        );
                        return [...arr];
                    });

                    setEvents((prev) => {
                        return [...prev, event];
                    });
                    break;
                case "empty":
                    setEvents((prev) => {
                        return [...prev, event];
                    });
                default:
                    break;
            }
        });
    };

    const [clickedRoom, setClickedRoom] = useState(null);

    return (
        <div className={styles.roomsDiv}>
            <div className={styles.roomBannerDiv}>
                <strong className={styles.roomNmaeStrong}>Room ID</strong>
                <strong className={styles.roomNmaeStrong}>Players</strong>
                <strong className={styles.roomNmaeStrong}>Rounds</strong>
                <strong className={styles.roomNmaeStrong}>Public</strong>
            </div>
            {roomsArray.map((item, index) => {
                return (
                    <Room
                        info={item}
                        key={index}
                        index={index}
                        handleSelectedRoom={props.handleSelectedRoom}
                        setClickedRoom={setClickedRoom}
                        isClicked={clickedRoom === index ? true : false}
                    />
                );
            })}
            {errors.length === 1 && (
                <ErrorMessage message={errors.pop()} isNotification={true} />
            )}
        </div>
    );
};
