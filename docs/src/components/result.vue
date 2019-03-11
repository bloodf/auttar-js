<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Retorno WS</h1>
      <p>
        {{ value }}
      </p>
    </div>
  </section>
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
