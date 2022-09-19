import React from "react";
import UserListItem from "./UserListItem";

const UserList = (props) => {
  return (
    <div>
      {props.users.map((user) => (
        <UserListItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;