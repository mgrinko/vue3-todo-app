<script>
export default {
  props: {
    todo: Object,
  },
  emits: ["delete", "update"],
  data() {
    return {
      editing: false,
      newTitle: this.todo.title,
    };
  },
  methods: {
    toggle() {
      this.$emit("update", { completed: !this.todo.completed });
    },
    save() {
      this.editing = false;
      this.$emit("update", { title: this.newTitle });
    },
    cancel() {
      this.newTitle = this.todo.title;
      this.editing = false;
    },
  },
};
</script>

<template>
  <div class="todo" :class="{ completed: todo.completed }">
    <label class="todo__status-label">
      <input
        type="checkbox"
        class="todo__status"
        :value="todo.completed"
        @change="toggle"
      />
    </label>

    <form v-if="editing" @submit.prevent="save" @keyup.esc="cancel">
      <input
        type="text"
        class="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model="newTitle"
        :ref="
          (el) => {
            $nextTick(() => {
              el && el.focus();
            });
          }
        "
      />
    </form>

    <template v-else>
      <span class="todo__title" @dblclick="editing = true">
        {{ todo.title }}
      </span>

      <button type="button" class="todo__remove" @click="$emit('delete')">
        ×
      </button>

      <div class="modal overlay" :class="{ 'is-active': false }">
        <div class="modal-background has-background-white-ter"></div>
        <div class="loader"></div>
      </div>
    </template>
  </div>
</template>
