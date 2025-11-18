import { Model3D } from "@/types/model";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Unlock, Copy, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ModelListProps {
  models: Model3D[];
  selectedModelId: string | null;
  onSelectModel: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export const ModelList = ({
  models,
  selectedModelId,
  onSelectModel,
  onToggleVisibility,
  onToggleLock,
  onDuplicate,
  onDelete,
  onRename,
}: ModelListProps) => {
  return (
    <Card className="p-4 bg-card border-border h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Objetos</h3>

      {models.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhum modelo carregado
        </p>
      ) : (
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                model.id === selectedModelId
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelectModel(model.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={model.name}
                  onChange={(e) => onRename(model.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 text-sm flex-1 bg-background"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(model.id);
                  }}
                  className="p-1 hover:bg-secondary rounded"
                  title={model.visible ? "Ocultar" : "Mostrar"}
                >
                  {model.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(model.id);
                  }}
                  className="p-1 hover:bg-secondary rounded"
                  title={model.locked ? "Desbloquear" : "Bloquear"}
                >
                  {model.locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(model.id);
                  }}
                  className="p-1 hover:bg-secondary rounded"
                  title="Duplicar"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(model.id);
                  }}
                  className="p-1 hover:bg-destructive/20 text-destructive rounded"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
