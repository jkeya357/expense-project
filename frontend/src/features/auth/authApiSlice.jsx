import { useDispatch } from "react-redux";
import apiSlice from "../../app/api/apiSlice";
import { SetCredentials, logout } from "./authSlice";
import { jwtDecode } from "jwt-decode";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credential => ({
                url: "/auth/login",
                method: "POST",
                body: {...credential},
                credentials: "include"
            })
        }),
          signup: builder.mutation({
            query: initialUserData => ({
                url: "auth/signup",
                method: "POST",
                body: {
                    ...initialUserData
                }
            }),
            invalidatesTags: [{type: "User", id: "LIST"}]
        }),
        sendLogout: builder.mutation({
            query: credentials => ({
                url: "/auth/logout",
                method: "POST",
                body: {...credentials}
            }),
             async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    await queryFulfilled()
                    dispatch(logout())
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    })
                } catch (error) {
                    console.log("error logging out", error)
                }
            }
        }),
        refresh: builder.query({
            query: () => ({
              url: "/auth/refresh",
              method: "GET"  
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try {
                    const {data} = await queryFulfilled()
                    const {accessToken} = data

                    const decoded = jwtDecode(accessToken)
                    const id = decoded?.userInfo.id
                    const email = decoded?.userInfo?.email
                    
                    dispatch(SetCredentials({accessToken, id, email}))
                } catch (error) {
                    console.log("Error in receiving an accessToken", error)
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSignupMutation,
    useSendLogoutMutation,
    useRefreshQuery
} = authApiSlice