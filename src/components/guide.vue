<template>
  <div class="beginer-guide">
    <prepare-layer
      v-if="node.selector === 'prepare' || node.selector === 'final'"
      :node="node"
      :options="options"
    ></prepare-layer>
    <focus-layer v-else :node="node" :options="options"></focus-layer>
  </div>
</template>

<script>
import FocusLayer from './focus-layer';
import PrepareLayer from './prepare-layer';

export default {
  name: 'BeginnerGuide',
  components: {
    FocusLayer,
    PrepareLayer
  },
  data() {
    return {
      options: {
        name: 'default',
        background: 'rgba(0, 0, 0, .5)'
      },
      node: {}
    };
  }
};
</script>

<style lang="scss">
.beginer-guide {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
  pointer-events: none;
}
</style>
