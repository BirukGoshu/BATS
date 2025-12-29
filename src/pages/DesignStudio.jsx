import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import designService from '../services/designService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const DesignStudio = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const historyRef = useRef([]);
  const historyStepRef = useRef(-1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, eraser, text, rectangle, circle, line
  const [color, setColor] = useState('#3f81d4');
  const [fillColor, setFillColor] = useState('#3f81d4');
  const [brushSize, setBrushSize] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [designName, setDesignName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [canvasContext, setCanvasContext] = useState(null);
  const [layers, setLayers] = useState([{ id: 1, name: 'Layer 1', visible: true, opacity: 1 }]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [textInput, setTextInput] = useState('');
  const [textSize, setTextSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [startPos, setStartPos] = useState(null);
  const [currentShape, setCurrentShape] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    setCanvasContext(ctx);

    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;

    // Set default background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    saveState();
  }, []);

  // Save canvas state for undo/redo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    historyStepRef.current++;
    
    // Remove any future history if we're not at the end
    if (historyStepRef.current < historyRef.current.length) {
      historyRef.current = historyRef.current.slice(0, historyStepRef.current);
    }
    
    historyRef.current.push(imageData);
    
    // Limit history to 50 states
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
      historyStepRef.current--;
    }
  };

  // Undo
  const undo = () => {
    if (historyStepRef.current > 0) {
      historyStepRef.current--;
      restoreState();
    }
  };

  // Redo
  const redo = () => {
    if (historyStepRef.current < historyRef.current.length - 1) {
      historyStepRef.current++;
      restoreState();
    }
  };

  // Restore canvas state
  const restoreState = () => {
    const canvas = canvasRef.current;
    if (!canvas || !historyRef.current[historyStepRef.current]) return;

    const img = new Image();
    img.onload = () => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(img, 0, 0);
    };
    img.src = historyRef.current[historyStepRef.current];
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const coords = getCoordinates(e);
    
    if (tool === 'brush' || tool === 'eraser') {
      setIsDrawing(true);
      canvasContext.beginPath();
      canvasContext.moveTo(coords.x, coords.y);
      
      if (tool === 'eraser') {
        canvasContext.globalCompositeOperation = 'destination-out';
      } else {
        canvasContext.globalCompositeOperation = 'source-over';
      }
      
      canvasContext.strokeStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
      canvasContext.lineWidth = brushSize;
      canvasContext.lineCap = 'round';
      canvasContext.lineJoin = 'round';
      canvasContext.globalAlpha = opacity;
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      setStartPos(coords);
      setCurrentShape({ type: tool, start: coords, end: coords });
    }
  };

  const draw = (e) => {
    if (!isDrawing && tool !== 'rectangle' && tool !== 'circle' && tool !== 'line') return;

    const coords = getCoordinates(e);

    if (tool === 'brush' || tool === 'eraser') {
      canvasContext.lineTo(coords.x, coords.y);
      canvasContext.stroke();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      if (startPos) {
        // Redraw everything to show preview
        restoreState();
        canvasContext.save();
        canvasContext.globalAlpha = opacity;
        
        if (tool === 'rectangle') {
          canvasContext.strokeStyle = color;
          canvasContext.fillStyle = fillColor;
          const width = coords.x - startPos.x;
          const height = coords.y - startPos.y;
          canvasContext.fillRect(startPos.x, startPos.y, width, height);
          canvasContext.strokeRect(startPos.x, startPos.y, width, height);
        } else if (tool === 'circle') {
          canvasContext.strokeStyle = color;
          canvasContext.fillStyle = fillColor;
          const radius = Math.sqrt(
            Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2)
          );
          canvasContext.beginPath();
          canvasContext.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
          canvasContext.fill();
          canvasContext.stroke();
        } else if (tool === 'line') {
          canvasContext.strokeStyle = color;
          canvasContext.lineWidth = brushSize;
          canvasContext.beginPath();
          canvasContext.moveTo(startPos.x, startPos.y);
          canvasContext.lineTo(coords.x, coords.y);
          canvasContext.stroke();
        }
        
        canvasContext.restore();
        setCurrentShape({ type: tool, start: startPos, end: coords });
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      canvasContext.beginPath();
      setIsDrawing(false);
      saveState();
    } else if (startPos && (tool === 'rectangle' || tool === 'circle' || tool === 'line')) {
      saveState();
      setStartPos(null);
      setCurrentShape(null);
    }
  };

  const addText = () => {
    if (!textInput.trim()) {
      toast.error('Please enter text');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvasContext;
    
    ctx.save();
    ctx.font = `${textSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fillText(textInput, canvas.width / 2, canvas.height / 2);
    ctx.restore();
    
    saveState();
    setTextInput('');
    toast.success('Text added');
  };

  const clearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      if (canvasContext && canvasRef.current) {
        canvasContext.fillStyle = '#ffffff';
        canvasContext.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        saveState();
      }
    }
  };

  // Apply filters
  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Brightness
      data[i] = Math.min(255, (data[i] * filters.brightness) / 100);
      data[i + 1] = Math.min(255, (data[i + 1] * filters.brightness) / 100);
      data[i + 2] = Math.min(255, (data[i + 2] * filters.brightness) / 100);

      // Contrast
      const factor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }

    canvasContext.putImageData(imageData, 0, 0);
    saveState();
    toast.success('Filters applied');
  };

  const saveDesign = async () => {
    if (!designName.trim()) {
      toast.error('Please enter a design name');
      return;
    }

    if (!canvasRef.current) {
      toast.error('Canvas not initialized');
      return;
    }

    setSaving(true);
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          toast.error('Failed to create design image');
          setSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append('title', designName);
        if (description) {
          formData.append('description', description);
        }
        formData.append('design_image', blob, `${designName.replace(/\s+/g, '_')}.png`);

        await designService.uploadDesign(formData);
        toast.success('Design saved successfully!');
        navigate('/designs');
      }, 'image/png');
    } catch (error) {
      console.error('Error saving design:', error);
      toast.error(error.response?.data?.message || 'Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const colorPalette = [
    '#3f81d4', '#3b6289', '#1a237e', '#000000', '#ffffff',
    '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899',
  ];

  const tools = [
    { id: 'brush', name: 'Brush', icon: '🖌️' },
    { id: 'eraser', name: 'Eraser', icon: '🧹' },
    { id: 'text', name: 'Text', icon: '📝' },
    { id: 'rectangle', name: 'Rectangle', icon: '▭' },
    { id: 'circle', name: 'Circle', icon: '○' },
    { id: 'line', name: 'Line', icon: '─' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Design Studio</h1>
        <p className="text-gray-600">Professional design tools with Photoshop-like features</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Canvas Area */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Canvas</h2>
                  <span className="text-sm text-gray-500">({zoom}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={historyStepRef.current <= 0}
                  >
                    ↶ Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={historyStepRef.current >= historyRef.current.length - 1}
                  >
                    ↷ Redo
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white relative">
                <div
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left',
                    width: `${(100 / zoom) * 100}%`,
                    height: `${(100 / zoom) * 100}%`,
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full cursor-crosshair"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Zoom:</label>
                <input
                  type="range"
                  min="25"
                  max="200"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{zoom}%</span>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Tools Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Design Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Design Info</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Design Name"
                type="text"
                name="designName"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name"
                required
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={saveDesign}
                loading={saving}
                disabled={saving || !designName.trim()}
              >
                {saving ? 'Saving...' : 'Save Design'}
              </Button>
            </CardBody>
          </Card>

          {/* Tools */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Tools</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      tool === t.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={t.name}
                  >
                    <span className="text-2xl">{t.icon}</span>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Text Tool */}
          {tool === 'text' && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Text Options</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Text"
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size: {textSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="100"
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
                <Button variant="primary" size="sm" className="w-full" onClick={addText}>
                  Add Text
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Colors */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Colors</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stroke Color
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {colorPalette.map((paletteColor) => (
                    <button
                      key={paletteColor}
                      onClick={() => setColor(paletteColor)}
                      className={`w-8 h-8 rounded border-2 ${
                        color === paletteColor
                          ? 'border-primary-600 scale-110'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: paletteColor }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-300"
                />
              </div>
              {(tool === 'rectangle' || tool === 'circle') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fill Color
                  </label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {/* Brush Settings */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Brush Settings</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size: {brushSize}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opacity: {Math.round(opacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </CardBody>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Filters</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brightness: {filters.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.brightness}
                  onChange={(e) =>
                    setFilters({ ...filters, brightness: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contrast: {filters.contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={filters.contrast}
                  onChange={(e) =>
                    setFilters({ ...filters, contrast: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
