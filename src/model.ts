export interface SkypeExportData {
  userId: string,
  exportDate: string,
  conversations: SkypeConversation[]
}

export interface SkypeConversation {
  id: string,
  displayName: string | null,
  version: number,
  threadProperties: SkypeThreadProperties | null,
  MessageList: SkypeMessage[]
}

/**
 * Skype message type
 * INCOMPLETE right now, but we only need RichText / Text for current export anyway
 */
export type SkypeMessageType = "RichText" | "Text" | "RichText/URIObject" | "ThreadActivity/AddMember"

export interface SkypeMessage {
  id: string,
  displayName: string
  originalarrivaltime: string
  messagetype: SkypeMessageType,
  content: string
  from: string
}

export interface SkypeThreadProperties {
  membercount: number
  members: string
}

export interface ConversationInfo {
  label: string,
  id: string,
  members: string[],
  nbMessages: number;
}

export interface CSVExportMessage {
  sender: string,
  timestamp: string,
  message: string
}

export interface ExportResult {
  fileContent: Blob,
  fileName: string
}
