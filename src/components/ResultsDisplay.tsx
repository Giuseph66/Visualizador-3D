import { Card } from "@/components/ui/card";
import { Package, Scale } from "lucide-react";

interface ResultsDisplayProps {
  volume: number;
  weight: number;
}

export const ResultsDisplay = ({ volume, weight }: ResultsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-primary/30 hover:border-primary transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Volume</p>
            <p className="text-3xl font-bold text-foreground">
              {volume.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">cm³</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-card to-accent/10 border-accent/30 hover:border-accent transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Scale className="w-6 h-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Peso Estimado</p>
            <p className="text-3xl font-bold text-foreground">
              {weight.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">gramas</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
