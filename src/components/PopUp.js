import { React } from "react";
import UserProfile from "./UserProfile";
import { RoomForm } from "./RoomForm";

export const PopUp = (props) => {
    let component;
    switch (props.data.type) {
        case "USERPROFILE":
            component = (
                <UserProfile
                    profileInfo={props.data}
                    onClose={props.onClose}
                    updateFriends={props.updateFriends}
                />
            );
            break;
        case "ROOMFORM":
            component = <RoomForm onClose={props.onClose} />;
        default:
            break;
    }
    return component;
};
