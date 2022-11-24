import "antd/dist/antd.css";
import { useState, useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
import UserProfile from "./UserProfile";
import PortalPopup from "./PortalPopup";
import styles from "../pages/RoomsPage.module.css";

export const Room = (props) => {
    return (
        <button
            className={styles.roomButton}
            onClick={(e) => {
                let elements = document.getElementsByClassName("clicked");
                if (elements.length !== 0) {
                    elements[0].classList.remove("clicked");
                }
                e.target.classList.add("clicked");
                props.handleSelectedRoom(props.info);
            }}
        >
            <strong className={styles.testROOMStrong}>{props.info.name}</strong>
            <strong className={styles.testROOMStrong}>
                {props.info.users.length.toString() +
                    "/" +
                    props.info.max_user.toString()}
            </strong>
            <strong className={styles.testROOMStrong}>
                {props.info.status.current_round.toString() +
                    "/" +
                    props.info.max_point.toString()}
            </strong>
            {props.info.status.public ? (
                <div className={styles.antDesignlockFilledDiv}>
                    <img
                        className={styles.vectorIcon}
                        alt=""
                        src="../vector3.svg"
                    />
                </div>
            ) : (
                <div className={styles.antDesignlockFilledDiv}>
                    <img
                        className={styles.vectorIcon}
                        alt=""
                        src="../vector3.svg"
                    />
                </div>
            )}
        </button>
    );
};
