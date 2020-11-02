import { MockRequest } from '@knz/mock';

export const APITarget = {
  '/target/list': (req: MockRequest) => getTargetList(req.queryString),
  'post /upload': (req: MockRequest) => uploadFn(req.queryString),
};

function getTargetList(
  para: any = { page_index: 1, page_size: 20, target: '1', year: '2020', item: '1', status: '0' },
) {
  const list: any[] = [];
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
  return {
    errorMsg: '',
    errorCode: '0',
    result: list,
  };
}

function uploadFn(para: any = {
  directorId: "string",
  endTime: "2020-03-10T08:27:47.658Z",
  id: "string",
  name: "string",
  objectiveId: "string",
  startTime: "2020-03-10T08:27:47.658Z",
  warnTime: "2020-03-10T08:27:47.658Z"
}): any {
  return {
      errorMsg: '',
      errorCode: "0",
      result: {}
  }
}