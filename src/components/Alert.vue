<template>
  <div
    v-if="error != ''"
    class="alert alert-danger alert-dismissible fade show"
    role="alert"
    @click="dismisClicked"
  >
    <strong>Error</strong> {{ error }}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    error: String,
    dismisClicked: Function,
  },
};
</script>
