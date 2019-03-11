import CommonMixin from './common';

export default {
  mixins: [CommonMixin],
  props: {
    value: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    __changeValue(value) {
      if (!value) this.__emitValue(0);
      if ((typeof value === 'number' || typeof value === 'string') && !isNaN(value)) {
        this.__emitValue(parseFloat(value));
      }
    },

    __emitValue(value) {
      this.$emit('input', value);
    }
  },
};
