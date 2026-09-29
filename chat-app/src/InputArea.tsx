import { Flex, Textarea, IconButton } from "@chakra-ui/react";
import { Send } from "lucide-react";
import type { NewChat, NewVisitorReturnData } from "./Types.tsx";
import { useState } from "react";

interface InputAreaProps {
  newVisitorReturnData: NewVisitorReturnData
  socket: WebSocket | null;
}

export function InputArea({ newVisitorReturnData, socket }:InputAreaProps) {

  const [inputText, setInputText] = useState<string>("");
  const onSend = ():void => {

      if (inputText.trim() !== "" && newVisitorReturnData.visitorId !== "" && newVisitorReturnData.visitorName !== "") {
        const newChat:NewChat = { type:"chat", 
                                  visitorId: newVisitorReturnData.visitorId, 
                                  visitorName: newVisitorReturnData.visitorName,
                                  message: inputText
                                }
        if (socket && socket.readyState === socket.OPEN) {
          socket.send(JSON.stringify(newChat));
          setInputText("");
        }
      }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>):void => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      if (e.shiftKey) return;
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Flex p={4} bg="white" borderTopWidth="1px" borderColor="gray.200" gap={2} align="flex-end">
      <Textarea
        placeholder="メッセージを入力... (Enterで送信, Shift+Enterで改行)"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        borderRadius="lg"
        bg="gray.50"
        color="gray.800"
        resize="none"
        h="120px"
        minH="120px"
        maxH="120px"
        py={2}
      />
      <IconButton
        aria-label="送信"
        onClick={onSend}
        colorScheme="blue"
        borderRadius="full"
        bg="blue.500"
        color="white"
        _hover={{ bg: "blue.600" }}
        h="40px"
        w="40px"
      >
        <Send size={18} />
      </IconButton>
    </Flex>
  );
}