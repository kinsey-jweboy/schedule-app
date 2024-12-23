import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { chromium } from 'playwright';
import { collectData } from 'utils/eleduck';
import { notifyDuckPost } from 'utils/webhook';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_30_MINUTES)
  async collectDuckData() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // const frontEndItems = await collectData(
    //   page,
    //   'frontend',
    //   'https://eleduck.com/',
    // );

    // 获取最新一条的数据
    // const backend = backendItems[0];
    // const frontend = frontEndItems[0];

    // console.log(backendItems);

    const items = await collectData(page);

    // log 记录
    this.logger.log(`已发送 ${items.length} 条`);

    // 关闭浏览器
    await browser.close();

    // 飞书通知
    await notifyDuckPost(items);
  }
}
