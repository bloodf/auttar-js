<template>
  <div class="columns">
    <div class="column has-text-centered">
      <button
        class="button is-primary"
        style="margin-right: 20px;"
        @click="$emit('start')"
      >
        Iniciar
      </button>
      <button
        class="button is-warning"
        style="margin-right: 20px;"
        @click="$emit('reset')"
      >
        Reiniciar
      </button>
    </div>
    <div class="column has-text-centered">
      <button
        class="button is-success"
        style="margin-right: 20px;"
        @click="$emit('finish')"
      >
        Confirmar
      </button>
      <button
        class="button is-danger"
        @click="$emit('cancel')"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'AuttarActionButtons',
  };
</script>
