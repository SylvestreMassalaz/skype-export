import { computed, Injectable, signal } from '@angular/core';
import { ExportConfig } from './export-config/export-config.component';
import { ConversationInfo, CSVExportMessage, ExportResult, SkypeConversation, SkypeExportData, SkypeMessage } from '../model';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { decode } from 'html-entities';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"

export enum ExportState {
  MESSAGES_FILE_UPLOAD,
  MESSAGES_FILE_LOADING,
  CONVERSATION_CHOICE,
  EXPORT_ONGOING,
  EXPORT_SUCCESS,
  ERROR
}

export enum ErrorType {
  NONE,
  FILE_NOT_JSON,
  MISSING_SKYPE_DATA
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  public status = signal<ExportState>(ExportState.MESSAGES_FILE_UPLOAD);
  public error = signal<ErrorType>(ErrorType.NONE);
  public skypeExportData = signal<SkypeExportData | null>(null)
  public exportDataFile = signal<ExportResult | null>(null)

  public conversationInfo = computed(() => {
    let data = this.skypeExportData()
    if (data === null) {
      return []
    }
    return extractConversations(data)
  })

  load_file(file: File) {
    let fileReader = new FileReader();
    if (file.type !== "application/json") {
      this.goToErrorState(ErrorType.FILE_NOT_JSON)
      return
    }

    this.status.set(ExportState.MESSAGES_FILE_LOADING);

    let self = this;
    fileReader.onloadend = function (x) {
      let fileContent: string = fileReader.result as string;
      self.skypeExportData.set(JSON.parse(fileContent))
      self.status.set(ExportState.CONVERSATION_CHOICE)
    }

    fileReader.readAsText(file)
  }

  doExport(config: ExportConfig) {
    this.status.set(ExportState.EXPORT_ONGOING)
    const skypeExportData = this.skypeExportData()
    if (skypeExportData === null) {
      this.goToErrorState(ErrorType.MISSING_SKYPE_DATA)
      return
    }

    let conv = getConvById(skypeExportData, config.conv_id)
    let messageData = exportConvMessages(conv)
    const fileName = generateFileName(config, conv)

    if (config.export_type === "csv") {
      console.info("Starting export to CSV")
      this.exportToCSV(messageData, fileName)
    } else {
      console.info("Starting export to DocX")
      this.exportToDocx(messageData, conv, fileName)
    }
  }

  exportAnother() {
    this.status.set(ExportState.CONVERSATION_CHOICE)
  }

  exportToCSV(messages: SkypeMessage[], fileName: string) {
    let csvData = prepareForCsvExport(messages)
    let csvExport = stringify(csvData, { header: true })
    let csvExportBlob = new Blob([csvExport], { type: "text/csv" , })
    this.exportDataFile.set({fileName, fileContent: csvExportBlob})
    this.status.set(ExportState.EXPORT_SUCCESS)
  }

  exportToDocx(messages: SkypeMessage[], conversation: SkypeConversation, fileName: string) {
    let convertedMessages: Paragraph[] = []
    const document = convertToDocx(messages, conversation)
    const self = this
    Packer.toBlob(document).then((blob) => {
      self.exportDataFile.set({fileName, fileContent: blob})
      self.status.set(ExportState.EXPORT_SUCCESS)
    })
  }

  goToErrorState(reason: ErrorType) {
    this.status.set(ExportState.ERROR)
    this.error.set(reason)
  }
}

function generateFileName(config: ExportConfig, conversation: SkypeConversation): string {
  const fileExtension = config.export_type === "csv" ? ".csv" : ".docx"
  const fileName = `${conversation.displayName}_exported`
  return fileName + fileExtension;
}

function convertToDocx(messages: SkypeMessage[], conversation: SkypeConversation): Document {
  return new Document({
      sections: [{
        children: [
          new Paragraph({
            text: conversation.displayName ?? "undefined",
            heading: HeadingLevel.TITLE
          }),
          new Paragraph({
            text: "Extracted from skype data"
          }),
          ...messagesToParagraphs(messages)
        ]
      }]
    })
}

function messagesToParagraphs(messages: SkypeMessage[]): Paragraph[] {
  return messages.map(message => {
    return new Paragraph({
        children: [
          new TextRun({
            text: extractSkypeUsername(message.from),
            bold: true,
            break: 1
          }),
          new TextRun({
            text: message.originalarrivaltime,
            italics: true,
            break: 1
          }),
          new TextRun({
            text: decode(message.content),
            break: 2
          })
        ]
      })
  })
}


function extractConversations(data: SkypeExportData): ConversationInfo[] {
  let conversations: any[] = data.conversations
  return conversations
    .filter(conv => conv.displayName != null)
    .map(conv => extractConversationData(conv));
}

function extractConversationData(conversation: SkypeConversation): ConversationInfo {
  let id: string = conversation.id
  let label: string = conversation.displayName ?? "Conversation without displayName"
  let nbMessages: number = filterUnusableMessages(conversation).length
  let members = extractMembers(conversation)
  return { id, label: label, members, nbMessages };
}

function extractMembers(conversation: SkypeConversation): string[] {
  let members: string[] = []
  if (conversation.threadProperties === null) {
    members.push(extractSkypeUsername(conversation.id))
  } else {
    let memberList: any[] = JSON.parse(conversation.threadProperties["members"])
    memberList.forEach(member => {
      members.push(extractSkypeUsername(member))
    })
  }
  return members
}

function filterUnusableMessages(conversation: SkypeConversation): SkypeMessage[] {
  return conversation.MessageList
    .filter(message => message.messagetype === "RichText" || message.messagetype === "Text")
}

function exportConvMessages(conversation: SkypeConversation): SkypeMessage[] {
  return filterUnusableMessages(conversation)
}

function getConvById(data: SkypeExportData, convId: string): any {
  return data.conversations.find(conversation => conversation.id === convId)
}

function prepareForCsvExport(messages: SkypeMessage[]): CSVExportMessage[] {
  return messages.map(message => {
    return {
      message: decode(message.content),
      sender: extractSkypeUsername(message.from),
      timestamp: message.originalarrivaltime
    }
  })
}

function extractSkypeUsername(source: string): string {
  return source.split(":")[1]
}

