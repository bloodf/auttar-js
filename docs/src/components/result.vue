<template>
  <div>
    <article
      v-for="(message, index) in value"
      :key="index"
      class="message"
      :class="{
      'is-danger': message.logLevel === 'error',
      'is-info': message.logLevel === 'info',
      }"
    >
      <div class="message-body">
        <p><strong>{{ message.date }}</strong></p>
        <hr style="margin: 5px 0"/>
        <p>
          {{ typeof message.message === 'object' && !Array.isArray(message.message)
           ? JSON.stringify(message.message)
           : message.message }}
        </p>
      </div>
    </article>
  </div>
</template>
<script>
  export default {
    name: 'AuttarResult',
    props: {
      value: {
        type: Array,
        required: false,
        default: () => ( [] ),
      }
    }
  }
</script>
