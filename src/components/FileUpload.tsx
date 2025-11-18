import { useCallback } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import * as THREE from "three";

interface FileUploadProps {
  onFileLoad: (geometry: THREE.BufferGeometry) => void;
}

export const FileUpload = ({ onFileLoad }: FileUploadProps) => {
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      let loadedCount = 0;
      const totalFiles = files.length;

      Array.from(files).forEach((file) => {
        if (!file.name.toLowerCase().endsWith(".stl")) {
          toast.error(`${file.name} não é um arquivo STL válido`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const geometry = parseSTL(arrayBuffer);
            onFileLoad(geometry);
            loadedCount++;
            
            if (loadedCount === totalFiles) {
              toast.success(`${totalFiles} modelo(s) carregado(s) com sucesso!`);
            }
          } catch (error) {
            console.error("Erro ao carregar arquivo:", error);
            toast.error(`Erro ao processar ${file.name}`);
          }
        };
        reader.readAsArrayBuffer(file);
      });

      // Reset input to allow re-uploading the same files
      event.target.value = '';
    },
    [onFileLoad]
  );

  return (
    <Card className="p-8 bg-card border-border hover:border-primary transition-colors cursor-pointer">
      <label htmlFor="stl-upload" className="cursor-pointer flex flex-col items-center gap-4">
        <div className="p-6 rounded-full bg-secondary/50">
          <Upload className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Carregar Arquivo(s) STL
          </h3>
          <p className="text-muted-foreground">
            Clique ou arraste arquivo(s) STL para começar
          </p>
          <p className="text-xs text-muted-foreground">
            Você pode selecionar múltiplos arquivos
          </p>
        </div>
        <input
          id="stl-upload"
          type="file"
          accept=".stl"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </Card>
  );
};

// STL Parser
function parseSTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  
  const isASCII = (buffer: ArrayBuffer) => {
    const view = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 1024));
    const text = String.fromCharCode.apply(null, Array.from(view));
    return text.includes("solid");
  };

  if (isASCII(arrayBuffer)) {
    return parseASCIISTL(arrayBuffer);
  } else {
    return parseBinarySTL(arrayBuffer);
  }
}

function parseBinarySTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const view = new DataView(arrayBuffer);
  const faces = view.getUint32(80, true);

  const vertices: number[] = [];
  const normals: number[] = [];

  for (let i = 0; i < faces; i++) {
    const offset = 84 + i * 50;

    // Normal
    const nx = view.getFloat32(offset, true);
    const ny = view.getFloat32(offset + 4, true);
    const nz = view.getFloat32(offset + 8, true);

    // Vertices
    for (let j = 0; j < 3; j++) {
      const vx = view.getFloat32(offset + 12 + j * 12, true);
      const vy = view.getFloat32(offset + 16 + j * 12, true);
      const vz = view.getFloat32(offset + 20 + j * 12, true);

      vertices.push(vx, vy, vz);
      normals.push(nx, ny, nz);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  return geometry;
}

function parseASCIISTL(arrayBuffer: ArrayBuffer): THREE.BufferGeometry {
  const text = new TextDecoder().decode(arrayBuffer);
  const vertices: number[] = [];
  const normals: number[] = [];

  const normalPattern = /normal\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
  const vertexPattern = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;

  let normalMatch;
  let vertexMatch;
  const normalMatches = Array.from(text.matchAll(normalPattern));
  const vertexMatches = Array.from(text.matchAll(vertexPattern));

  for (let i = 0; i < normalMatches.length; i++) {
    const normal = normalMatches[i];
    const nx = parseFloat(normal[1]);
    const ny = parseFloat(normal[2]);
    const nz = parseFloat(normal[3]);

    for (let j = 0; j < 3; j++) {
      const vertexIndex = i * 3 + j;
      if (vertexIndex < vertexMatches.length) {
        const vertex = vertexMatches[vertexIndex];
        vertices.push(
          parseFloat(vertex[1]),
          parseFloat(vertex[2]),
          parseFloat(vertex[3])
        );
        normals.push(nx, ny, nz);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  return geometry;
}
