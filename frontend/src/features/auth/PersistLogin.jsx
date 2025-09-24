import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {jwtDecode} from "jwt-decode"
import { useRefreshQuery } from "./authApiSlice"
import { SetCredentials } from "./authSlice"
import { Outlet, useNavigate } from "react-router-dom"

const PersistLogin = () => {

  const navigate = useNavigate()

    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token)
    const [shouldRefresh, setShouldRefresh] = useState(false)
    const [hasRefreshed, setHasRefreshed] = useState(false)

    const {data, isSuccess, isLoading, isError} = useRefreshQuery(undefined, {
        skip: !shouldRefresh || hasRefreshed
    })

    useEffect(() => {
      if(!token){
        setShouldRefresh(true)
        return 
      }
      try {
        const decoded = jwtDecode(token)
        const currentTime = Date.now() / 1000
        if(decoded.exp < currentTime){
            setShouldRefresh(true)
        }
      } catch (err) {
        console.error("Error decoding token:", err)
        setShouldRefresh(true)
      }
    }, [token])

    useEffect(() => {
      if(isSuccess && data?.accessToken){
        dispatch(SetCredentials({
          accessToken: data.accessToken,
          user: jwtDecode(data.accessToken).userInfo?.email
        }))
        setHasRefreshed(true)
      }
      if(isError){
        navigate("/login")
      }
    }, [isSuccess, isError, data, dispatch, navigate])

    if(isLoading && shouldRefresh){
      return <p>Loading session...</p>
    }

  return <Outlet/>
}

export default PersistLogin
