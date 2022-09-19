import { useEffect, useState } from "react";
import UserList from "../components/auth/UserList";

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("/api/user/list", requestOptions)
      .then((response) => response.json())
      .then((result) => setUsers(result))
      .catch((error) => console.log("error", error));
  }, []);

  return <UserList users={users} />;
};

export default UserListPage;
