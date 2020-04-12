<template>
  <div id="app">
    <button @click="start">开始</button>

    <div class="container">
      <span class="click" @click="onClick">adsd</span>
    </div>

    <div class="block" @click="onClick"></div>
    <div class="block2" @click="onClick"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$guide.init();
    this.$guide
      .define({ selector: '.click' })
      .define({ selector: '.block' })
      .define({ selector: '.block2' });
  },
  methods: {
    start() {
      this.$guide.start();
    },
    onClick() {
      this.$guide.next();
    },
    onClick2() {
      this.$guide.close();
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC';
}

.container {
  position: absolute;
  right: 50px;
  top: 60px;
  width: 300px;
  height: 400px;
}

.block {
  width: 400px;
  height: 400px;
  margin-top: 30px;
  background: #f00;
}

.block2 {
  width: 300px;
  height: 100px;
  margin-top: 20px;
  background: #ff0;
}
</style>
