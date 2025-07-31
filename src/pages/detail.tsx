"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash2, MapPin, Calendar, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { updateItem, deleteItem } from "@/services/api"
import type { Item } from "@/types"

interface ItemDetailsProps {
  item: Item | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (id: string) => void
}

export default function ItemDetails({ item, isOpen, onClose, onDelete }: ItemDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Item>>({})
  const queryClient = useQueryClient()

  // Reset editing state when modal opens/closes or item changes
  useEffect(() => {
    if (!isOpen || !item) {
      setIsEditing(false)
      setEditForm({})
    } else {
      setEditForm(item)
    }
  }, [isOpen, item])

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
      setIsEditing(false)
      setEditForm({})
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
      onDelete?.(item?.id || "")
      onClose()
    },
  })

  if (!item) return null

  const handleEdit = () => {
    setIsEditing(true)
    setEditForm(item)
  }

  const handleSave = () => {
    if (editForm && item.id) {
      updateMutation.mutate({
        id: item.id,
        data: editForm,
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(item) // Reset to original item data
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(item.id)
    }
  }

  const handleInputChange = (field: keyof Item, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClose = () => {
    setIsEditing(false)
    setEditForm({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-4xl max-h-[95vh] overflow-y-auto p-0 mx-4 sm:mx-auto m-1">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <Input
                    value={editForm.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-xl sm:text-2xl font-bold border-0 p-0 h-auto focus-visible:ring-0"
                    placeholder="Item name"
                  />
                ) : (
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 pr-2 break-words">
                    {item.name}
                  </DialogTitle>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      <Select
                        value={editForm.type || item.type}
                        onValueChange={(value: "Lost" | "Found") => handleInputChange("type", value)}
                      >
                        <SelectTrigger className="w-24 sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lost">Lost</SelectItem>
                          <SelectItem value="Found">Found</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={editForm.status || item.status}
                        onValueChange={(value: "Active" | "Done") => handleInputChange("status", value)}
                      >
                        <SelectTrigger className="w-24 sm:w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <Badge
                        variant={item.type === "Lost" ? "destructive" : "default"}
                        className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                          item.type === "Lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.type}
                      </Badge>
                      <Badge
                        variant={item.status === "Active" ? "default" : "secondary"}
                        className={`rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium ${
                          item.status === "Active" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden sm:flex gap-2 flex-shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleEdit} variant="outline" size="sm" className="bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Image */}
              <div className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
                  <img
                    src={item.imageUrl || "https://daprint.ru/upload/iblock/f01/6j6q3imqo9csrtj08j642hdmzl4dzapv.jpg"}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://daprint.ru/upload/iblock/f01/6j6q3imqo9csrtj08j642hdmzl4dzapv.jpg"
                    }}
                  />
                </div>
                {isEditing && (
                  <div>
                    <Label htmlFor="imageUrl" className="text-sm font-medium">
                      Image URL
                    </Label>
                    <Input
                      id="imageUrl"
                      value={editForm.imageUrl || ""}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="Enter image URL"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-0 bg-gray-50">
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <Label className="text-sm font-medium text-gray-700">Location</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.location || ""}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="mt-1"
                            placeholder="Enter location"
                          />
                        ) : (
                          <p className="text-gray-900 mt-1 break-words">{item.location}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <Label className="text-sm font-medium text-gray-700">Date</Label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.date || ""}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-900 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex flex-col sm:hidden gap-3 mt-6">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={handleEdit} variant="outline" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
