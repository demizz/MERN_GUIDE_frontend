import React from "react";
import "./PlaceList.css";
import Card from "../../shared/components/UIElement/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElement/Button";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found .Maybe create One ?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  } else {
    return (
      <ul className="place-list">
        {props.items.map((item, key) => {
          return (
            <PlaceItem
              key={item._id}
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              address={item.address}
              creatorId={item.creator}
              coordinates={item.loaction}
              onDelete={props.deletePlace}
            />
          );
        })}
      </ul>
    );
  }
};

export default PlaceList;
