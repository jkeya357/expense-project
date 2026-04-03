import apiSlice from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const userAdapter = createEntityAdapter()

const initialState = userAdapter.getInitialState({})

const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getUser: builder.query({
            query: () => "/users",
            validateStatus: (response, result)=>{
                return response.status === 200 && !result.error
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user =>{
                    user.id = user._id
                    return user 
                })
                return userAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result)=>{
                if(result?.ids){
                    return [
                        {type: "User", id: "LIST"},
                        ...result.ids.map(id => ({type: "User", id}))
                    ]
                }else return [{type: "User", id: "LIST"}]
            }
        }),
        findUserByEmail: builder.query({
            query: (email) => ({
                url: `/users/${email}`,
                method: "GET"
            }),
            providesTags: (result, error, email) => [
                { type: "User", id: result?._id }
            ]
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: "/users",
                method: "PATCH",
                body: {...formData},
                formData: true
            }),
            invalidatesTags: (arg) => [{type: "User", id: arg.id}]
        }),
        deleteUser: builder.mutation({
            query: ({id}) => ({
                url: "/users",
                method: "DELETE",
                body: {id}
            }),
            invalidatesTags: (arg) => [
                {type: "User", id: arg.id}
            ]
        })
    })
})


export const {
    useGetUserQuery,
    useFindUserByEmailQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} = usersApiSlice

const selectUsersResult = usersApiSlice.endpoints.getUser.select()

const usersResult = createSelector(
    selectUsersResult,
    resultData => resultData?.data
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = userAdapter.getSelectors(state => usersResult(state) ?? initialState)

