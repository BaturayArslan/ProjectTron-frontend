import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React, useState, useEffect } from "react";
import { Button as AntButton } from "antd";
import { Form } from "react-bootstrap";
import { ErrorMessage } from "./ErrorMessage";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";
import formStyles from "../pages/RegisterPage.module.css";
import axios from "axios";
import qs from "qs";

export const RoomForm = (props) => {
    const navigate = useNavigate();

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

    const [errors, setErrors] = useState(false);
    const handleSubmit = (e) => {
        const create_room = async (user_id, setPopUp) => {
            try {
                const url = new URL("http://localhost:5000/room/createRoom");
                const auth_token = localStorage.getItem("jwt_auth_token");
                const data = {
                    name: e.target[0].value,
                    password: e.target[1].value,
                    max_user: e.target[2].value,
                    max_point: e.target[3].value,
                };
                let res = await axios.post(url, data, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth_token}`,
                    },
                });
                props.onClose();
                const room_id = res.data.message.room_id;
                props.handleJoinRoom(room_id);
            } catch (error) {
                console.log("Couldnt Create Room", error);
                setErrors((prev) => {
                    return ["Couldnt Create Room"];
                });
            }
        };
        e.preventDefault();
        create_room();
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
            <form className={formStyles.form} onSubmit={handleSubmit}>
                <div className={formStyles.usernameDiv}>
                    <Form.Group className={formStyles.rectangleFormGroup}>
                        <Form.Label>Room Name</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </div>
                <div className={formStyles.passwordDiv}>
                    <Form.Group className={formStyles.rectangleFormGroup}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" />
                    </Form.Group>
                </div>
                <div className={formStyles.usernameDiv}>
                    <Form.Group className={formStyles.rectangleFormGroup}>
                        <Form.Label>Max User</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </div>
                <div className={formStyles.usernameDiv}>
                    <Form.Group className={formStyles.rectangleFormGroup}>
                        <Form.Label>Max Point</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                </div>
                <div className={formStyles.footageDiv}>
                    <AntButton
                        style={{ width: "140px" }}
                        type="primary"
                        size="middle"
                        shape="default"
                        htmlType="submit"
                    >
                        Create Room
                    </AntButton>
                </div>
            </form>
            {errors.length === 1 && (
                <ErrorMessage message={errors.pop()} isNotification={true} />
            )}
        </div>
    );
};
