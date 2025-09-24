import apiSlice from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const expenseAdapter = createEntityAdapter()

const initialState = expenseAdapter.getInitialState({})

const expenseSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExpense: builder.query({
            query: () => "/expense",
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: expenseResponse => {

                const expensesObj = expenseResponse?.expenseUser  ?? []
                const expenses = Object.values(expensesObj)
                expenses.forEach((expense) => {
                     expense.id = expense._id
                     return expense
                    }
                )
                return expenseAdapter.setAll(initialState, expenses)
            },
            //mapping over the list of ids(that i transformed) and assigning each id to the corresponding expense
            providesTags: (result) => {
                if(result?.ids){
                    return[
                        {type: "Expense", id: "LIST"},
                        ...result.ids.map(id => ({type: "Expense", id}))
                    ]
                }else return [{type: "Expense", id: "LIST"}]
            }
        }),
        createExpense: builder.mutation({
            query: initialExpenseData => ({
                url: "/expense",
                method: "POST",
                body: {...initialExpenseData}
            }),
            invalidatesTags: [{type: "Expense", id: "LIST"}]
        }),
        updateExpense: builder.mutation({
            query: updateExpense => ({
                url: `/expense`,
                method: "PATCH",
                body: updateExpense
            }),
            invalidatesTags: (result, arg) => 
                result?._id
                ?[{type: "Expense", id: arg.id}]
                :[{type: "Expense", id: "LIST"}]
        }),
        deleteExpense: builder.mutation({
            query: ({id}) => ({
                url: "/expense",
                method: "DELETE",
                body: {id}
            }),
            async onQueryStarted(id, {dispatch, queryFulfilled}){
                const result = dispatch(
                    expenseSlice.util.updateQueryData("getExpense", undefined, draft => {
                        expenseAdapter.removeOne(draft, id)
                    })
                )
                try {
                    await queryFulfilled
                } catch (error) {
                    result.undo()
                }
            }
        })
    })
})

export const{
    useGetExpenseQuery,
    useCreateExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation
} = expenseSlice

//GETTING THE OBJECT CONTAINING THE ENTITIES
export const selectExpenseResult = expenseSlice.endpoints.getExpense.select()

//GETTING ONLY THE DATA FROM THE ENTITY AND MEMOIZING THE DATA(REMEMBERS THE RESULT AND DOESN'T REFETCH EVERYTIME THE CODE IS RENDERED)
const selectExpenseData = createSelector(
    selectExpenseResult,
    initialResult => initialResult?.data
)

export const {
    selectAll: selectAllExpenses,
    selectById: selectExpenseById,
    selectIds: selectExpenseIds
} = expenseAdapter.getSelectors(state => selectExpenseData(state) ?? initialState) //TELLING REDUX WHERE THE DATA LIVES IN THE STATE IN THIS CODE THE DATA IS FOUND IN (selectExpenseData)