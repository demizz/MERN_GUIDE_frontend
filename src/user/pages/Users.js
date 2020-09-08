import React, { useEffect, useState, useContext } from "react";
import UsersList from "../components/UsersList";
import axios from "axios";

const Users = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setLoading(true);
      try {
        const res = await axios({
          url: `${process.env.REACT_APP_BACKEND_URL}/users/`,
        });
        if (res.data.status === "success") {
          setData(res.data.users);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        setError(err.response.data.message);
      }
    };
    sendRequest();
  }, []);

  return (
    <React.Fragment>
      {!loading && error && (
        <div className="center">
          <h2>{error}</h2>
        </div>
      )}
      {!loading && data && <UsersList items={data} />}
    </React.Fragment>
  );
};

export default Users;
