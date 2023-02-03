<script>
import TodoItem from "./TodoItem.vue";
import AppLoader from "./AppLoader.vue";
import * as todosAPI from "./api/todos";

export default {
  components: {
    TodoItem,
    AppLoader,
  },
  data() {
    return {
      newTitle: "",
      errorMessage: "",
      selectedTodoId: 0,
      loaded: false,
      filter: "all",
      todos: [],
    };
  },
  computed: {
    activeTodos() {
      return this.todos.filter((todo) => !todo.completed);
    },
    completedTodos() {
      return this.todos.filter((todo) => todo.completed);
    },
    visibleTodos() {
      switch (this.filter) {
        case "active":
          return this.activeTodos;

        case "completed":
          return this.completedTodos;

        default:
          return this.todos;
      }
    },
  },
  mounted() {
    todosAPI.getUserTodos()
      .then(todos => {
        this.todos = todos;
      })
      .catch(() => {
        this.errorMessage = "Can't load todos";
      })
      .finally(() => {
        this.loaded = true;
      });
  },
  methods: {
    async addTodo() {
      if (!this.newTitle) {
        return;
      }

      const newTodo = await createTodo({
        title: this.newTitle,
        completed: false,
        userId: 4110,
      });

      this.todos.push(newTodo);
      this.newTitle = "";
    },
    async deleteTodo(todoId) {
      await todosAPI.deleteTodo(todoId)
    
      this.todos = this.todos.filter(todo => todo.id !== todoId);
    },
    async updateTodo(todoToUpdate) {
      const updatedTodo = await todosAPI.updateTodo(todoToUpdate);

      this.todos = this.todos.map(
        todo => todo.id === updatedTodo.id ? updatedTodo : todo,
      );
    }
  },
};
</script>

<template>
  <div class="todoapp">
    <h1 class="todoapp__title">todos</h1>

    <div class="todoapp__content">
      <header class="todoapp__header">
        <button type="button" class="todoapp__toggle-all active"></button>

        <form @submit.prevent="addTodo">
          <input
            v-model="newTitle"
            class="todoapp__new-todo"
            placeholder="What needs to be done?"
          />
        </form>
      </header>

      <AppLoader v-if="!loaded" />

      <template v-else>
        <section class="todoapp__main" v-if="visibleTodos.length">
          <TodoItem
            v-for="todo of visibleTodos"
            :key="todo.id"
            :todo="todo"
            @delete="deleteTodo(todo.id)"
            @update="Object.assign(todo, $event)"
          />
        </section>

        <footer class="todoapp__footer" v-if="todos.length > 0">
          <span class="todo-count">{{ activeTodos.length }} items left </span>

          <nav class="filter">
            <a
              href="#/"
              class="filter__link"
              :class="{ selected: filter === 'all' }"
              @click="filter = 'all'"
            >
              All
            </a>

            <a
              href="#/active"
              class="filter__link"
              :class="{ selected: filter === 'active' }"
              @click="filter = 'active'"
            >
              Active
            </a>

            <a
              href="#/completed"
              class="filter__link"
              :class="{ selected: filter === 'completed' }"
              @click="filter = 'completed'"
            >
              Completed
            </a>
          </nav>

          <button type="button" class="todoapp__clear-completed">
            Clear completed
          </button>
        </footer>
      </template>
    </div>

    <div
      class="notification is-danger is-light has-text-weight-normal"
      :class="{ hidden: !errorMessage }"
    >
      <button class="delete" @click="errorMessage = ''"></button>

      {{ errorMessage }}
    </div>
  </div>
</template>

<style lang="scss">
iframe {
  display: none;
}

html {
  background-color: #fff;
}

body {
  min-width: 230px;
  max-width: 550px;
  margin: 0 auto;
}

.notification {
  transition-property: opacity, min-height;
  transition-duration: 1s;
  min-height: 36px;
}

.notification.hidden {
  min-height: 0;
  opacity: 0;
  pointer-events: none;
}

.todoapp {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: 300;
  color: #4d4d4d;
  margin: 40px 20px;

  &__content {
    margin-bottom: 20px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  &__title {
    font-size: 100px;
    font-weight: 100;
    text-align: center;
    color: rgba(175, 47, 47, 0.15);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  &__header {
    position: relative;
  }

  &__toggle-all {
    position: absolute;

    height: 100%;
    width: 45px;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 24px;
    color: #e6e6e6;

    border: 0;
    background-color: transparent;
    cursor: pointer;

    &.active {
      color: #737373;
    }

    &:before {
      content: "❯";
      transform: translateY(2px) rotate(90deg);
      line-height: 0;
    }
  }

  &__new-todo {
    width: 100%;
    padding: 16px 16px 16px 60px;

    font-size: 24px;
    line-height: 1.4em;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    border: none;
    background: rgba(0, 0, 0, 0.01);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);

    &::placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }
  }

  &__main {
    border-top: 1px solid #e6e6e6;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    box-sizing: content-box;
    height: 20px;
    padding: 10px 15px;

    font-size: 14px;

    color: #777;
    text-align: center;
    border-top: 1px solid #e6e6e6;

    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
      0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
      0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }

  &__clear-completed {
    margin: 0;
    padding: 0;
    border: 0;

    font-family: inherit;
    font-weight: inherit;
    color: inherit;
    text-decoration: none;

    cursor: pointer;
    background: none;

    -webkit-appearance: none;
    appearance: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:hover {
      text-decoration: underline;
    }

    &:active {
      text-decoration: none;
    }
  }
}

.todo {
  position: relative;

  display: grid;
  grid-template-columns: 45px 1fr;
  justify-items: stretch;

  font-size: 24px;
  line-height: 1.4em;
  border-bottom: 1px solid #ededed;

  &:last-child {
    border-bottom: 0;
  }

  &__status-label {
    cursor: pointer;
    background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center left;
  }

  &.completed &__status-label {
    background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
  }

  &__status {
    opacity: 0;
  }

  &__title {
    padding: 12px 15px;

    word-break: break-all;
    transition: color 0.4s;
  }

  &.completed &__title {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  &__remove {
    position: absolute;
    right: 12px;
    top: 0;
    bottom: 0;

    font-size: 120%;
    line-height: 1;
    font-family: inherit;
    font-weight: inherit;
    color: #cc9a9a;

    float: right;
    border: 0;
    background: none;
    cursor: pointer;

    transform: translateY(-2px);
    opacity: 0;
    transition: color 0.2s ease-out;

    &:hover {
      color: #af5b5e;
    }
  }

  &:hover &__remove {
    opacity: 1;
  }

  &__title-field {
    width: 100%;
    padding: 11px 14px;

    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    font-weight: inherit;
    color: inherit;

    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);

    &::placeholder {
      font-style: italic;
      font-weight: 300;
      color: #e6e6e6;
    }
  }

  .overlay {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;

    opacity: 0.5;
  }
}

.filter {
  display: flex;

  &__link {
    margin: 3px;
    padding: 3px 7px;

    color: inherit;
    text-decoration: none;

    border: 1px solid transparent;
    border-radius: 3px;

    &:hover {
      border-color: rgba(175, 47, 47, 0.1);
    }

    &.selected {
      border-color: rgba(175, 47, 47, 0.2);
    }
  }
}
</style>
