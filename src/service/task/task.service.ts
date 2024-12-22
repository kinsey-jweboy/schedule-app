import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { chromium } from 'playwright';
import { collectData } from 'utils/eleduck';
import { notifyDuckPost } from 'utils/webhook';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectDuckData() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const backendItems = await collectData(
      page,
      'backend',
      'https://eleduck.com/search?keyword=java',
    );
    const frontEndItems = await collectData(
      page,
      'frontend',
      'https://eleduck.com/search?keyword=%E5%89%8D%E7%AB%AF',
    );

    // 获取最新一条的数据
    const backend = backendItems[0];
    const frontend = frontEndItems[0];

    // 关闭浏览器
    await browser.close();

    // log 记录
    this.logger.log({ frontend, backend });

    // 飞书通知
    await notifyDuckPost([frontend, backend]);
  }
}
