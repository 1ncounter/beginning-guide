## vue-beginner-guide 新手引导

### 介绍

基于vue，发布订阅模式的新手引导库，具备引导介绍页，上一步，下一步，跳至某一节点，自定义事件等能力，同时能够在组件内部触发事件。

### 下载

yarn
```
yarn add
```

npm
```
npm install
```

### 使用

```js
import Vue from 'vue';
import { BeginnerGuidePlugin } from '../index';

Vue.use(BeginnerGuidePlugin);
```

### 代码示例

```js
this.$guide.init({ name: 'example' });

this.$guide
  .define({ selector: 'prepare' })
  .define([{ selector: '.click' }, { selector: '.block' }])
  .define({
    selector: '.close',
    nextText: '我学会啦',
    onNext: () => { this.$guide.close() }
  });

this.$guide.start();
```

### API

##### 事件

|      事件名       |                              说明                               |                           参数                            |
| :---------------: | :-------------------------------------------------------------: | :-------------------------------------------------------: |
|       init        |                         初始化新手引导                          |                   options: 初始化的配置                   |
|      define       | 定义新手引导步骤，如果定义了prepare步骤，将会显示新手引导欢迎页 |              node: 步骤节点或步骤节点数组。               |
|       start       |                          开始新手引导                           |                             -                             |
|       close       |                     关闭新手引导，不会重置                      |                             -                             |
|       prev        |                             上一步                              |                             -                             |
|       next        |                       下一步或跳至某一步                        | index: 某一步骤的索引或者节点的selector, 不传则默认下一步 |
|      finally      |                          跳到最后一步                           |                             -                             |
| updateCurrentNode |                       更新当前步骤的内容                        |                             -                             |
|    removeSkip     |              如果已选跳过新手引导，可去除跳过标记               |                             -                             |

### 参数类型

```ts
// 新手引导参数
type Options = {
  name: string;
  background: string;
};

// 步骤节点
type Node = {
  selector: string;
  title?: string;
  desc?: string;
  showPrevBtn?: boolean;
  showNextBtn?: boolean;
  prevText?: string;
  nextText?: string;
  onPrev?: Function;
  onNext?: Function;
};
```