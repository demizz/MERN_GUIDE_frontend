import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import "./Auth.css";
import Input from "../../shared/components/FormElement/Input";
import Button from "../../shared/components/FormElement/Button";
import Card from "../../shared/components/UIElement/Card";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";
import axios from "axios";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = (props) => {
  const [error, setError] = useState(null);
  const clearError = () => {
    setError(null);
  };
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const switchFormHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (!isLoginMode) {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const res = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          data: formData,
        });
        if (res.data.status === "success") {
          auth.login(res.data.token, res.data.user._id);
          history.push("/");
        }
      } catch (err) {
        console.log(err.response.data.message);
        setError(err.response.data.message);
      }
    } else {
      try {
        const res = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          method: "POST",
          data: {
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          },
        });
        if (res.data.status === "success") {
          auth.login(res.data.token, res.data.userId);
          console.log(res.data.token);
          history.push("/");
        }
      } catch (err) {
        console.log(err.response.data.message);
        setError(err.response.data.message);
      }
    }
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        <h2>{!isLoginMode ? "Signup" : "Login"}</h2>
        <hr />
        <form className="place-form" onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
              errorText="please enter your name"
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="please provide an Image"
            />
          )}

          <Input
            element="input"
            id="email"
            type="email"
            label="E-email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="please enter a valid Email"
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="please enter a valid Password at least 5 charcters"
            onInput={inputHandler}
          />

          <Button type="submit" disabled={!formState.isValid}>
            {!isLoginMode ? "Signup" : "Login"}
          </Button>
        </form>
        <Button inverse onClick={switchFormHandler}>
          switch to {isLoginMode ? "signup" : "login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
