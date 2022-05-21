export class Scheduler {
  private frameTime = 500;
  private startTime: number;
  private actionFrameTime: number;
  private throttledCallback: Function;

  /**
   * @param actionFrameTime milli second
   */
  constructor(actionFrameTime: number) {
    this.actionFrameTime = actionFrameTime;
  }

  async requestActionFrame(callback): Promise<boolean | void> {
    setTimeout(async () => {
      if (!this.startTime) {
        this.startTime = new Date().getTime();
        await callback();
        return true;
      }
  
      const endTime = new Date().getTime();
      if (endTime - this.startTime > this.actionFrameTime) {
        await callback();
        this.startTime = endTime;
    } else {
        setTimeout(async () => {
          await this.requestActionFrame(callback);
        }, this.frameTime);
      }
    }, this.actionFrameTime);
  }
}