import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button as AntButton } from "antd";
import { React, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage";
import styles from "../pages/RegisterPage.module.css";
import qs from "qs";

export const RegisterPageForm = (props) => {
    const [selectedAvatar, setSelectedAvatar] = useState(1);
    const [errors, setErrors] = useState([]);
    const form = useRef(null);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: e.target[0].value,
            email: e.target[1].value,
            password: e.target[2].value,
            avatar: selectedAvatar,
            confirm: e.target[3].value,
        };
        let res = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: qs.stringify(data),
            mode: "cors",
        });

        let res_json = await res.json();
        if (res.status === 201) {
            navigate("/auth/login");
        } else if (res.status === 400) {
            let result = [];
            for (const [key, value] of Object.entries(res_json.message)) {
                result.push({ error: value[0] });
            }
            setErrors(result);
        } else {
            setErrors([{ error: res_json.message }]);
        }
    };
    const handleClick = (e) => {
        setSelectedAvatar(parseInt(e.target.alt));
    };

    return (
        <form ref={form} className={styles.form} onSubmit={handleSubmit}>
            {errors.map((item, index) => {
                return (
                    <ErrorMessage
                        key={index}
                        message={item.error}
                        isNotification={true}
                    />
                );
            })}

            <div className={styles.avatarsDiv}>
                <div className={styles.row1Div}>
                    <img
                        className={
                            selectedAvatar === 1
                                ? `${styles.rectangleIcon} ${styles.selectedAvatar}`
                                : `${styles.rectangleIcon}`
                        }
                        alt="1"
                        src="../rectangle-5@1x.png"
                        onClick={handleClick}
                    />
                    <img
                        className={
                            selectedAvatar === 2
                                ? `${styles.rectangleIcon} ${styles.selectedAvatar}`
                                : `${styles.rectangleIcon}`
                        }
                        alt="2"
                        src="../rectangle-5@1x.png"
                        onClick={handleClick}
                    />
                </div>
                <div className={styles.row1Div}>
                    <img
                        className={
                            selectedAvatar === 3
                                ? `${styles.rectangleIcon} ${styles.selectedAvatar}`
                                : `${styles.rectangleIcon}`
                        }
                        alt="3"
                        src="../rectangle-5@1x.png"
                        onClick={handleClick}
                    />
                    <img
                        className={
                            selectedAvatar === 4
                                ? `${styles.rectangleIcon} ${styles.selectedAvatar}`
                                : `${styles.rectangleIcon}`
                        }
                        alt="4"
                        src="../rectangle-5@1x.png"
                        onClick={handleClick}
                    />
                </div>
            </div>
            <div className={styles.usernameDiv}>
                <Form.Group className={styles.rectangleFormGroup}>
                    <Form.Label>username</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>
            </div>
            <div className={styles.usernameDiv}>
                <Form.Group className={styles.rectangleFormGroup}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="text" />
                </Form.Group>
            </div>
            <div className={styles.passwordDiv}>
                <Form.Group className={styles.rectangleFormGroup}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>
            </div>
            <div className={styles.usernameDiv}>
                <Form.Group className={styles.rectangleFormGroup}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" />
                </Form.Group>
            </div>
            <div className={styles.footageDiv}>
                <AntButton
                    style={{ width: "140px" }}
                    type="primary"
                    size="middle"
                    shape="default"
                    htmlType="submit"
                >
                    Register
                </AntButton>
            </div>
        </form>
    );
};
