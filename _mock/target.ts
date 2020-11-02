import { MockRequest } from '@knz/mock';

export const APITarget = {
  '/target/list': (req: MockRequest) => getTargetList(req.queryString),
  '/objective/list': (req: MockRequest) => getTargetList(req.queryString),
};

function getTargetList(
  para: any = { page_index: 1, page_size: 20, target: '1', year: '2020', item: '1', status: '0' },
) {
  const list: any[] = [];
  if (para.assess === '1') {
    for (let i = 1; i < 10; i += 1) {
      let _status = '1';
      if (i < 5) {
        _status = i + '';
      }
      list.push({
        id: i + 1,
        title: '目标-我负责的' + `${i}`,
        name: '第一季度',
        user: 'admin',
        datetime: '2019-1-1',
        updateTime: '2019-1-2',
        rate: 60,
        kr: '0/3',
        detail: [
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
        ],
      });
    }
  }
  if (para.assess === '2') {
    for (let i = 1; i < 11; i += 1) {
      let _status = '1';
      if (i < 5) {
        _status = i + '';
      }
      list.push({
        id: i + 1,
        title: '目标-我参与的' + `${i}`,
        name: '第一季度',
        user: 'admin',
        datetime: '2019-1-1',
        updateTime: '2019-1-2',
        rate: 60,
        kr: '0/3',
        detail: [
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
        ],
      });
    }
  }
  if (para.assess === '3' || para.assess === '0') {
    for (let i = 1; i < 11; i += 1) {
      let _status = '1';
      if (i < 5) {
        _status = i + '';
      }
      list.push({
        id: i + 1,
        title: '目标-公司全部' + `${i}`,
        name: '第一季度',
        user: 'admin',
        datetime: '2019-1-1',
        updateTime: '2019-1-2',
        rate: 60,
        kr: '0/3',
        detail: [
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
          {
            title: '需求调研',
            user: 'jack',
            datetime: '2019-1-1',
            updateTime: '2019-1-2',
            rate: 50,
          },
        ],
      });
    }
  }

  return {
    errorMsg: '',
    errorCode: '0',
    result: list,
  };
}
