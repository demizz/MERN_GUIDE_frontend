import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElement/Input";
import ErrorModal from "../../shared/components/UIElement/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import Button from "../../shared/components/FormElement/Button";
import { useForm } from "../../shared/hooks/form-hook";

const UpdatePlace = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [data, setData] = useState();
  const placeId = useParams().placeId;
  const [loadedPlace, setLoadedPlace] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const clearError = () => {
    setError(null);
  };
  const [formState, InputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    setLoading(true);
    const sendRequest = async () => {
      try {
        const result = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        });
        if (result.data.status === "success") {
          setLoadedPlace(result.data.place);
          console.log(result.data.place);
          setFormData(
            {
              title: {
                value: result.data.place.title,
                isValid: true,
              },
              description: {
                value: result.data.place.description,
                isValid: true,
              },
            },
            true
          );
          setLoading(false);
        }
      } catch (err) {
        setError(err.response.data.message);
        setLoading(false);
      }
    };
    sendRequest();
  }, []);

  const placeUpdateSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        data: {
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        },
      });
      if (res.data.status) {
        console.log(res.data.message);
        history.push(`/${auth.currentUserId}/places`);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  } else if (!loadedPlace && !error) {
    return (
      <div className="center">
        <h2>could not found this place</h2>
      </div>
    );
  } else
    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="please enter a valid Title"
            onInput={InputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="please enter a valid Description min 5 characters"
            onInput={InputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      </React.Fragment>
    );
};

export default UpdatePlace;
