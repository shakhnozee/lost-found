import axios from "axios"
import type { Item, CreateItemData } from "@/types"

export const http = axios.create({
  baseURL: "https://6888b4f0adf0e59551bb0dbe.mockapi.io/api/v1",
})

export const getItems = async (): Promise<Item[]> => {
  const response = await http.get("/items")
    console.log("getItems response:", response.data);

  return response.data
}

export const createItem = async (data: CreateItemData): Promise<Item> => {
  const response = await http.post("/items", data)
  return response.data
}

export const updateItem = async (id: string, data: Partial<Item>): Promise<Item> => {
  const response = await http.put(`/items/${id}`, data)
  return response.data
}

export const deleteItem = async (id: string): Promise<void> => {
  await http.delete(`/items/${id}`)
}
