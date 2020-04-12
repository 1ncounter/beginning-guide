import Vue from 'vue';
import GuideView from './components/guide.vue';
import { Store } from './store';
import { EventBus } from './event-bus';

export type Node = {
  selector: string;
  title?: string;
  desc?: string;
  showPrevBtn?: boolean;
  showNextBtn?: boolean;
  prevText?: string;
  nextText?: string;
  onPrev?: Function;
  onNext?: Function;
  nextDisabled?: boolean;
};

type Options = {
  name: string;
  background: string;
  steps?: Node[] | Node;
};

const defaultOptions: Partial<Options> = {
  name: 'default',
  background: 'rgba(0, 0, 0, .5)'
};

export const bus = new EventBus();

export class BeginnerGuide {
  private options: Partial<Options> = {};
  private instance: any = null;
  private store: Store = new Store();

  public isGuiding = false;

  /**
   * 初始化新手引导
   * @returns void
   */
  init({ steps, ...options }: Partial<Options> = defaultOptions) {
    this.options = Object.assign({}, options);

    if (this.hasSkipSign()) return;

    if (this.store.hasState()) this.clear();
    if (!this.instance) this.initInstance();

    if (steps) this.define(steps);
  }

  /**
   * 定义新手引导的步骤节点
   * @param {Node | Node[]} nodes 单个步骤节点或者数组
   * @returns this
   */
  define(nodes: Node | Node[]) {
    if (this.hasSkipSign()) return;

    if (!Array.isArray(nodes)) nodes = [nodes];

    this.store.addState(nodes);

    nodes.forEach(node => {
      bus.on(node.selector, () => {
        this.changeView(node);
      });
    });

    return this;
  }

  /**
   * 开始新手引导
   */
  start() {
    if (!this.hasSkipSign()) {
      this.isGuiding = true;

      this.show();
      this.store.setStateByIndex(0);
    }
  }

  /**
   * 关闭新手引导
   */
  close() {
    this.isGuiding = false;

    this.hide();
    this.instance.node = {};
  }

  /**
   * 清除新手引导的定义
   */
  clear() {
    this.store.clear();
    bus.clearListeners();
  }

  /**
   * 上一步
   */
  prev() {
    this.store.prevState();
  }

  /**
   * 下一步
   * @param index 定义的步数索引或selector
   */
  next(index?: number | string) {
    if (this.store.isLastState()) {
      this.close();
    } else {
      if (index) {
        if (typeof index === 'number') {
          this.store.setStateByIndex(index);
        } else {
          this.store.setStateBySelector(index);
        }
      } else {
        this.store.nextState();
      }
    }
  }

  /**
   * 跳至最后一步
   */
  finally() {
    this.store.setStateByIndex(this.store.getStateNumbers() - 1);
  }

  /**
   * 获取当前步骤信息
   */
  getCurrentNode(): Node {
    return this.instance.node;
  }

  /**
   * 更新当前步骤节点数据
   * @param node
   */
  updateCurrentNode(node: Node | Partial<Node>) {
    this.instance.node = { ...this.instance.node, ...node };
  }

  /**
   * 添加跳过新手引导标记，添加之后新手引导不再显示
   */
  addSkipSign() {
    localStorage.setItem(`g-${this.options.name}-skip`, 'on');
  }

  /**
   * 移除跳过新手引导标记
   */
  removeSkipSign() {
    if (this.hasSkipSign()) {
      localStorage.removeItem(`g-${this.options.name}-skip`);
    }
  }

  /**
   * 判断是否需要跳过新手引导
   */
  hasSkipSign(): boolean {
    return localStorage.getItem(`g-${this.options.name}-skip`) === 'on';
  }

  on(name: string, callback: Function) {
    bus.on(name, callback);
  }

  emit(name: string) {
    bus.emit(name);
  }

  off(name: string, callback: Function) {
    bus.off(name, callback);
  }

  initInstance() {
    const ViewConstructor = Vue.extend(GuideView);

    const instance = new ViewConstructor({
      el: document.createElement('div'),
      data: {
        options: this.options
      }
    });

    this.instance = instance;
  }

  show() {
    if (document.body.contains(this.instance.$el)) {
      document.body.removeChild(this.instance.$el);
    }

    document.body.appendChild(this.instance.$el);
  }

  hide() {
    if (document.body.contains(this.instance.$el)) {
      document.body.removeChild(this.instance.$el);
    }
  }

  changeView(node: Node) {
    this.instance.node = node;
  }
}
