export class Scheduler {
  frameTime = 500;
  startTime: number;
  actionFrameTime: number;
  throttledCallback: Function;

  /**
   * @param actionFrameTime milli second
   */
  constructor(actionFrameTime: number) {
    this.actionFrameTime = actionFrameTime;
  }

  async requestActionFrame(callback): Promise<boolean | void> {
    if (!this.startTime) {
      this.startTime = new Date().getTime();
      await callback();
      return true;
    }

    const endTime = new Date().getTime();
    console.log('requestActionFrame', endTime - this.startTime);
    if (endTime - this.startTime > this.actionFrameTime) {
      await callback();
      this.startTime = endTime;
      return true;
    } else {
      // setTimeout(async () => {
      //   await this.requestActionFrame(callback)
      // }, this.frameTime);
    }
  }
}