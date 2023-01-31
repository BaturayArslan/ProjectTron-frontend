import { React } from "react";
import UserProfile from "./UserProfile";
import { RoomForm } from "./RoomForm";
import { FriendRequest } from "./FriendRequest";

export const PopUp = (props) => {
    let component;
    switch (props.data.type) {
        case "USERPROFILE":
            component = (
                <UserProfile
                    profileInfo={props.data}
                    onClose={props.onClose}
                    updateFriends={props.updateFriends}
                    handleAddFriend={props.handleAddFriend}
                />
            );
            break;
        case "ROOMFORM":
            component = (
                <RoomForm
                    onClose={props.onClose}
                    handleJoinRoom={props.handleJoinRoom}
                />
            );
            break;
        case "FRIENDREQUEST":
            component = (
                <FriendRequest
                    onClose={props.onClose}
                    event={props.data.event}
                    handleDeclineFriend={props.data.handleDeclineFriend}
                    handleAcceptFriend={props.data.handleAcceptFriend}
                    socket={props.socket}
                />
            );
            break;
        default:
            break;
    }
    return component;
};
