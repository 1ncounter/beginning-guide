<template>
  <div class="beginer-guide__focus-layer">
    <div class="mask top" :style="maskStyle.top"></div>
    <div class="mask left" :style="maskStyle.left"></div>
    <div class="mask right" :style="maskStyle.right"></div>
    <div class="mask bottom" :style="maskStyle.bottom"></div>

    <div class="anchor-tip" ref="anchorTip" :style="anchorStyle.style">
      <div class="info-window">
        <div class="title">{{ node.title || '步骤说明' }}</div>
        <div class="desc" v-if="node.desc">{{ node.desc }}</div>

        <div class="btns">
          <div
            class="btn prev"
            v-if="node.showPrevBtn || node.prevText"
            @click="onPrev"
          >
            {{ node.prevText || '上一步' }}
          </div>
          <div
            class="btn next"
            :class="{ 'is-disabled': node.nextDisabled }"
            v-if="node.showNextBtn || node.nextText"
            @click="onNext"
          >
            {{ node.nextText || '下一步' }}
          </div>
        </div>

        <div class="arrow" :style="anchorStyle.arrow"></div>
      </div>
      <div class="v-line" :style="anchorStyle.line"></div>
      <div class="anchor" :style="anchorStyle.anchor"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FocusLayer',
  props: {
    node: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      anchorPosition: {
        position: 'top',
        posStyle: {}
      },

      // 修正rect获取的anchor高度出现帧数不同导致的高度不同的问题
      anchorHeight: 0,
      currentAnchorHeight: 0
    };
  },
  computed: {
    nodeRect() {
      const focusNode = document.querySelector(this.node.selector);

      if (focusNode) {
        return focusNode.getBoundingClientRect();
      }

      return {};
    },
    maskStyle() {
      const { left, top, width, height } = this.nodeRect;

      const maskLeft = left - 5;
      const maskTop = top - 5;
      const maskWidth = width + 10;
      const maskHeight = height + 10;

      return {
        left: {
          background: this.options.background,
          top: maskTop + 'px',
          width: maskLeft + 'px',
          height: maskHeight + 'px'
        },
        top: {
          background: this.options.background,
          height: maskTop + 'px'
        },
        right: {
          background: this.options.background,
          top: maskTop + 'px',
          width: `calc(100% - ${maskWidth + maskLeft}px)`,
          height: maskHeight + 'px'
        },
        bottom: {
          background: this.options.background,
          top: maskTop + maskHeight + 'px'
        }
      };
    },
    anchorStyle() {
      const { position, posStyle } = this.anchorPosition;

      const styleMap = {
        top: {
          direct: 'bottom',
          adeg: 225,
          ldeg: 0,
          margin: 'left'
        },
        left: {
          direct: 'right',
          adeg: 135,
          ldeg: 90,
          margin: 'top'
        },
        bottom: {
          direct: 'top',
          adeg: 45,
          ldeg: 0,
          margin: 'left'
        },
        right: {
          direct: 'left',
          adeg: 315,
          ldeg: -90,
          margin: 'top'
        }
      };

      const arrow = {};
      const line = {};
      const anchor = {};

      arrow[styleMap[position].direct] = '-6px';
      arrow[styleMap[position].margin] = '14px';
      arrow['transform'] = `rotate(${styleMap[position].adeg}deg)`;

      line[styleMap[position].direct] = '-26.5px';
      line[styleMap[position].margin] = '20px';
      line['transform'] = `rotate(${styleMap[position].ldeg}deg)`;

      anchor[styleMap[position].direct] = '-30px';
      anchor[styleMap[position].margin] = '17px';

      return {
        style: posStyle,
        arrow,
        line,
        anchor
      };
    }
  },
  methods: {
    onPrev() {
      if (this.node.onPrev) {
        this.node.onPrev();
      } else {
        this.$guide.prev();
      }
    },
    onNext() {
      if (this.node.nextDisabled) return;

      if (this.node.onNext) {
        this.node.onNext();
      } else {
        this.$guide.next();
      }
    },

    getAnchorPosition() {
      const extrawide = 45;
      const {
        top,
        left,
        right,
        bottom,
        width: rWidth,
        height: rHeight
      } = this.nodeRect;
      const posStyle = {};
      let position = 'top';

      const node = this.$refs['anchorTip'];

      if (node) {
        let { width, height } = node.getBoundingClientRect();

        this.anchorHeight = height;
        setTimeout(() => {
          this.currentAnchorHeight = node.getBoundingClientRect().height;
        });

        height += extrawide;
        width += extrawide;

        if (top > height) {
          position = 'top';
        } else if (left > width) {
          position = 'left';
        } else if (right > width) {
          position = 'right';
        } else if (bottom > height) {
          position = 'bottom';
        }

        if (position === 'left') {
          posStyle['top'] = this.maskStyle.left.top;
          posStyle['left'] = left - width + 'px';
        } else if (position === 'right') {
          posStyle['top'] = this.maskStyle.left.top;
          posStyle['left'] = left + rWidth + extrawide + 'px';
        } else if (position === 'top') {
          posStyle['top'] = top - height + 'px';
          posStyle['left'] = left + 'px';
        } else {
          posStyle['top'] = top + rHeight + extrawide + 'px';
          posStyle['left'] = left + 'px';
        }

        posStyle['animationName'] = 'anchor' + position;
      }

      return {
        position,
        posStyle
      };
    }
  },
  watch: {
    nodeRect: {
      handler() {
        this.$nextTick(() => {
          this.anchorPosition = this.getAnchorPosition();
        });
      },
      immediate: true
    },
    currentAnchorHeight(val) {
      if (
        val !== this.anchorHeight &&
        ['top', 'bottom'].includes(this.anchorPosition.position)
      ) {
        this.anchorPosition = this.getAnchorPosition();
      }
    }
  }
};
</script>

<style lang="scss">
.beginer-guide__focus-layer {
  width: 100%;
  height: 100%;
  pointer-events: none;

  .mask {
    position: absolute;
    pointer-events: auto;

    &.top,
    &.bottom {
      width: 100%;
      left: 0;
    }

    &.top {
      top: 0;
    }

    &.bottom {
      bottom: 0;
    }

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }

  .anchor-tip {
    position: absolute;
    z-index: 10;
    pointer-events: auto;
    animation-duration: 2s;
    animation-iteration-count: infinite;

    &:hover {
      animation-play-state: paused;
    }

    .info-window {
      position: relative;
      padding: 10px 15px;
      min-width: 150px;
      max-width: 300px;
      background: #ffffff;
      border: 1px solid #fff;
      border-radius: 4px;

      .title {
        color: #333;
        font-size: 14px;
      }

      .desc {
        color: #999;
        font-size: 12px;
      }

      .btns {
        min-height: 0;
        font-size: 12px;
        text-align: right;
        color: #333;

        .btn {
          display: inline-block;
          margin-top: 10px;
          cursor: pointer;
          user-select: none;

          &.is-disabled {
            cursor: not-allowed;
          }
        }

        .prev {
          text-decoration: underline;
        }
        .next {
          margin-left: 10px;
          padding: 3px 10px;
          background: #01acf3;
          color: #ffffff;
          border-radius: 4px;

          &.is-disabled {
            background-color: #a0cfff;
          }
        }
      }

      .arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: #fff;
        border-left: 1px solid #fff;
        border-top: 1px solid #fff;
      }
    }

    .v-line {
      position: absolute;
      width: 1px;
      height: 20px;
      background: #fff;
      transform-origin: top center;
    }

    .anchor {
      position: absolute;
      width: 7px;
      height: 7px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 0 7px rgba(255, 255, 255, 0.25);
    }
  }
}

@keyframes anchortop {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes anchorleft {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes anchorright {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateX(10px);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes anchorbottom {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
