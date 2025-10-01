export type Tag = string | Function;
export type Props = { [key: string]: any };

export type VDOM = {
  "ura-if"?: string;
  "ura-loop"?: string;
  type: any;
  tag?: Tag;
  props?: Props | any;
  value?: string | number;
  dom?: HTMLElement;
  key?: number;
  children?: any;
  call?: Function; // for exec tag
};

export class TaskQueue {
  queue: any[];
  isProcessing: boolean;
  maxWorkers: number;
  activeWorkers: number;
  highPriorityQueue: any[];

  constructor(maxWorkers = 3) {
    this.queue = [];
    this.isProcessing = false;
    this.maxWorkers = maxWorkers;
    this.activeWorkers = 0;
    this.highPriorityQueue = [];
  }

  enqueue(task, highPriority = false) {
    if (highPriority) this.highPriorityQueue.push(task);
    else this.queue.push(task);
    this.processQueue();
  }

  dequeue() {
    if (this.highPriorityQueue.length > 0)
      return this.highPriorityQueue.shift();
    return this.queue.shift();
  }

  async processQueue() {
    if (this.isProcessing || this.activeWorkers >= this.maxWorkers) return;

    const task = this.dequeue();
    if (!task) return;

    this.activeWorkers++;
    this.isProcessing = true;

    requestAnimationFrame(() => {
      try {
        task.work();
      } catch (error) {
        console.error("Task execution error:", error);
      } finally {
        this.activeWorkers--;
        this.isProcessing = false;

        if (this.queue.length > 0 || this.highPriorityQueue.length > 0)
          this.processQueue();
      }
    });

    if (
      this.activeWorkers < this.maxWorkers &&
      (this.queue.length > 0 || this.highPriorityQueue.length > 0)
    ) {
      this.isProcessing = false;
      this.processQueue();
    }
  }

  clear() {
    this.queue = [];
    this.highPriorityQueue = [];
  }

  size = () => this.queue.length + this.highPriorityQueue.length;
}
