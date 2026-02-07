import { supabase } from "@/integrations/supabase/client";

interface ConversationMessage {
  role: string;
  content: string;
  timestamp?: string;
}

export function useEncryptedMessages() {
  const createConversation = async (
    sessionId: string,
    messages: ConversationMessage[],
  ): Promise<string | null> => {
    const { data, error } = await supabase.functions.invoke("encrypt-messages", {
      body: { action: "create", sessionId, messages },
    });
    if (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }
    return data?.id || null;
  };

  const saveMessages = async (
    conversationId: string,
    messages: ConversationMessage[],
  ): Promise<boolean> => {
    const { error } = await supabase.functions.invoke("encrypt-messages", {
      body: { action: "save", conversationId, messages },
    });
    if (error) {
      console.error("Failed to save messages:", error);
      return false;
    }
    return true;
  };

  const loadSessionMessages = async (
    sessionId: string,
  ): Promise<Array<{ id: string; messages: ConversationMessage[] }>> => {
    const { data, error } = await supabase.functions.invoke("encrypt-messages", {
      body: { action: "load", sessionId },
    });
    if (error) {
      console.error("Failed to load session messages:", error);
      return [];
    }
    return data?.conversations || [];
  };

  const loadHistory = async (): Promise<
    Array<{ messages: ConversationMessage[] }>
  > => {
    const { data, error } = await supabase.functions.invoke("encrypt-messages", {
      body: { action: "load-history" },
    });
    if (error) {
      console.error("Failed to load history:", error);
      return [];
    }
    return data?.conversations || [];
  };

  return { createConversation, saveMessages, loadSessionMessages, loadHistory };
}
