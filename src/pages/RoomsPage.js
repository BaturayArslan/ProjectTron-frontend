import { useState, useCallback, useEffect } from "react";
import { Navigate, useNavigate, Routes, Route } from "react-router-dom";
import "antd/dist/antd.css";
import { Button, Input } from "antd";
import UserProfile from "../components/UserProfile";
import PortalPopup from "../components/PortalPopup";
import styles from "./RoomsPage.module.css";
import { Rooms } from "../components/Rooms";
import { Friend } from "../components/Friend";
import { LoginPage } from "./LoginPage";
import jwtDecode from "jwt-decode";
import qs from "qs";
import axios from "axios";
import { ChatBoxes } from "../components/ChatBoxes";
import { PopUp } from "../components/PopUp";

const RoomsPage = (props) => {
    const navigate = useNavigate();

    const [popUpInfo, setPopUpInfo] = useState(false);
    const definePopUpInfo = (data) => {
        setPopUpInfo((prev) => {
            return data;
        });
    };
    const closePopup = useCallback(() => {
        setPopUpInfo(false);
    }, []);

    const [profileInfo, setProfileInfo] = useState(null);
    useEffect(() => {
        if (!localStorage.getItem("jwt_auth_token") || !props.isTokenValid()) {
            return;
        }
        const auth_token = localStorage.getItem("jwt_auth_token");
        const decoded_auth_token = jwtDecode(auth_token);
        const url = new URL("https://tron.hbarslan.com/user/profile");
        url.search = new URLSearchParams({
            user_id: decoded_auth_token.user_claims.user_id,
        }).toString();

        const get_user_profile = async () => {
            let res = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${auth_token}`,
                },
                mode: "cors",
            });
            let res_json = await res.json();
            if (res.status === 200) {
                setProfileInfo(res_json.message);
            } else {
                console.log(res_json);
            }
        };
        get_user_profile();
    }, [props.tokens]);

    const [unReadMessages, setUnreadMessages] = useState([]);
    useEffect(() => {
        if (!localStorage.getItem("jwt_auth_token")) {
            return;
        }
        const get_unread_messages = async () => {
            try {
                let timestamp = 1;
                if (unReadMessages.length !== 0) {
                    timestamp =
                        unReadMessages[unReadMessages.length - 1].timestamp;
                }
                const auth_token = localStorage.getItem("jwt_auth_token");
                const url = new URL(
                    "https://tron.hbarslan.com/user/update_messages"
                );
                url.search = new URLSearchParams({
                    timestamp: timestamp,
                    isBlock: true,
                });
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                setUnreadMessages((prev) => {
                    return [...prev, ...res.data.message];
                });
            } catch (error) {
                console.log("ERROR update_message: ", error);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setUnreadMessages((prev) => {
                    return [...prev];
                });
            }
        };
        get_unread_messages();
    }, [unReadMessages]);

    const [chatBoxes, setChatBoxes] = useState([]);
    const openChatBox = (e) => {
        const isInChatBox = chatBoxes.find(
            (element) => element._id === e.target.getAttribute("id")
        );
        if (isInChatBox) {
            return;
        }
        setChatBoxes((prev) => {
            const clickedFriend = profileInfo.friends.filter(
                (element) => element._id === e.target.getAttribute("id")
            );
            return [
                ...prev,
                {
                    _id: e.target.getAttribute("id"),
                    isOpen: true,
                    username: clickedFriend[0].username,
                    avatar: clickedFriend[0].avatar,
                    last_opened: clickedFriend[0].last_opened,
                },
            ];
        });
    };

    const removeChatBox = (e) => {
        const newArr = chatBoxes.filter((element) => {
            element !== e.target.getAttribute("id");
        });
        setChatBoxes(newArr);
    };

    const update_last_opened = (friend_id, setError) => {
        const update_db = async (friend_id, setError) => {
            try {
                const url = new URL(
                    "https://tron.hbarslan.com/user/last_opened"
                );
                url.search = new URLSearchParams({ friend_id: friend_id });
                const auth_token = localStorage.getItem("jwt_auth_token");
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });

                setProfileInfo((prev) => {
                    const friend = prev.friends.find(
                        (element) => element._id === friend_id
                    );
                    const index_of_friend = prev.friends.indexOf(friend);
                    friend.last_opened = res.data.message;
                    prev.friends[index_of_friend] = friend;

                    return { ...prev };
                });
            } catch (error) {
                console.log(error);
                setError((prev) => {
                    return ["Couldnt update last_opened parameter."];
                });
            }
        };
        update_db(friend_id, setError);
    };
    const [selectedRoom, setSelectedRoom] = useState(false);
    const handleSelectedRoom = (roomInfo) => {
        setSelectedRoom((prev) => {
            return { ...roomInfo };
        });
    };

    const handleJoinRoom = (room_id = null) => {
        if (room_id) {
            navigate(`/room/${room_id}`, {
                state: { roomId: room_id, myProfile: profileInfo },
            });
        } else {
            navigate(`/room/${selectedRoom._id}`, {
                state: { roomId: selectedRoom._id, myProfile: profileInfo },
            });
        }
    };

    const jwt_token = localStorage.getItem("jwt_auth_token");
    if (!jwt_token) {
        return <Navigate replace to="/auth/login" />;
    }

    return (
        <>
            <main className={styles.roomsPageMain}>
                <div className={styles.roomsBarDiv}>
                    <div className={styles.roomsBannerDiv}>
                        <div className={styles.userIconDiv}>
                            <button
                                className={styles.avatarButton}
                                onClick={() => {
                                    definePopUpInfo({
                                        ...profileInfo,
                                        type: "USERPROFILE",
                                        isFriend: false,
                                        isSelfProfile: true,
                                    });
                                }}
                            />
                            <strong className={styles.nameStrong}>
                                {profileInfo ? profileInfo.username : ""}
                            </strong>
                        </div>
                        <div className={styles.logoDiv}>
                            <button className={styles.tRONButton}>TRON</button>
                        </div>
                    </div>
                    <Rooms
                        tokens={props.tokens}
                        isTokenValid={props.isTokenValid}
                        handleSelectedRoom={handleSelectedRoom}
                    />
                    <div className={styles.buttonsDiv}>
                        <Button
                            className={styles.buttonPrimaryText}
                            type="primary"
                            size="large"
                            shape="default"
                            block
                            onClick={(e) => {
                                handleJoinRoom();
                            }}
                        >
                            Join Room
                        </Button>
                        <Button
                            className={styles.buttonPrimaryText}
                            type="primary"
                            size="large"
                            shape="default"
                            block
                            onClick={() => {
                                definePopUpInfo({
                                    type: "ROOMFORM",
                                });
                            }}
                        >
                            Create Room
                        </Button>
                    </div>
                    <ChatBoxes
                        boxes={chatBoxes}
                        unReadMessages={unReadMessages}
                        removeChatBox={removeChatBox}
                        tokens={props.tokens}
                        isTokenValid={props.isTokenValid}
                        update_last_opened={update_last_opened}
                    />
                </div>
                <div className={styles.chatBarDiv}>
                    <div className={styles.chatBannerDiv}>
                        <button
                            className={styles.avatarButton1}
                            onClick={() => {
                                definePopUpInfo({
                                    ...profileInfo,
                                    type: "USERPROFILE",
                                    isFriend: false,
                                    isSelfProfile: true,
                                });
                            }}
                        />
                        <strong className={styles.nameStrong1}>
                            {profileInfo ? profileInfo.username : ""}
                        </strong>
                    </div>
                    {profileInfo ? (
                        <Friend
                            friends={profileInfo.friends}
                            unReadMessages={unReadMessages}
                            openChatBox={openChatBox}
                            definePopUpInfo={definePopUpInfo}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </main>
            {popUpInfo && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                    onOutsideClick={closePopup}
                >
                    <PopUp
                        onClose={closePopup}
                        data={popUpInfo}
                        handleJoinRoom={handleJoinRoom}
                        updateFriends={setProfileInfo}
                    />
                </PortalPopup>
            )}
        </>
    );
};

export default RoomsPage;
