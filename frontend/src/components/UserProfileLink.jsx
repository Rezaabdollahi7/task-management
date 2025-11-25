// src/components/UserProfileLink.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserProfileLink = ({
  userId,
  userName,
  className = "",
  showAsLink = true,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user?.role !== "manager") {
    return <span className={className}>{userName}</span>;
  }

  if (!showAsLink) {
    return <span className={className}>{userName}</span>;
  }

  return (
    <span
      onClick={() => navigate(`/users/${userId}`)}
      className={`cursor-pointer hover:text-blue-600 hover:underline transition ${className}`}
    >
      {userName}
    </span>
  );
};

export default UserProfileLink;
