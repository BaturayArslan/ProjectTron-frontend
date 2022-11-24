import "antd/dist/antd.css";
import { useState, useCallback, useEffect, Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
import { ErrorMessage } from "./ErrorMessage";
import styles from "../pages/LobyPage.module.css";
import React from "react";

export const Player = (props) => {
    return (
        <div className={styles.playersDiv}>
            <div className={styles.playerDiv}>
                <div className={styles.playerInfoDiv}>
                    <button className={styles.rectangleButton} />
                    <div className={styles.rEDTEAMDiv}>
                        {props.info.user_name}
                    </div>
                </div>
                <div className={styles.playerStatsDiv}>
                    {props.isAdmin && (
                        <img
                            className={styles.adminStatDiv}
                            alt=""
                            src="../emojionestar.svg"
                        />
                    )}
                    {props.info.is_ready && (
                        <img
                            className={styles.adminStatDiv}
                            alt=""
                            src="../bircircle.svg"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
