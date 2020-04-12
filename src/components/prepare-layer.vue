<template>
  <div
    class="beginer-guide__prepare-layer"
    :style="{ background: options.background }"
  >
    <div class="dialog">
      <div class="title">{{ node.title || '欢迎使用新手引导' }}</div>
      <div class="desc">
        {{
          node.desc ||
            '下面将为您介绍本功能页面的布局和操作步骤，请跟随引导完成操作'
        }}
      </div>

      <template v-if="node.selector === 'prepare'">
        <div class="skip">
          <label
            ><input type="checkbox" v-model="isSkip" />
            {{ node.ignoreText || '以后不再提示' }}</label
          >
        </div>
        <div class="btns">
          <button class="jump" @click="onJump">
            {{ node.prevText || '跳过引导' }}
          </button>
          <button class="join" @click="onJoin">
            {{ node.nextText || '进入引导' }}
          </button>
        </div>
      </template>
      <template v-else-if="node.selector === 'final'">
        <div class="btns">
          <button class="join" @click="onClose">
            {{ node.nextText || '我学会啦' }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrepareLayer',
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    options: Object
  },
  data() {
    return {
      isSkip: false
    };
  },
  methods: {
    onJump() {
      this.$guide.close();

      this.$guide.emit('skip');
    },
    onJoin() {
      if (this.node.onNext) {
        this.node.onNext();
      } else {
        this.$guide.next();
      }

      this.$guide.emit('join');
    },
    onClose() {
      if (this.node.onNext) {
        this.node.onNext();
      } else {
        this.$guide.close();
      }
    }
  },
  watch: {
    isSkip(val) {
      if (val) {
        this.$guide.addSkipSign();
      } else {
        this.$guide.removeSkipSign();
      }
    }
  }
};
</script>

<style lang="scss">
.beginer-guide__prepare-layer {
  width: 100%;
  height: 100%;
  pointer-events: auto;

  .dialog {
    position: absolute;
    top: 35%;
    left: 50%;
    padding: 20px;
    width: 300px;
    background: #ffffff;
    border-radius: 5px;
    transform: translate(-50%);
    box-sizing: border-box;

    .title {
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }

    .desc {
      margin-top: 10px;
      font-size: 14px;
      color: #999;
    }

    .skip {
      margin-top: 10px;
      font-size: 14px;
      color: #666;

      input[type='checkbox'] {
        width: 20px;
        height: 20px;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        line-height: 18px;
        position: relative;
      }
    }

    .btns {
      margin-top: 10px;
      text-align: center;

      button {
        width: 78px;
        height: 32px;
        border: none;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        user-select: none;

        & + button {
          margin-left: 20px;
        }
      }

      .jump {
        border: 1px solid #ccc;
        color: #666;
        background: #fff;

        &:hover {
          border-color: #01acf3;
          color: #01acf3;
        }
      }

      .join {
        color: #fff;
        background: #01acf3;

        &:hover {
          background: #66b1ff;
        }
      }
    }
  }
}
</style>
