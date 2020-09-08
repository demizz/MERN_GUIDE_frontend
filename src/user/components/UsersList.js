import React from "react";
import "./UsersList.css";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElement/Card";
const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <Card>
        <h2 className="center">No users found</h2>
      </Card>
    );
  } else {
    return (
      <ul className="users-list">
        {props.items.map((user, key) => {
          return (
            <UserItem
              key={user._id}
              id={user._id}
              name={user.name}
              image={user.image}
              placesCount={user.places}
            />
          );
        })}
      </ul>
    );
  }
};

export default UsersList;
