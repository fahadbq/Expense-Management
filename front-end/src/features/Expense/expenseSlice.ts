import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store/store";
import { api } from "../../app/services/api";

export const getExpenses = createAsyncThunk("expenseSlice/getExpenses", () => {
  return api.homeAdministration.getExpenses();
});

//Create Expense
export const createExpense = createAsyncThunk(
  "expenseSlice/createExpense",
  (data: object) => {
    return api.homeAdministration.createExpense(data);
  }
);

export const getCategories = createAsyncThunk(
  "expenseSlice/getCategories",
  () => {
    return api.homeAdministration.getCategories();
  }
);

//Create Expense
export const updateExpense = createAsyncThunk(
  "expenseSlice/updateExpense",
  (data: object) => {
    return api.homeAdministration.updateExpense(data);
  }
);

export const deleteExpense = createAsyncThunk(
  "authenticationSlice/deleteExpense",
  (id: any, thunkAPI) => {
    const response = api.homeAdministration.deleteExpense(id);

    thunkAPI.dispatch(toggleShowUndoAlert(true));
    thunkAPI.dispatch(getUndoDeleteId(id));
    return response;
  }
);

export const undoDeletedExpense = createAsyncThunk(
  "authenticationSlice/undoDeletedExpense",
  (id: object) => {
    return api.homeAdministration.undoDeletedExpense(id);
  }
);

//Transform Data
const transformCategories = (rawData: object[]) => {
  const result = rawData.map((obj: any) => {
    return {
      ...obj,
      value: obj._id,
      label: obj.name,
    };
  });
  return result;
};

export interface HomeState {
  expensesLoading: boolean | undefined;
  expensesData: object[] | undefined;
  expensesError: string | undefined;

  createExpenseLoading: boolean | undefined;
  createExpenseError: string | undefined;

  categoriesLoading: boolean | undefined;
  categoriesData: object[] | undefined;
  categoriesError: string | undefined;

  updateExpenseLoading: boolean | undefined;
  updateExpenseError: string | undefined;

  deleteExpenseLoading: boolean;
  deleteExpenseError: string | undefined;
  // value: number;
  // status: "idle" | "loading" | "failed";
  undoDeleteExpenseLoading: boolean | undefined;
  undoDeleteData: object | undefined;
  undoDeleteExpenseError: string | undefined;

  showUndoAlert: boolean | undefined;

  undoDeleteId: string | undefined;
}

const initialState: HomeState = {
  expensesLoading: false,
  expensesData: [],
  expensesError: "",

  createExpenseLoading: false,
  createExpenseError: "",

  categoriesLoading: false,
  categoriesData: [],
  categoriesError: "",

  updateExpenseLoading: false,
  updateExpenseError: "",

  deleteExpenseLoading: false,
  deleteExpenseError: "",

  undoDeleteExpenseLoading: false,
  undoDeleteData: {},
  undoDeleteExpenseError: "",

  //Redux state
  showUndoAlert: false,

  undoDeleteId: "",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const expenseSlice = createSlice({
  name: "expenseSlice",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.

    /* View Template */
    toggleShowUndoAlert: (prevState, action: PayloadAction<boolean>) => {
      const state = prevState;
      state.showUndoAlert = !state.showUndoAlert;
    },
    // /* reset states */
    // reset: () => initialState,
    // // set rate types of skill when skill changes
    getUndoDeleteId: (prevState, action) => {
      const state = prevState;
      state.undoDeleteId = action.payload.id || [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getExpenses.pending, (state) => {
        state.expensesLoading = true;
        state.expensesData = [];
        state.expensesError = "";
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.expensesLoading = false;
        state.expensesData = action.payload?.data;
        state.expensesError = "";
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.expensesLoading = false;
        state.expensesData = [];
        state.expensesError = action.error?.message;
      })

      //Create Expense

      .addCase(createExpense.pending, (state) => {
        state.createExpenseLoading = true;
        state.createExpenseError = "";
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        console.log("action", action);
        state.createExpenseLoading = false;
        state.createExpenseError = "";
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.createExpenseLoading = false;
        state.createExpenseError = action.error?.message;
      })

      .addCase(getCategories.pending, (state) => {
        state.categoriesLoading = false;
        state.categoriesData = [];
        state.categoriesError = "";
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categoriesData = transformCategories(action.payload.data || []);
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesData = [];
        state.categoriesError = action.error?.message;
      })

      //Update
      .addCase(updateExpense.pending, (state) => {
        state.updateExpenseLoading = false;
        state.updateExpenseError = "";
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updateExpenseLoading = false;
        state.updateExpenseError = "";
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updateExpenseLoading = false;
        state.updateExpenseError = action.error?.message;
      })

      //Delete
      .addCase(deleteExpense.pending, (state) => {
        state.deleteExpenseLoading = true;
        state.deleteExpenseError = "";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleteExpenseLoading = false;
        state.deleteExpenseError = "";
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleteExpenseLoading = true;
        state.deleteExpenseError = action.error?.message;
      })

      //Undo Delete
      .addCase(undoDeletedExpense.pending, (state) => {
        state.undoDeleteExpenseLoading = true;
        state.undoDeleteData = {};
        state.undoDeleteExpenseError = "";
      })
      .addCase(undoDeletedExpense.fulfilled, (state, action) => {
        console.log("action", action);
        state.undoDeleteExpenseLoading = false;
        state.undoDeleteData = action.payload;
        state.undoDeleteExpenseError = "";
      })
      .addCase(undoDeletedExpense.rejected, (state, action) => {
        state.undoDeleteExpenseLoading = true;
        state.undoDeleteData = {};
        state.undoDeleteExpenseError = action.error?.message;
      });
  },
});

// export const { increment, decrement, incrementByAmount } = userAuthSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state

// export default expenseSlice.reducer;

const { actions, reducer: expenseReducer } = expenseSlice;

export const {
  toggleShowUndoAlert,
  getUndoDeleteId,
  // setJobOrdersQuickFilter,
} = actions;

export default expenseReducer;
