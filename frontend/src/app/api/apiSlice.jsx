import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SetCredentials } from '../../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const baseQuery = fetchBaseQuery({
        baseUrl: "https://expense-project-j7ka.onrender.com",
        credentials: "include",
        prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.token
            if(token){
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        }
    })

const fetchRefreshAuth = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions)

    if(result?.error?.status === 403 || result?.error?.status === 401){

        console.log("Access token expired, attempting refresh...");

        const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

        if(refreshResult?.data){

            const decoded = jwtDecode(refreshResult.data.accessToken)
            const email = decoded?.userInfo?.email
            const user = decoded?.userInfo?.user

            console.log("Decoded Token from backend:",decoded)
            console.log("Decoded email from token:", email)

            api.dispatch(SetCredentials({
                accessToken: refreshResult.data.accessToken,
                user,
                email
            }))

            result = await baseQuery(args, api, extraOptions)

        }else {

            if(refreshResult?.error?.status === 403){
                
                refreshResult.error.data.message = "Your login has expired"
            }

             return refreshResult
        }
    }
    
    return result
}

const apiSlice = createApi({
    baseQuery: fetchRefreshAuth,
    tagTypes: ["User", "Expense", "Income"],
    endpoints: builder => ({})
})

export default apiSlice

