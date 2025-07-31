import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, MapPin, Calendar, Tag, CheckCircle } from "lucide-react"
import { createItem } from "@/services/api"
import type { CreateItemData } from "@/types"

export default function AddItemForm() {
  const [formData, setFormData] = useState<CreateItemData>({
    imageUrl: "",
    name: "",
    location: "",
    date: "",
    type: "Lost",
    status: "Active",
  })
  const [errors, setErrors] = useState<Partial<CreateItemData>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] })
      setIsSubmitted(true)
      setFormData({
        imageUrl: "",
        name: "",
        location: "",
        date: "",
        type: "Lost",
        status: "Active",
      })
      setTimeout(() => setIsSubmitted(false), 3000)
    },
  })

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateItemData> = {}

    if (!formData.name.trim()) newErrors.name = "Item name is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      mutation.mutate(formData)
    }
  }

  const handleInputChange = (field: keyof CreateItemData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Added Successfully!</h2>
          <p className="text-gray-600">Your item has been added to the Lost & Found board.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto bg-white shadow-xl border-0 rounded-3xl overflow-hidden py-0">
      <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
        <CardTitle className="text-2xl font-bold text-center">Add New Item</CardTitle>
        <p className="text-gray-300 text-center mt-2">Fill in the details below</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-gray-700 font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`rounded-xl border-2 transition-all duration-200 hover:border-gray-400 focus:border-gray-900 ${
                errors.imageUrl ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Item Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., iPhone 13, Blue Backpack"
              className={`rounded-xl border-2 transition-all duration-200 hover:border-gray-400 focus:border-gray-900 ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="e.g., Terminal 2, Library 3rd Floor"
              className={`rounded-xl border-2 transition-all duration-200 hover:border-gray-400 focus:border-gray-900 ${
                errors.location ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`rounded-xl border-2 transition-all duration-200 hover:border-gray-400 focus:border-gray-900 ${
                errors.date ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Lost" | "Found") => handleInputChange("type", value)}
              >
                <SelectTrigger className="rounded-xl border-2 border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200">
                  <SelectItem value="Lost" className="rounded-lg">
                    Lost
                  </SelectItem>
                  <SelectItem value="Found" className="rounded-lg">
                    Found
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Active" | "Done") => handleInputChange("status", value)}
              >
                <SelectTrigger className="rounded-xl border-2 border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-gray-200">
                  <SelectItem value="Active" className="rounded-lg">
                    Active
                  </SelectItem>
                  <SelectItem value="Done" className="rounded-lg">
                    Done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {mutation.isPending ? "Adding Item..." : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
