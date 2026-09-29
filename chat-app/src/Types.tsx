

export type JoinInfo = {         // 入室時にユーザより送信
  type: string;           // join
  visitorName: string;    // 全部「GuestUser」※将来用
  browser: string;
  os: string;
  device: string;
  lang: string;
  timezone: string;
}

export type NewVisitorReturnData = { // 入室時に各種データを返送
  type: string;               // visitorId
  visitorId: string;
  visitorName: string;
  chatLogs: ChatLogForTS[];   // 直近件のチャット履歴
}

export type NewChat = {          // ユーザが新規送信したチャット
    type: string;           //chat
    visitorId: string;
    visitorName: string;
    message: string;
}

export type NewChatReturn = {
  type: string;         // chat
  visitorId: string;
  visitorName: string;
  messageId: string;
  message: string;
  createdAt: string;
}

export type OnlineCount = {
  type: string;         // online
  onlineCount : number; // 室内人数
  visitorCount: number; // 合計訪問者数
}

type ChatLogForTS = {
	id: string;
	visitorId: string;
	visitorName: string;
	message: string;
	createdAt: string;
}