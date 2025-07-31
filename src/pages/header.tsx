import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.split("/").filter(Boolean).pop();

  return (
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lost & Found Board</h1>
          <p className="text-gray-600 text-lg">Help reunite people with their belongings</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/list")}
                className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${currentView === "list"
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-900 bg-gray-50 hover:bg-gray-50 text-gray-900"
                  }`}
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Items
              </Button>
              <Button
                onClick={() => navigate("/add")}
                className={`rounded-xl px-6 py-3 font-medium transition-all duration-200 ${currentView === "add"
                  ? "bg-gray-900 text-white shadow-md "
                  : "text-gray-900 bg-gray-50 hover:bg-gray-50 text-gray-900"
                  }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}
