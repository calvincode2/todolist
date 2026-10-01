import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TodoCard({ todo, onClick, draggable, onDragStart, onDragOver, onDrop }) {
  return (
    <Card
      className="bg-white border border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
            {todo.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs shrink-0">
            {todo.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 truncate">
            {todo.user?.name || "Unassigned"}
          </p>
          <p className="text-xs text-gray-400">{todo.point} points</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default TodoCard;
