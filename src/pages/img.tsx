import type React from "react"
import { useState, useEffect } from "react"
import { Upload, Trash2, ImageIcon } from "lucide-react"

interface Props {
  onImageChange: (url: string) => void
}

const ImageUploadSection: React.FC<Props> = ({ onImageChange }) => {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "Максимальный размер: 5MB"
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return "Допустимые форматы: JPEG, JPG, PNG, WebP"
    }
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    const validationError = validateFile(file)

    if (validationError) {
      setError(validationError)
      return
    }

    const url = URL.createObjectURL(file)
    setImage({ file, url })
    setError(null)
  }

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.url)
    setImage(null)
    onImageChange("")
  }

  useEffect(() => {
    if (image) {
      onImageChange(image.url)
    }
    return () => {
      if (image) URL.revokeObjectURL(image.url)
    }
  }, [image])

  return (
    <div className="border border-gray-200 p-4 rounded-xl bg-gray-50">
      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Загрузите изображение (1 фото)
      </h3>

      {error && (
        <div className="text-sm text-red-600 mb-2">{error}</div>
      )}

      {!image ? (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 cursor-pointer hover:bg-gray-100 text-sm">
          <Upload className="w-5 h-5 mb-2" />
          Нажмите или перетащите изображение
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative group max-w-xs">
          <img
            src={image.url}
            alt="Preview"
            className="w-full rounded-lg border border-gray-300 object-cover aspect-video"
          />
          <button
            onClick={removeImage}
            type="button"
            className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-full hover:bg-gray-700 transition"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-500 mt-2 truncate">{image.file.name}</p>
          <p className="text-xs text-gray-400">{(image.file.size / 1024 / 1024).toFixed(1)} MB</p>
        </div>
      )}
    </div>
  )
}

export default ImageUploadSection
