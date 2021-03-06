import { Commit } from 'vuex';
import axios, { AxiosResponse } from 'axios';

enum Type {
  Income = 'income',
  Expense = 'expense'
}

interface Data {
  value: number;
  category: string;
  userId: number;
  type: Type;
  id?: number;
}

interface Operation {
  id: number;
  category: string;
  type: Type;
  userId: number;
  value: number;
  created_at: string;
  date?: string;
}

interface Response {
  data: {
    operation: Operation;
  };
}

interface State {
  operations: Array<Operation>;
}

interface Dates {
  id: number;
  date: string;
  operations: Array<Operation>;
}

const operationsModule = {
  state: {
    operations: [],
  },
  getters: {
    getOperations: (state: State) => {
      const isIncludeDate = (dates: Array<Dates>, operationDate: string) => {
        let index = -1;
        dates.forEach((date, i) => {
          if (date.date === operationDate) {
            index = i;
          }
        });
        return index;
      };
      const { operations } = state;
      const dates: Array<Dates> = [];
      let id = 0;
      operations.forEach((operation) => {
        const operationDate = operation.created_at.split(' ')[0];
        const isIncluding = isIncludeDate(dates, operationDate);
        if (isIncluding !== -1) {
          dates[isIncluding].operations.push(operation);
        } else {
          dates.push({
            id,
            date: operationDate,
            operations: [operation],
          });
          id += 1;
        }
      });
      return dates;
    },
    getBalance: (state: State) => {
      let balance = 0;
      if (state.operations.length) {
        state.operations.forEach((operaion) => {
          if (operaion.type === Type.Income) balance += operaion.value;
          if (operaion.type === Type.Expense) balance -= operaion.value;
        });
      }
      return balance;
    },
  },
  mutations: {
    ADD_OPERATION: (state: State, response: Response) => {
      state.operations = [response.data.operation, ...state.operations];
    },
    EDIT_OPERATION: (state: State, response: Response) => {
      state.operations.map((operation, i) => {
        if (operation.id === response.data.operation.id) {
          state.operations[i].value = response.data.operation.value;
          state.operations[i].category = response.data.operation.category;
        }
        return null;
      });
    },
    SET_OPERATIONS: (
      state: State, {
        operations,
      }: { operations: Array<Operation> },
    ) => {
      operations.forEach((operation) => state.operations.push(operation));
    },
    DELETE_OPERATION: (state: State, payload: { data: number }) => {
      state.operations = state.operations.filter(
        (operation) => operation.id !== Number(payload.data),
      );
    },
    CLEAR_STATE: (state: State) => {
      state.operations = [];
    },
  },
  actions: {
    ADD_OPERATION: (
      { commit }: { commit: Commit },
      data: Data,
    ) => new Promise((resolve) => {
      axios
        .post('http://localhost:8000/api/operations', data, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          commit('ADD_OPERATION', response);
          resolve(response);
        });
    }),
    EDIT_OPERATION: (
      { commit }: { commit: Commit },
      data: Data,
    ) => new Promise((resolve) => {
      axios
        .put(`http://localhost:8000/api/operations/${data.id}`, data, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          commit('EDIT_OPERATION', response);
          resolve(response);
        });
    }),
    GET_OPERATIONS: (
      { commit }: { commit: Commit },
      userId: number,
    ) => new Promise(() => {
      axios
        .get('http://localhost:8000/api/operations', {
          headers: {
            Authorization: localStorage.getItem('token'),
            'user-id': userId,
          },
        })
        .then((response: AxiosResponse) => {
          commit('SET_OPERATIONS', { operations: response.data.operations });
        });
    }),
    DELETE_OPERATION: (
      { commit }: { commit: Commit },
      id: number,
    ) => new Promise(() => {
      axios
        .delete(`http://localhost:8000/api/operations/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response: AxiosResponse) => {
          commit('DELETE_OPERATION', response);
        });
    }),
  },
};

export default operationsModule;
