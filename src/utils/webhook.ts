import { FEISHU_REQUEST_URL } from '../constants';
import { request } from 'undici';

export const notifyDuckPost = (data: any) => {
  return request(FEISHU_REQUEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            content: [
              data.map((item) => {
                return {
                  text: `${item.title}，详情点击 ${item.url}\n`,
                  tag: 'text',
                };
              }),
            ],
          },
        },
      },
    }),
  });
};
