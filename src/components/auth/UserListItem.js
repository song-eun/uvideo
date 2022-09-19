import React from "react";

const UserListItem = (props) => {

  return (
    <div>
      <h5>
        id: {props.user.id}, user name: {props.user.username}, user role: {props.user.roles[0].name}
      </h5>
    </div>
  );
};

export default UserListItem;
