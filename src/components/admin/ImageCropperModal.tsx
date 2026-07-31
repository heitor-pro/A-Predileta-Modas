import { useCallback, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Button } from '@/components/ui/Button';
import { X, ZoomIn } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  aspect?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

// Editor de recorte usado antes de qualquer upload de foto de produto.
// Garante que todas as imagens do catálogo tenham a mesma proporção visual (padrão 3:4),
// mesmo vindo de celulares diferentes com tamanhos/proporções distintas.
export function ImageCropperModal({ imageSrc, aspect = 3 / 4, onCancel, onConfirm }: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-paper dark:bg-ink-card p-5 shadow-premium">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl">Ajustar foto do produto</h3>
          <button onClick={onCancel} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ZoomIn size={16} className="text-silver-400" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-silver-500"
            aria-label="Zoom da imagem"
          />
        </div>

        <p className="mt-2 text-xs text-silver-500">
          Arraste a imagem para posicionar e use o controle acima para dar zoom. O recorte final
          mantém a mesma proporção em todas as fotos do catálogo.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={processing}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={processing || !croppedAreaPixels}>
            {processing ? 'Salvando...' : 'Confirmar recorte'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Gera o blob final recortado usando um canvas, a partir da área selecionada no cropper.
async function getCroppedImageBlob(imageSrc: string, area: Area): Promise<Blob> {
  const image = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const OUTPUT_SIZE = 1200; // padroniza a resolução final de todas as fotos do catálogo

  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE * (area.height / area.width);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível processar a imagem.');

  ctx.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem recortada.'))),
      'image/jpeg',
      0.92
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
