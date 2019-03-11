<template>
  <div>
    <h1 class="title">Retorno WS</h1>
    <p>
      {{ value }}
    </p>
  </div>
</template>
<script>
  export default {
    name: 'AuttarResult',
    props: {
      value: {
        type: Object,
        required: false,
        default: () => ( {} ),
      }
    }
  }
</script>
