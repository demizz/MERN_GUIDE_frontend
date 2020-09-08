import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import axios from "axios";
const UserPlaces = (props) => {
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const clearError = () => {
    setError(null);
  };
  const userId = useParams();

  useEffect(() => {
    setLoading(true);
    const sendRequest = async () => {
      try {
        const res = await axios({
          url: auth.currentUserId
            ? `${process.env.REACT_APP_BACKEND_URL}/places/user/${auth.currentUserId}`
            : `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId.userId}`,
        });
        if (res.data.status === "success") {
          setData(res.data.places);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };
    sendRequest();
  }, []);
  const deletePlaceHandler = (todelete) => {
    setData((prevData) => prevData.filter((place) => place._id !== todelete));
  };
  return (
    <React.Fragment>
      {!loading && !data && (
        <div className="center">
          <h2>{error}</h2>
        </div>
      )}
      {loading && !data && <LoadingSpinner />}
      {!loading && data && (
        <PlaceList items={data} deletePlace={deletePlaceHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
