import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button as AntButton } from "antd";
import { React, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "./ErrorMessage";
import styles from "../pages/LoginPage.module.css";
import qs from "qs";

export const LoginPageForm = (props) => {
    const form = useRef(null);
    const [errors, setErrors] = useState([]);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                email: e.target[0].value,
                password: e.target[1].value,
            };
            let res = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: qs.stringify(data),
                mode: "cors",
            });
            let res_json = await res.json();
            if (res.status === 200) {
                localStorage.setItem("jwt_auth_token", res_json.auth_token);
                localStorage.setItem(
                    "jwt_refresh_token",
                    res_json.refresh_token
                );
                props.handleTokens(res_json);
                navigate("/room/Rooms");
            } else if (res.status === 400) {
                setErrors(res_json.message);
            } else {
                setErrors([{ error: res_json.message }]);
            }
        } catch (error) {
            console.log("Error Caught", error);
        }
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
            <div className={styles.emailDiv}>
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
            <div className={styles.footageDiv}>
                <AntButton
                    style={{ width: "140px" }}
                    type="primary"
                    size="large"
                    shape="default"
                    block
                    htmlType="submit"
                >
                    Log In
                </AntButton>
                <div className={styles.groupDiv}>
                    <i
                        className={styles.dontHaveAnAccount}
                    >{`Don’t have an account? `}</i>
                    <Link
                        className={styles.signUpA}
                        to="/auth/register"
                    >{`Sign up `}</Link>
                </div>
            </div>
        </form>
    );
};
