import React, { useState, useContext } from "react";
import "./PlaceItem.css";
import { useHistory } from "react-router-dom";
import Card from "../../shared/components/UIElement/Card";
import Button from "../../shared/components/FormElement/Button";
import Modal from "../../shared/components/UIElement/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import axios from "axios";
const PlaceItem = (props) => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState();
  const clearError = () => {
    setError(false);
  };
  const showconfirmDelete = () => {
    setConfirmDelete(true);
  };
  const cancelConfirmDelete = () => {
    setConfirmDelete(false);
  };
  const sendDelete = async () => {
    setConfirmDelete(false);
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        method: "DELETE",
        headers: {
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      if (res.data.status === "success") {
        console.log("deleted success");
        history.push(`/${auth.currentUserId}/places`);
        props.onDelete(props.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (error) {
    return <ErrorModal error={error} onClear={clearError} />;
  } else
    return (
      <React.Fragment>
        <Modal
          show={confirmDelete}
          onCancel={cancelConfirmDelete}
          header="Are you sure"
          footerClass="place-item__modal-actios"
          footer={
            <React.Fragment>
              <Button inverse onClick={cancelConfirmDelete}>
                Cancel
              </Button>
              <Button danger onClick={sendDelete}>
                Delete
              </Button>
            </React.Fragment>
          }
        >
          <p>
            Do you want to proceed and delete this place ?please note that it
            can't be undone there after
          </p>
        </Modal>
        <li className="place-item">
          <Card className="place-item__content">
            <div className="place-item__image">
              <img
                src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.title}
              />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              {auth.isLoggedIn && (
                <Button to={`/places/${props.id}`}> Edit </Button>
              )}
              {auth.isLoggedIn && (
                <Button danger onClick={showconfirmDelete}>
                  Delete
                </Button>
              )}
            </div>
          </Card>
        </li>
      </React.Fragment>
    );
};

export default PlaceItem;
