<template>
  <div class="columns">
    <div class="column">
      <b-field
        :label="label"
        :message="placeholder"
        horizontal
      >
        <b-input
          :value="value"
          type="text"
          :maxlength="maxlength"
          @input="$emit('input', $event)"
        />
      </b-field>
    </div>
  </div>
</template>
<script>
  import CommonMixin from './common';

  export default {
    name: 'AuttarFormText',
    mixins: [CommonMixin],
  };
</script>
