import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { currentUser } = useAppSelector((state) => state.user);
  const isAuthenticated = currentUser;
  return isAuthenticated ? children : <Navigate to="/login" />;
}
