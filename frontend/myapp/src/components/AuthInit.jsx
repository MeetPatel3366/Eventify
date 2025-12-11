import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyToken } from '../store/authSlice';

// eslint-disable-next-line react/prop-types
export const AuthInit = ({ children }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth)

    useEffect(() => {
        if (localStorage.getItem("token")) {
            dispatch(verifyToken());
        } else {
            //no token -> stop loading
            dispatch({ type: "auth/verifyToken/fulfilled" });
        }
    }, [])

    if (loading) {
        return null;
    }

    return children;
}
