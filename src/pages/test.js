import { useState, useCallback } from "react";
import "antd/dist/antd.css";
import { Button, Input } from "antd";
import UserProfile from "../components/UserProfile";
import PortalPopup from "../components/PortalPopup";
import styles from "./RoomsPage.module.css";

const RoomsPage = () => {
    const [isUserProfilePopupOpen, setUserProfilePopupOpen] = useState(false);

    const openUserProfilePopup = useCallback(() => {
        setUserProfilePopupOpen(true);
    }, []);

    const closeUserProfilePopup = useCallback(() => {
        setUserProfilePopupOpen(false);
    }, []);

    return (
        <>
            <main className={styles.roomsPageMain}>
                <div className={styles.roomsBarDiv}>
                    <div className={styles.roomsBannerDiv}>
                        <div className={styles.userIconDiv}>
                            <button
                                className={styles.avatarButton}
                                onClick={openUserProfilePopup}
                            />
                            <strong className={styles.nameStrong}>
                                user123
                            </strong>
                        </div>
                        <div className={styles.logoDiv}>
                            <button className={styles.tRONButton}>TRON</button>
                        </div>
                    </div>
                    <div className={styles.roomsDiv}>
                        <div className={styles.roomBannerDiv}>
                            <strong className={styles.roomNmaeStrong}>
                                Room Nmae
                            </strong>
                            <strong className={styles.roomNmaeStrong}>
                                Players
                            </strong>
                            <strong className={styles.roomNmaeStrong}>
                                Rounds
                            </strong>
                            <strong className={styles.roomNmaeStrong}>
                                Public
                            </strong>
                        </div>
                        <button className={styles.roomButton}>
                            <strong className={styles.testROOMStrong}>
                                test ROOM
                            </strong>
                            <strong className={styles.testROOMStrong}>
                                0/2
                            </strong>
                            <strong className={styles.testROOMStrong}>
                                0/10
                            </strong>
                            <div className={styles.antDesignlockFilledDiv}>
                                <img
                                    className={styles.vectorIcon}
                                    alt=""
                                    src="../vector1.svg"
                                />
                            </div>
                        </button>
                    </div>
                    <div className={styles.buttonsDiv}>
                        <Button
                            className={styles.buttonPrimaryText}
                            type="primary"
                            size="large"
                            shape="default"
                            block
                        >
                            Join Room
                        </Button>
                    </div>
                    <div className={styles.messagesBarDiv}>
                        <div className={styles.messageboxDiv}>
                            <div className={styles.bannerDiv}>
                                <div className={styles.userInfoDiv}>
                                    <img
                                        className={styles.rectangleIcon}
                                        alt=""
                                        src="../rectangle-9@2x.png"
                                    />
                                    <i className={styles.user123ddsdI}>
                                        user123ddsd
                                    </i>
                                </div>
                                <div className={styles.userInfoDiv}>
                                    <button className={styles.minusButton}>
                                        <img
                                            className={styles.vectorIcon1}
                                            alt=""
                                            src="../vector2.svg"
                                        />
                                    </button>
                                    <button className={styles.closeButton}>
                                        <img
                                            className={styles.vectorIcon1}
                                            alt=""
                                            src="../vector3.svg"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.messageAreaDiv}>
                                <div className={styles.myMessageDiv}>
                                    <i className={styles.user123ddsdI}>
                                        Hello user123dsad
                                    </i>
                                </div>
                                <div className={styles.friendMessageDiv}>
                                    <i className={styles.user123ddsdI}>
                                        hey user
                                    </i>
                                </div>
                            </div>
                            <Input.TextArea
                                className={styles.textareaBorderInputTextArea}
                                size="middle"
                                placeholder={`Textarea placeholder`}
                            />
                        </div>
                        <div className={styles.messageboxDiv1}>
                            <div className={styles.messageboxclosedDiv}>
                                <button className={styles.friendMessageButton}>
                                    BATURAY
                                </button>
                                <button className={styles.closeButton1}>
                                    <img
                                        className={styles.vectorIcon2}
                                        alt=""
                                        src="../vector4.svg"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.chatBarDiv}>
                    <div className={styles.chatBannerDiv}>
                        <button className={styles.avatarButton1} />
                        <strong className={styles.nameStrong1}>
                            <div className={styles.user123Div}>user123</div>
                        </strong>
                        <button className={styles.minusButton1}>
                            <img
                                className={styles.vectorIcon4}
                                alt=""
                                src="../vector5.svg"
                            />
                        </button>
                    </div>
                    <div className={styles.friendDiv}>
                        <button className={styles.avatarButton1} />
                        <button className={styles.nameButton}>baturay</button>
                        <div className={styles.antDesignlockFilledDiv}>
                            <div className={styles.roomNmaeStrong}>1</div>
                        </div>
                    </div>
                </div>
            </main>
            {isUserProfilePopupOpen && (
                <PortalPopup
                    overlayColor="rgba(113, 113, 113, 0.3)"
                    placement="Centered"
                    onOutsideClick={closeUserProfilePopup}
                >
                    <UserProfile onClose={closeUserProfilePopup} />
                </PortalPopup>
            )}
        </>
    );
};
