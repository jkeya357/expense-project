import apiSlice from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const incomeAdapter = createEntityAdapter({
    selectId: (income) => income._id
})
const initialState = incomeAdapter.getInitialState()

const incomeSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        getIncome: builder.query({
            query: () =>  "/income",
            validateStatus: (response, result) =>{

                return response.status === 200 && !result.isError
            },
            transformResponse: incomeResponse => {

                const incomesObj = incomeResponse?.incomeUsers ?? {}
                const incomes = Object.values(incomesObj)
                incomes.forEach((income) => {
                    income.id = income._id
                    return income
                })
                return incomeAdapter.setAll(initialState, incomes)
            },
            providesTags: (result) => {
                if(result?.ids){
                    return[
                        {type: "Income", id: "LIST"},
                        ...result.ids.map(id => ({type: "Income", id}))
                    ]
                }else {
                    return [{type: "Income", id: "LIST"}]
                }
                
            }
        }),
        createIncome: builder.mutation({
            query: initialIncomeData => ({
                url: "/income",
                method: "POST",
                body: {...initialIncomeData}
            }),
            invalidatesTags: [{type: "Income", id: "LIST"}]
        }),
        updateIncome: builder.mutation({
            query: updateData => ({
                url: "/income",
                method: "PATCH",
                body: updateData
            }),
            invalidatesTags: (result,arg) => 
            result?._id 
                ?[{type: "Income", id: arg.id}]
                :[{type: "Income", id: "LIST"}]

        }),
        deleteIncome: builder.mutation({
            query: ({id}) => ({
                url: "/income",
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

export const {
    useGetIncomeQuery,
    useCreateIncomeMutation,
    useUpdateIncomeMutation,
    useDeleteIncomeMutation
} = incomeSlice

export const selectIncomeResult = incomeSlice.endpoints.getIncome.select()

const selectIncomeData = createSelector(
    selectIncomeResult,
    incomeResult => incomeResult?.data
)

export const{
    selectAll: selectAllIncomes,
    selectById: selectIncomeById,
    selectIds: selectIncomeIds
} = incomeAdapter.getSelectors(state => selectIncomeData(state) ?? initialState)