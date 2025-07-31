export interface Item {
  id: string
  imageUrl: string
  name: string
  location: string
  date: string
  type: "Lost" | "Found"
  status: "Active" | "Done"
  createdAt?: string
}

export interface CreateItemData {
  imageUrl: string
  name: string
  location: string
  date: string
  type: "Lost" | "Found"
  status: "Active" | "Done"
}

export interface ItemsState {
  items: Item[]
  loading: boolean
  error: string | null
}
