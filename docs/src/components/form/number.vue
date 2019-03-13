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
          type="number"
          @input="__changeValue"
        />
      </b-field>
    </div>
  </div>
</template>
<script>
  import CommonNumberMixin from './commonNumber';

  export default {
    name: 'AuttarFormNumber',
    mixins: [CommonNumberMixin],
  };
</script>
