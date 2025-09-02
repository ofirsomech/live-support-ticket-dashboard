import * as signalR from '@microsoft/signalr'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5182'

let connection: signalR.HubConnection | null = null

export function getConnection() {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/tickets`)
      .withAutomaticReconnect()
      .build()
  }
  return connection
}