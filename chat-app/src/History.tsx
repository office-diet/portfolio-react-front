import { useEffect, useRef } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import type { NewVisitorReturnData } from "./Types";

interface HistoryProps {
  newVisitorReturnData: NewVisitorReturnData;
}


export function History({ newVisitorReturnData }: HistoryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstTime = useRef<boolean>(true);

  const usuchanName:string = "臼ちゃん";
  const sayakaName:string = "さやか";

  useEffect(() => {
    const container:HTMLDivElement | null = containerRef.current;
    if (!container) return;
    if (newVisitorReturnData.chatLogs.length === 0) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom:boolean = firstTime.current ? true : scrollHeight - scrollTop - clientHeight < 500;
    firstTime.current = false;

    if (isAtBottom) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [newVisitorReturnData]);

  // 送信者ごとのスタイルや名前を決めるヘルパー関数
  const getStyleBySender = (senderId:string,  senderName: string) => {

    if (senderName === usuchanName) {
      return {
        bg: "teal.50",
        color: "gray.800",
        align: "flex-start",
        border: "1px",
        borderColor: "teal.200",
      };
    } else if (senderName === sayakaName) {
      return {
        bg: "pink.100",
        color: "gray.800",
        align: "flex-start",
        border: "1px",
        borderColor: "pink.300", // 少ししっかりしたピンクの枠線
      };
    } else if (senderId === newVisitorReturnData.visitorId) {
      return {
        bg: "blue.500",
        color: "white",
        align: "flex-end",
        border: "0",
      };

    } else {
      return {
        bg: "gray.50",
        color: "gray.800",
        align: "flex-start",
        border: "1px",
        borderColor: "gray.200", 
      };
    }
  }; 

  return (
    <VStack
      ref={containerRef}
      flex="1"
      overflowY="auto"
      p={4}
      gap={4}
      align="stretch"
      css={{
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": { background: "#CBD5E1", borderRadius: "3px" },
        "&::-webkit-scrollbar-thumb:hover": { background: "#94A3B8" },
      }}
    >
      {newVisitorReturnData.chatLogs.map((row) => {
        const style = getStyleBySender(row.visitorId, row.visitorName);
        const isUser = row.visitorId === newVisitorReturnData.visitorId;

        return (
          <Flex key={row.id} direction="column" align={style.align}>
            <Text fontSize="xs" color="gray.500" mb={1} px={1}>
              { isUser ? `${row.visitorName}（あなた）：${row.createdAt}` : `${row.visitorName}：${row.createdAt}` } 
            </Text>
            <Box
              maxW="70%"
              bg={style.bg}
              color={style.color}
              px={4}
              py={2}
              borderRadius="lg"
              boxShadow="sm"
              borderWidth={style.border}
              borderColor={style.borderColor}
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              textAlign="left"
            >
              <Text fontSize="sm">{row.message}</Text>
            </Box>
          </Flex>
        );
      })}
      <div ref={scrollRef} />
    </VStack>
  );
}