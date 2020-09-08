import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./PlaceForm.css";
import Input from "../../shared/components/FormElement/Input";
import Button from "../../shared/components/FormElement/Button";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";
import axios from "axios";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

const NewPlace = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
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
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.currentUserId);
      formData.append("image", formState.inputs.image.value);

      const res = await axios({
        url: `${process.env.REACT_APP_BACKEND_URL}/places/new`,
        method: "POST",
        data: formData,

        headers: {
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
      if (res.data.status === "success") {
      }
    } catch (err) {
      setError(err.response.data.message);
    }
    history.push(`/${auth.currentUserId}/places`);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={onSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText=" please enter a valid Title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <ImageUpload
          id="image"
          onInput={InputHandler}
          errorText="please provide an image"
        />
        <Input
          id="description"
          element="textarea"
          label="description"
          errorText=" please enter a valid description at least 5 character"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH]}
          onInput={InputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          errorText=" please enter an address "
          validators={[VALIDATOR_REQUIRE()]}
          onInput={InputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
