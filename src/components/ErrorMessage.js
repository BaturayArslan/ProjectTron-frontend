import "antd/dist/antd.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { React } from "react";
import { Alert, message } from "antd";

export const ErrorMessage = (props) => {
    if (!props.isNotification) {
        return (
            <div style={{ width: "100%" }}>
                <Alert
                    message="Error"
                    description={props.message}
                    type="error"
                    showIcon
                />
            </div>
        );
    } else {
        message.error(props.message, 10);
    }
};
