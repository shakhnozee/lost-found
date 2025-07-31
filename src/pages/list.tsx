import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Search, Filter, MapPin, Calendar, Check, X, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getItems, updateItem } from "@/services/api"
import type { Item } from "@/types"

export default function ItemList() {
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<"All" | "Lost" | "Found">("All")
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Done">("All")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    
    console.log("list")
    const queryClient = useQueryClient()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, typeFilter, statusFilter])

    const { data: items = [], isLoading } = useQuery({
        queryKey: ["items"],
        queryFn: getItems,
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) => updateItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] })
        },
    })

    const filteredItems = useMemo(() => {
        return items.filter((item: Item) => {
            const matchesSearch = item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
            const matchesType = typeFilter === "All" || item.type === typeFilter
            const matchesStatus = statusFilter === "All" || item.status === statusFilter

            return matchesSearch && matchesType && matchesStatus
        })
    }, [items, debouncedSearch, typeFilter, statusFilter])

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredItems.slice(startIndex, endIndex)
    }, [filteredItems, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

    const handleMarkAsDone = (item: Item) => {
        updateMutation.mutate({
            id: item.id,
            data: { ...item, status: item.status === "Active" ? "Done" : "Active" },
        })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    console.log("items:", items)
    console.log("filteredItems:", filteredItems)

    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 pb-6"> 
            {/* Filters */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search items by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-xl border-2 border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-3">
                            <Select value={typeFilter} onValueChange={(value: "All" | "Lost" | "Found") => setTypeFilter(value)}>
                                <SelectTrigger className="w-32 rounded-xl border-2 border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-all duration-200">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="All" className="rounded-lg">
                                        All Types
                                    </SelectItem>
                                    <SelectItem value="Lost" className="rounded-lg">
                                        Lost
                                    </SelectItem>
                                    <SelectItem value="Found" className="rounded-lg">
                                        Found
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={(value: "All" | "Active" | "Done") => setStatusFilter(value)}>
                                <SelectTrigger className="w-32 rounded-xl border-2 border-gray-200 hover:border-gray-400 focus:border-gray-900 transition-all duration-200">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="All" className="rounded-lg">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="Active" className="rounded-lg">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="Done" className="rounded-lg">
                                        Done
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* View Toggle */}
                            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className={`rounded-none px-3 ${viewMode === "grid" 
                                        ? "bg-gray-900 text-white" 
                                        : "hover:bg-gray-100"
                                    }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={`rounded-none px-3 ${viewMode === "list" 
                                        ? "bg-gray-900 text-white" 
                                        : "hover:bg-gray-100"
                                    }`}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="text-center mb-4">
                <p className="text-gray-600">
                    Showing {paginatedItems.length} of {filteredItems.length} items 
                    {totalPages > 1 && (
                        <span className="ml-2">
                            (Page {currentPage} of {totalPages})
                        </span>
                    )}
                </p>
            </div>

            {/* Items Display */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedItems.map((item: Item) => (
                        <Card
                            key={item.id}
                            className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer group"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={item.imageUrl || "https://daprint.ru/upload/iblock/f01/6j6q3imqo9csrtj08j642hdmzl4dzapv.jpg"}
                                    alt={item.name}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "https://daprint.ru/upload/iblock/f01/6j6q3imqo9csrtj08j642hdmzl4dzapv.jpg"
                                    }}
                                />
                            </div>

                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                    <div className="flex gap-2">
                                        <Badge
                                            variant={item.type === "Lost" ? "destructive" : "default"}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${item.type === "Lost"
                                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                : "bg-green-100 text-green-800 hover:bg-green-200"
                                                }`}
                                        >
                                            {item.type}
                                        </Badge>
                                        <Badge
                                            variant={item.status === "Active" ? "default" : "secondary"}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Active"
                                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                }`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {item.location}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(item.date).toLocaleDateString()}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleMarkAsDone(item)}
                                    disabled={updateMutation.isPending}
                                    variant={item.status === "Active" ? "default" : "outline"}
                                    className={`w-full rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${item.status === "Active"
                                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                                        : "border-2 border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                                        }`}
                                >
                                    {item.status === "Active" ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as Done
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-4 h-4 mr-2" />
                                            Mark as Active
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {paginatedItems.map((item: Item) => (
                        <Card
                            key={item.id}
                            className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-xl">
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
                                    
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                                            <div className="flex gap-2">
                                                <Badge
                                                    variant={item.type === "Lost" ? "destructive" : "default"}
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${item.type === "Lost"
                                                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                        : "bg-green-100 text-green-800 hover:bg-green-200"
                                                        }`}
                                                >
                                                    {item.type}
                                                </Badge>
                                                <Badge
                                                    variant={item.status === "Active" ? "default" : "secondary"}
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === "Active"
                                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="w-5 h-5 mr-2" />
                                                    {item.location}
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <Calendar className="w-5 h-5 mr-2" />
                                                    {new Date(item.date).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleMarkAsDone(item)}
                                                disabled={updateMutation.isPending}
                                                variant={item.status === "Active" ? "default" : "outline"}
                                                className={`w-full md:w-auto rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${item.status === "Active"
                                                    ? "bg-gray-900 hover:bg-gray-800 text-white"
                                                    : "border-2 border-gray-200 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                                                    }`}
                                            >
                                                {item.status === "Active" ? (
                                                    <>
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Mark as Done
                                                    </>
                                                ) : (
                                                    <>
                                                        <X className="w-4 h-4 mr-2" />
                                                        Mark as Active
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-xl border-2 border-gray-200 hover:border-gray-400"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            <div className="flex gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className={`rounded-xl w-10 h-10 ${currentPage === page
                                            ? "bg-gray-900 text-white"
                                            : "border-2 border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-xl border-2 border-gray-200 hover:border-gray-400"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {filteredItems.length === 0 && (
                <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                        <p className="text-gray-600">Try adjusting your search or filters</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}