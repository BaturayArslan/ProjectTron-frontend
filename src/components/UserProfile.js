import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import styles from "./UserProfile.module.css";
import axios from "axios";

const UserProfile = (props) => {
    useEffect(() => {
        const scrollAnimElements = document.querySelectorAll(
            "[data-animate-on-scroll]"
        );
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting || entry.intersectionRatio > 0) {
                        const targetElement = entry.target;
                        targetElement.classList.add(styles.animate);
                        observer.unobserve(targetElement);
                    }
                }
            },
            {
                threshold: 0.15,
            }
        );

        for (let i = 0; i < scrollAnimElements.length; i++) {
            observer.observe(scrollAnimElements[i]);
        }

        return () => {
            for (let i = 0; i < scrollAnimElements.length; i++) {
                observer.unobserve(scrollAnimElements[i]);
            }
        };
    }, []);

    const handleDeleteFriend = () => {
        const get_friend_profile = async (friend_id, updateFriends) => {
            try {
                const url = new URL("http://localhost:5000/user/delete_friend");
                url.search = new URLSearchParams({ friend_id: friend_id });
                const auth_token = localStorage.getItem("jwt_auth_token");
                let res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                if (updateFriends) {
                    updateFriends((prev) => {
                        return { ...prev, friends: res.data.message.friends };
                    });
                }
                props.onClose();
            } catch (error) {
                console.log("Couldnt delete friend ", error);
            }
        };
        get_friend_profile(props.profileInfo._id, props.updateFriends);
    };

    return (
        <div className={styles.userProfileDiv} data-animate-on-scroll>
            <div className={styles.closeDiv}>
                <button className={styles.closeButton} onClick={props.onClose}>
                    <img
                        className={styles.vectorIcon}
                        alt=""
                        src="../vector2.svg"
                    />
                </button>
            </div>
            <img className={styles.avatarIcon} alt="" src="../avatar@2x.png" />
            <div className={styles.usernameDiv}>
                <div className={styles.totalWin}>{`Username :  `}</div>
                <div className={styles.baturayDiv}>
                    {props.profileInfo.username}
                </div>
            </div>
            <div className={styles.usernameDiv}>
                <div className={styles.totalWin}>{`Total Win : `}</div>
                <div className={styles.baturayDiv}>
                    {props.profileInfo.total_win}
                </div>
            </div>
            <div className={styles.usernameDiv}>
                <div className={styles.totalWin}>{`Country : `}</div>
                <img
                    className={styles.twemojiflagTurkeyIcon}
                    alt=""
                    src="../twemojiflagturkey.svg"
                />
            </div>
            {!props.profileInfo.isSelfProfile && (
                <div className={styles.buttonsDiv}>
                    {props.profileInfo.isFriend ? (
                        <Button
                            variant="danger"
                            size="lg"
                            onClick={(e) => {
                                handleDeleteFriend();
                            }}
                        >
                            Delete Friend
                        </Button>
                    ) : (
                        <Button
                            variant="success"
                            size="lg"
                            onClick={(e) => {
                                props.handleAddFriend(props.profileInfo._id);
                            }}
                        >
                            Add Friend
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfile;
