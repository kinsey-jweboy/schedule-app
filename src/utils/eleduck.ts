import { Page } from 'playwright';

export async function collectData(
  page: Page,
  scope: 'frontend' | 'backend',
  url: string,
) {
  // 等待页面加载完成
  await page.goto(url, { waitUntil: 'load' });
  // 点击筛选按钮
  await page.click('.ant-dropdown-trigger');
  // 等待筛选菜单显示
  await page.waitForSelector('.ant-dropdown-menu', { state: 'visible' });
  // 点击 "最新" 筛选项
  await page
    .locator('.ant-dropdown-menu-item', {
      hasText: '最新',
    })
    .click();
  // 等待列表在页面中显示
  await page.waitForSelector('.post-item', { state: 'visible' });
  // 等待页面加载完成
  await page.waitForTimeout(2000);
  // 组合列表数据
  const items = await page.locator('.post-item').evaluateAll(
    (nodes, scope) =>
      nodes.map((node) => {
        const title = (node.querySelector('.post-title') as HTMLElement)
          .innerText;
        const slug = node.querySelector('a').getAttribute('href');

        return { title, scope, url: `https://eleduck.com${slug}` };
      }),
    scope,
  );

  return items;
}
