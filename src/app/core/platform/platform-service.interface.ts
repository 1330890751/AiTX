import { PlatformLoginErrorCode } from '@typings/error';
import { Observable } from 'rxjs';

export interface ILocationInfo {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  scale?: number;
}

export interface IPreviewImageParams {
  current: string;
  urls: string;
}

export interface IDownloadImageParams {
  serverId?: string;
  isShowProgressTips?: number;
}

type uploadStatus = 'error' | 'done' | 'uploading' | 'pendding' | 'downloading' | 'downloaded';

/**
 * 文件属性。
 */
export interface IUploadFile {
  lastModified: string; // 最后修改时间
  fileName: string; // 文件名称
  size: string; // 文件尺寸
  sizeb?: number; // 文件字节数
  downloadUrl?: string; // 下载url
  percent?: number; // 上传进度
  id?: string;
  status?: uploadStatus;
  originFileObj?: File; // 上传对象
  icon?: string;
  fileMIMEType?: string;
  filePath?: string;
  isPic?: boolean;
}

export interface IFileParams {
  url: string; // 企业微信必填
  name?: string;
  size: string; // 企业微信必填
  downloadLocalFileURL?: any; // 本地文件地址
  beforDownloadHandler?: any; // 下载前执行事件.
  progressHandler?: any; // 下载/上传 进度回调
}

export interface IScanParams {
  desc?: string;
  needResult?: number;
  scanType?: [string];
}

/**
 * 账号密码登录用 参数接口
 */
export interface IAccontLoginParams {
  account: string; // 账号
  comid: string; // 公司id
  password: string; // 密码
  [propName: string]: any;
}

export interface ILoginParams {
  code?: string;
  auth_code?: string;
}

export interface ILoginData {
  platformUserId?: string;
  platformCorpId?: string;
  userInfo?: any;
}

export interface IWifiData {
  // wifi mac
  macIp: string;
  // wifi name
  ssid: string;
}

export interface IPlatformLoginResult {
  status: PlatformLoginErrorCode;
  data?: any;
}

export interface IPlatformService {
  loginErrorPage: string;
  loginController?: string; // 登录接口名
  appEnterRefresh?: boolean; // 刷新后根据localstroage免登录。
  beforeInit?(): void | Observable<any> | ILoginParams;
  authSkip(): Promise<boolean>; // auth url跳转
  authenLogin(params?: ILoginParams): Promise<ILoginData>;
  authenConfig(): Observable<any>; // 鉴权
  getLocation?(type?): Observable<ILocationInfo>; // 获取当前位置
  openLocation?(params: ILocationInfo): void;
  scan?(params: IScanParams): Observable<any>; // 打开扫一扫
  previewImage?(params: IPreviewImageParams): void; // 预览图片
  previewFile?(params: IFileParams, fileInfo?: IUploadFile): Observable<any> | void; // 预览文件
  getWifi?(): Observable<IWifiData>; // 获取Wifi热点信息
  qrLogin?(params): Promise<any>;
  paltformDownloadFile?(params: IFileParams, fileInfo: IUploadFile): Observable<any>;
  accountLogin(params: IAccontLoginParams): Promise<IPlatformLoginResult>; // 正常账号密码登录
  fetchDeviceId(): Promise<string>;
  registerPlatformEvent(): void; // 各自平台事件
  [key: string]: any;
  setTitle?(str): any;
  /**
   *  用户身份确认,通过人物的生物识别认证
   *  返回 Promise 值 true: 认证成功, false:不可用, reject: 认证失败
   */
  authConfirm?(): Promise<boolean>;
  apiBack?(): any;
  closeWindow?(): any;
}
