import { useState, useEffect } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { History } from "./History";
import { InputArea } from "./InputArea.tsx";

import type { JoinInfo, NewVisitorReturnData, OnlineCount } from "./Types.tsx";

export function App() {

  // WebSocket本体＋サーバからの情報は親が一元管理
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [serverData, setServerData] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState<OnlineCount>({type: "online", onlineCount: 0, visitorCount: 0})
  const [newVisitorReturnData, setNewVisitorReturnData] = useState<NewVisitorReturnData>({type: "visitorId", visitorId: "", visitorName: "", chatLogs:[]})

  // WebSocket接続（初回のみ）
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    setSocket(ws);

    ws.onopen = () => {
      const joinInfo:JoinInfo = getJoinInfo();
      ws.send(JSON.stringify(joinInfo));
      console.log("WebSocker: onOpen");
      console.log(joinInfo);
    };

    ws.onmessage = (event) => {
      console.log("WebSocker: onMessage Catch");
      console.log(event.data);
      setServerData((prev) => [...prev, event.data]);
    };
    return () => {
      if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    if (serverData.length === 0) return
    const data = JSON.parse(serverData[0]);
    if (data.type === "online") {
      console.log("catch: online");
      console.log(data);
      setOnlineCount((prev) => ({...prev, ...data}));
    } else if (data.type === "visitorId") {
      setNewVisitorReturnData((prev) => ({...prev, ...data}));
      console.log("catch: visitorId");
      console.log(data);
    } else if (data.type === "chat") {
      console.log("catch: chat(NewChat)");
      console.log(data);
      const tmpData = JSON.parse(JSON.stringify(newVisitorReturnData));
      tmpData.chatLogs = [...tmpData.chatLogs, 
                            { id: data.messageId, 
                              visitorId: data.visitorId, 
                              visitorName: data.visitorName, 
                              message: data.message,
                              createdAt: data.createdAt}];
      setNewVisitorReturnData((prev) => ({...prev, ...tmpData}));
    }
    setServerData((prev) => prev.slice(1));
  }, [serverData]);

  return (
    <Flex justify="center" align="center" h="100vh" bg="gray.100">
      <Flex
        direction="column"
        w="100%"
        maxW={{ base: "100%", md: "clamp(600px, 80vw, 800px)" }}
        h={{ base: "100vh", md: "95vh" }}
        maxH="900px"
        bg="white"
        shadow={{ base: "none", md: "lg" }}
        borderRadius={{ base: "none", md: "xl" }}
        overflow="hidden"
      >
        <Box p={4} bg="white" borderBottomWidth="1px" borderColor="gray.200">
          <Heading size="md" color="blue.600">オンライン：{onlineCount.onlineCount}人（訪問者数：{onlineCount.visitorCount}人）</Heading>
        </Box>

        <History newVisitorReturnData={newVisitorReturnData} />

        <InputArea
          newVisitorReturnData={newVisitorReturnData}
          socket={socket}
        />
      </Flex>
    </Flex>
  );
}

export default App;

// 訪問者側のブラウザ情報を取得
function getJoinInfo():JoinInfo {
  const uaData = (navigator as any).userAgentData;
  const ua:string = navigator.userAgent;
  const platform:string = (uaData && uaData.platform) || navigator.platform;

  let browser:string = "Unknown";
  if (uaData && uaData.brands && uaData.brands.length > 0) {
    browser = uaData.brands[0].brand; // 例: "Google Chrome"
  } else if (/Chrome/i.test(ua)) {
    browser = "Chrome";
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = "Safari";
  } else if (/Edg/i.test(ua)) {
    browser = "Edge";
  }

  let os:string = "Unknown";
  if (/Windows/i.test(platform)) os = "Windows";
  else if (/Mac/i.test(platform)) os = "macOS";
  else if (/iPhone|iPad|iPod/i.test(platform)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(platform)) os = "Linux";

  const device:string = /Mobi|Android/i.test(ua) ? "mobile" : "desktop";
  const lang:string = navigator.language || "ja-JP";
  const timezone:string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    type: "join",
    visitorName: "GuestUser",
    browser: browser,
    os: os,
    device: device,
    lang: lang,
    timezone: timezone
  };
}