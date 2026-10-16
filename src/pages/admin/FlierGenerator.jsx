import React, { useEffect, useRef, useState, useCallback } from "react";
import * as fabric from "fabric";
import {
  Type,
  Image as ImageIcon,
  Download,
  Trash2,
  Square,
  Circle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  ChevronUp,
  ChevronDown,
  Wand2,
  Group,
  Undo2,
  Redo2,
  Sparkles,
  Moon,
  Columns2,
  Rows2,
  Bold,
  Italic,
  Scissors,
  Frame,
  AlignJustify,
  Brush,
  Layers,
  Copy,
  Lock,
  Unlock,
  Settings2,
  Ghost,
  Droplets,
  Contrast,
  Eraser,
  Wind,
  MousePointer2,
  Menu,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";

const FlierGenerator = () => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedObj, setSelectedObj] = useState(null);
  const [customColor, setCustomColor] = useState("#1a1a1a");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(50);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileToolbar, setShowMobileToolbar] = useState(false);
  const [showMobileProperties, setShowMobileProperties] = useState(false);

  const history = useRef([]);
  const historyPtr = useRef(-1);
  const isProcessingHistory = useRef(false);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@900&family=Alex+Brush&family=Dancing+Script&family=Montserrat:wght@700&family=Oswald:wght@700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const saveToHistory = useCallback(
    (canvasInstance) => {
      const canvas = canvasInstance || fabricCanvas;
      if (!canvas || isProcessingHistory.current) return;
      try {
        const state = JSON.stringify(canvas.toJSON());
        if (historyPtr.current < history.current.length - 1) {
          history.current = history.current.slice(0, historyPtr.current + 1);
        }
        history.current.push(state);
        if (history.current.length > 25) history.current.shift();
        historyPtr.current = history.current.length - 1;
      } catch (err) {
        console.warn("History failed.");
      }
    },
    [fabricCanvas],
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const canvasHeight = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;

    const canvas = new fabric.Canvas("HTN-canvas", {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      stopContextMenu: true,
    });
    setFabricCanvas(canvas);

    canvas.on("object:added", (e) => {
      if (!e.target?._fromHistory) saveToHistory(canvas);
    });
    canvas.on("object:modified", () => saveToHistory(canvas));
    canvas.on("object:removed", (e) => {
      if (!e.target?._fromHistory) saveToHistory(canvas);
    });
    canvas.on("selection:created", (e) => setSelectedObj(e.selected[0]));
    canvas.on("selection:updated", (e) => setSelectedObj(e.selected[0]));
    canvas.on("selection:cleared", () => setSelectedObj(null));

    return () => {
      canvas.dispose();
    };
  }, [isMobile]);

  const updateCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.renderAll();
    saveToHistory();
  };

  const toggleDrawing = (mode) => {
    if (!fabricCanvas) return;

    const newDrawingMode = mode === "brush" ? !isDrawing : false;
    const newErasingMode = mode === "erase" ? !isErasing : false;

    setIsDrawing(newDrawingMode);
    setIsErasing(newErasingMode);

    fabricCanvas.isDrawingMode = newDrawingMode || newErasingMode;

    if (fabricCanvas.isDrawingMode) {
      if (newErasingMode) {
        const eraser = new fabric.EraserBrush(fabricCanvas);
        eraser.width = brushSize;
        fabricCanvas.freeDrawingBrush = eraser;
      } else {
        const b = new fabric.PencilBrush(fabricCanvas);
        b.width = brushSize;
        b.color = customColor;
        b.shadow = new fabric.Shadow({ blur: brushSize, color: customColor });
        fabricCanvas.freeDrawingBrush = b;
      }
    }
  };

  const handleCornerChange = (corner, value) => {
    if (!selectedObj || selectedObj.type !== "rect") return;
    const val = parseInt(value) || 0;
    selectedObj.set({ [corner]: val });
    updateCanvas();
  };

  const handleImageUpload = (e, mode) => {
    const file = e.target.files[0];
    if (!file || !fabricCanvas) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, { crossOrigin: "anonymous" }).then(
        (img) => {
          const canvasWidth = isMobile
            ? Math.min(window.innerWidth - 40, 400)
            : 600;
          const canvasHeight = isMobile
            ? Math.min(window.innerWidth - 40, 400)
            : 600;

          if (mode === "bg") {
            const scale = Math.max(
              canvasWidth / img.width,
              canvasHeight / img.height,
            );
            img.set({
              scaleX: scale,
              scaleY: scale,
              originX: "center",
              originY: "center",
              left: canvasWidth / 2,
              top: canvasHeight / 2,
              selectable: false,
              evented: false,
            });
            fabricCanvas.backgroundImage = img;
          } else {
            img.scaleToWidth(isMobile ? 200 : 280);
            fabricCanvas.add(img);
            fabricCanvas.centerObject(img);
          }
          updateCanvas();
        },
      );
    };
    reader.readAsDataURL(file);
  };

  const alignObj = (type) => {
    if (!selectedObj || !fabricCanvas) return;
    const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const canvasHeight = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;

    if (type === "centerH") fabricCanvas.centerObjectH(selectedObj);
    if (type === "centerV") fabricCanvas.centerObjectV(selectedObj);
    if (type === "left") selectedObj.set("left", 0);
    if (type === "right")
      selectedObj.set("left", canvasWidth - selectedObj.getScaledWidth());
    if (type === "top") selectedObj.set("top", 0);
    if (type === "bottom")
      selectedObj.set("top", canvasHeight - selectedObj.getScaledHeight());
    selectedObj.setCoords();
    updateCanvas();
  };

  const addText = () => {
    if (!fabricCanvas) return;
    const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const t = new fabric.IText("New Text", {
      left: canvasWidth / 2 - 50,
      top: canvasHeight / 2 - 20,
      fontFamily: "Albert Sans",
      fill: customColor,
      fontSize: isMobile ? 28 : 40,
    });
    fabricCanvas.add(t);
    fabricCanvas.setActiveObject(t);
    updateCanvas();
  };

  const addRect = () => {
    if (!fabricCanvas) return;
    const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const canvasHeight = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const r = new fabric.Rect({
      width: canvasWidth,
      height: isMobile ? 60 : 120,
      fill: "#002a5c",
      top: canvasHeight - (isMobile ? 60 : 120),
      rx: 0,
      ry: 0,
    });
    fabricCanvas.add(r);
    updateCanvas();
  };

  const addCircle = () => {
    if (!fabricCanvas) return;
    const radius = isMobile ? 30 : 50;
    const c = new fabric.Circle({
      radius: radius,
      fill: "#ffd700",
      left: 100,
      top: 100,
    });
    fabricCanvas.add(c);
    updateCanvas();
  };

  const addVignette = () => {
    if (!fabricCanvas) return;
    const canvasWidth = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const canvasHeight = isMobile ? Math.min(window.innerWidth - 40, 400) : 600;
    const v = new fabric.Rect({
      width: canvasWidth,
      height: canvasHeight,
      fill: "transparent",
      selectable: false,
      evented: false,
    });
    const grad = new fabric.Gradient({
      type: "radial",
      coords: {
        r1: 0,
        r2: canvasWidth / 1.5,
        x1: canvasWidth / 2,
        y1: canvasHeight / 2,
        x2: canvasWidth / 2,
        y2: canvasHeight / 2,
      },
      colorStops: [
        { offset: 0, color: "rgba(0,0,0,0)" },
        { offset: 1, color: "rgba(0,0,0,0.6)" },
      ],
    });
    v.set("fill", grad);
    fabricCanvas.add(v);
    fabricCanvas.bringToFront(v);
    updateCanvas();
  };

  const handleUndo = async () => {
    if (historyPtr.current <= 0) return;
    isProcessingHistory.current = true;
    historyPtr.current -= 1;
    await fabricCanvas.loadFromJSON(history.current[historyPtr.current]);
    fabricCanvas.renderAll();
    isProcessingHistory.current = false;
  };

  const handleRedo = async () => {
    if (historyPtr.current >= history.current.length - 1) return;
    isProcessingHistory.current = true;
    historyPtr.current += 1;
    await fabricCanvas.loadFromJSON(history.current[historyPtr.current]);
    fabricCanvas.renderAll();
    isProcessingHistory.current = false;
  };

  const handleGroup = () => {
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObjects();
    if (active.length > 1) {
      const g = new fabric.Group(active);
      active.forEach((o) => fabricCanvas.remove(o));
      fabricCanvas.add(g);
      updateCanvas();
    }
  };

  const toggleGhost = () => {
    if (!selectedObj) return;
    selectedObj.set("opacity", selectedObj.opacity === 0.5 ? 1 : 0.5);
    updateCanvas();
  };

  const handleDelete = () => {
    if (!fabricCanvas) return;
    fabricCanvas.remove(...fabricCanvas.getActiveObjects());
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  const handleDuplicate = () => {
    const obj = fabricCanvas.getActiveObject();
    if (!obj) return;
    obj.clone().then((cloned) => {
      cloned.set({ left: obj.left + 20, top: obj.top + 20 });
      fabricCanvas.add(cloned);
      updateCanvas();
    });
  };

  const toggleLock = () => {
    if (!selectedObj) return;
    const isLocked = !selectedObj.lockMovementX;
    selectedObj.set({
      lockMovementX: isLocked,
      lockMovementY: isLocked,
      lockScalingX: isLocked,
      lockScalingY: isLocked,
    });
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
  };

  const downloadImage = () => {
    if (!fabricCanvas) return;
    saveAs(fabricCanvas.toDataURL({ multiplier: 3 }), "HTN-design.png");
  };

  return (
    <div className="flex flex-col h-screen bg-[#f1f5f9] font-albert-sans overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-3 bg-white border-b shadow-sm z-30">
          <button
            onClick={() => setShowMobileToolbar(!showMobileToolbar)}
            className="p-2 bg-secondary/10 rounded-lg"
          >
            {showMobileToolbar ? (
              <X size={20} className="text-secondary" />
            ) : (
              <Menu size={20} className="text-secondary" />
            )}
          </button>
          <span className="text-[10px] font-black text-primary/40 tracking-widest italic">
            HTN Creative Engine
          </span>
          <button
            onClick={() => setShowMobileProperties(!showMobileProperties)}
            className="p-2 bg-secondary/10 rounded-lg"
          >
            <Settings2 size={18} className="text-secondary" />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* TOOLBAR - Mobile Overlay */}
        <div
          className={`
          ${isMobile ? "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300" : "relative z-20"}
          ${isMobile && !showMobileToolbar ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"}
        `}
        >
          <div
            className={`
            ${isMobile ? "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto" : "w-48 bg-white border-r"}
            flex flex-wrap content-start p-3 gap-2 shadow-xl
          `}
          >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>

            {isMobile && (
              <div className="w-full flex justify-between items-center p-2 border-b border-gray-100 mb-2">
                <span className="text-[10px] font-black text-secondary uppercase">
                  Tools
                </span>
                <button
                  onClick={() => setShowMobileToolbar(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            )}

            <div className="w-full h-8 md:h-10 bg-secondary rounded-xl flex items-center justify-center text-white mb-2 font-black text-[8px] md:text-[10px] uppercase tracking-tighter">
              HTN ULTIMATE PRO
            </div>

            <div className="grid grid-cols-3 md:grid-cols-2 gap-1.5 md:gap-2 w-full">
              <ToolButton
                icon={<Type size={isMobile ? 14 : 18} />}
                label="Text"
                onClick={addText}
              />
              <ToolInput
                icon={<ImageIcon size={isMobile ? 14 : 18} />}
                label="Photo"
                onChange={(e) => handleImageUpload(e, "img")}
              />
              <ToolInput
                icon={<Maximize size={isMobile ? 14 : 18} />}
                label="Cover BG"
                onChange={(e) => handleImageUpload(e, "bg")}
              />
              <ToolButton
                icon={<Eraser size={isMobile ? 14 : 18} />}
                label="Fade"
                active={isErasing}
                onClick={() => toggleDrawing("erase")}
              />
              <ToolButton
                icon={<Square size={isMobile ? 14 : 18} />}
                label="Block"
                onClick={addRect}
              />
              <ToolButton
                icon={<Circle size={isMobile ? 14 : 18} />}
                label="Circle"
                onClick={addCircle}
              />
            </div>

            <div className="w-full border-t border-gray-100 my-2"></div>

            <div className="grid grid-cols-3 md:grid-cols-2 gap-1.5 md:gap-2 w-full pb-2 md:pb-10">
              <ToolButton
                icon={<Brush size={isMobile ? 14 : 18} />}
                label="Brush"
                onClick={() => toggleDrawing("brush")}
                active={isDrawing}
              />
              <ToolButton
                icon={<Scissors size={isMobile ? 14 : 18} />}
                label="Curve"
                onClick={() => {
                  if (!selectedObj) return;
                  selectedObj.set({
                    clipPath: new fabric.Ellipse({
                      rx: selectedObj.width / 2,
                      ry: selectedObj.height,
                      originX: "center",
                      originY: "center",
                    }),
                  });
                  updateCanvas();
                }}
              />
              <ToolButton
                icon={<Moon size={isMobile ? 14 : 18} />}
                label="Vignette"
                onClick={addVignette}
              />
              <ToolButton
                icon={<Copy size={isMobile ? 14 : 18} />}
                label="Duplicate"
                onClick={handleDuplicate}
              />
              <ToolButton
                icon={<Undo2 size={isMobile ? 14 : 18} />}
                label="Undo"
                onClick={handleUndo}
              />
              <ToolButton
                icon={<Redo2 size={isMobile ? 14 : 18} />}
                label="Redo"
                onClick={handleRedo}
              />
              <ToolButton
                icon={<Group size={isMobile ? 14 : 18} />}
                label="Group"
                onClick={handleGroup}
              />
              <ToolButton
                icon={<Ghost size={isMobile ? 14 : 18} />}
                label="Ghost"
                onClick={toggleGhost}
              />
            </div>

            <button
              onClick={handleDelete}
              className="w-full p-2 md:p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-1.5 md:gap-2 text-[7px] md:text-[9px] font-black uppercase"
            >
              <Trash2 size={isMobile ? 14 : 16} /> Delete
            </button>
          </div>
        </div>

        {/* CANVAS */}
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4">
          {!isMobile && (
            <div className="mb-4 flex items-center gap-4 bg-white px-6 py-2 rounded-full shadow-sm">
              <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest italic">
                HTN Creative Engine v4.0
              </span>
              <button
                onClick={downloadImage}
                className="bg-secondary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform"
              >
                Download PNG
              </button>
            </div>
          )}

          {isMobile && (
            <div className="mb-2 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
              <button
                onClick={downloadImage}
                className="bg-secondary text-white px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg"
              >
                Download PNG
              </button>
            </div>
          )}

          <div
            className={`bg-white p-1.5 md:p-3 rounded-[20px] md:rounded-[32px] shadow-2xl ${isMobile ? "w-[calc(100vw-20px)]" : ""}`}
          >
            <canvas
              id="HTN-canvas"
              ref={canvasRef}
              className={`rounded-[12px] md:rounded-[20px] ${isMobile ? "w-full h-auto" : ""}`}
            />
          </div>
        </div>

        {/* PROPERTIES - Mobile Overlay */}
        <div
          className={`
          ${isMobile ? "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300" : "relative z-20"}
          ${isMobile && !showMobileProperties ? "pointer-events-none opacity-0" : "pointer-events-auto opacity-100"}
        `}
        >
          <div
            className={`
            ${isMobile ? "absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto p-4" : "w-80 bg-white border-l p-6 overflow-y-auto"}
          `}
          >
            {isMobile && (
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
                <h3 className="text-[11px] font-black uppercase text-primary flex items-center gap-2">
                  <Settings2 size={16} className="text-secondary" /> Precision
                </h3>
                <button
                  onClick={() => setShowMobileProperties(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            )}

            {!isMobile && (
              <h3 className="text-[11px] font-black uppercase text-primary mb-6 flex items-center gap-2">
                <Settings2 size={16} className="text-secondary" /> Precision
                Panel
              </h3>
            )}

            {(isDrawing || isErasing) && (
              <div className="mb-6 bg-secondary/5 p-4 rounded-2xl border border-secondary/10 space-y-3">
                <label className="text-[9px] font-black text-secondary uppercase italic">
                  {isErasing ? "Fade Brush Size" : "Brush Size"}
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={brushSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBrushSize(val);
                    if (fabricCanvas) fabricCanvas.freeDrawingBrush.width = val;
                  }}
                  className="w-full accent-secondary"
                />
              </div>
            )}

            {selectedObj ? (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gray-50 p-3 md:p-4 rounded-2xl space-y-3 border border-gray-100">
                  <label className="text-[8px] md:text-[9px] font-black text-primary/40 uppercase">
                    Object Blending
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                    <button
                      onClick={() => {
                        const blur = new fabric.filters.Blur({ blur: 0.1 });
                        selectedObj.filters.push(blur);
                        selectedObj.applyFilters();
                        updateCanvas();
                      }}
                      className="flex items-center justify-center gap-1.5 p-1.5 md:p-2 bg-white border rounded-lg text-[8px] md:text-[10px] font-bold hover:bg-secondary hover:text-white transition-all"
                    >
                      <Droplets size={isMobile ? 12 : 14} /> Feather
                    </button>
                    <button
                      onClick={() => {
                        selectedObj.set({ rx: 40, ry: 40 });
                        updateCanvas();
                      }}
                      className="flex items-center justify-center gap-1.5 p-1.5 md:p-2 bg-white border rounded-lg text-[8px] md:text-[10px] font-bold hover:bg-secondary hover:text-white transition-all"
                    >
                      <Circle size={isMobile ? 12 : 14} /> Round All
                    </button>
                  </div>
                </div>

                {selectedObj.type === "rect" && (
                  <div className="bg-gray-50 p-3 md:p-4 rounded-2xl space-y-3 border border-gray-100">
                    <label className="text-[8px] md:text-[9px] font-black text-primary/40 uppercase">
                      Corner Sculpting
                    </label>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <span className="text-[6px] md:text-[7px] font-black block">
                          Width (rx)
                        </span>
                        <input
                          type="number"
                          className="w-full p-1.5 md:p-2 text-xs border rounded"
                          onChange={(e) =>
                            handleCornerChange("rx", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <span className="text-[6px] md:text-[7px] font-black block">
                          Height (ry)
                        </span>
                        <input
                          type="number"
                          className="w-full p-1.5 md:p-2 text-xs border rounded"
                          onChange={(e) =>
                            handleCornerChange("ry", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(selectedObj.type === "i-text" ||
                  selectedObj.type === "text") && (
                  <div className="bg-gray-50 p-3 md:p-4 rounded-2xl space-y-3 border border-gray-100">
                    <label className="text-[8px] md:text-[9px] font-black text-primary/40 uppercase">
                      Typography
                    </label>
                    <select
                      className="w-full p-1.5 md:p-2 bg-white border rounded-lg text-[10px] md:text-[11px] font-bold"
                      value={selectedObj.fontFamily}
                      onChange={(e) => {
                        selectedObj.set("fontFamily", e.target.value);
                        updateCanvas();
                      }}
                    >
                      <option value="Albert Sans">Modern Clean</option>
                      <option value="Alex Brush">Premium Luxury</option>
                      <option value="Oswald">Bold Impact</option>
                    </select>
                    <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                      <IconButton
                        icon={<Bold size={isMobile ? 12 : 14} />}
                        onClick={() => {
                          selectedObj.set(
                            "fontWeight",
                            selectedObj.fontWeight === "bold"
                              ? "normal"
                              : "bold",
                          );
                          updateCanvas();
                        }}
                      />
                      <IconButton
                        icon={<Italic size={isMobile ? 12 : 14} />}
                        onClick={() => {
                          selectedObj.set(
                            "fontStyle",
                            selectedObj.fontStyle === "italic"
                              ? "normal"
                              : "italic",
                          );
                          updateCanvas();
                        }}
                      />
                      <IconButton
                        icon={<AlignJustify size={isMobile ? 12 : 14} />}
                        onClick={() => {
                          selectedObj.set("textAlign", "center");
                          updateCanvas();
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 md:space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        if (selectedObj)
                          selectedObj.set("fill", e.target.value);
                        updateCanvas();
                      }}
                      className="w-10 h-8 md:w-12 md:h-10 rounded-lg cursor-pointer"
                    />
                    <button
                      onClick={toggleLock}
                      className="flex-1 bg-primary text-white rounded-lg flex items-center justify-center gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black uppercase p-1.5 md:p-2"
                    >
                      {selectedObj.lockMovementX ? (
                        <Unlock size={isMobile ? 12 : 14} />
                      ) : (
                        <Lock size={isMobile ? 12 : 14} />
                      )}{" "}
                      {selectedObj.lockMovementX ? "Unlock" : "Lock"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 md:gap-2 bg-gray-50 p-2 rounded-xl">
                  <IconButton
                    icon={<AlignLeft size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("left")}
                  />
                  <IconButton
                    icon={<Columns2 size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("centerH")}
                  />
                  <IconButton
                    icon={<AlignRight size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("right")}
                  />
                  <IconButton
                    icon={<ChevronUp size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("top")}
                  />
                  <IconButton
                    icon={<Rows2 size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("centerV")}
                  />
                  <IconButton
                    icon={<ChevronDown size={isMobile ? 14 : 16} />}
                    onClick={() => alignObj("bottom")}
                  />
                </div>
              </div>
            ) : (
              <div className="py-10 md:py-20 text-center border-2 border-dashed border-gray-200 rounded-[20px] md:rounded-[32px] text-gray-300">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                  Select an element
                  <br />
                  to adjust
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ToolButton - Responsive
const ToolButton = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-full h-12 md:h-16 flex flex-col items-center justify-center gap-0.5 md:gap-1 rounded-xl transition-all shadow-sm border border-transparent active:scale-95 ${active ? "bg-secondary text-white" : "bg-gray-50 text-slate-400 hover:bg-secondary/10 hover:text-secondary"}`}
  >
    {icon}{" "}
    <span className="text-[6px] md:text-[7px] font-black uppercase">
      {label}
    </span>
  </button>
);

// ToolInput - Responsive
const ToolInput = ({ icon, label, onChange }) => (
  <label className="w-full h-12 md:h-16 flex flex-col items-center justify-center gap-0.5 md:gap-1 rounded-xl bg-gray-50 text-slate-400 hover:bg-secondary/10 hover:text-secondary transition-all shadow-sm cursor-pointer active:scale-95">
    <input
      type="file"
      className="hidden"
      onChange={onChange}
      accept="image/*"
    />
    {icon}{" "}
    <span className="text-[6px] md:text-[7px] font-black uppercase">
      {label}
    </span>
  </label>
);

// IconButton - Responsive
const IconButton = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-1.5 md:p-3 bg-white hover:shadow-md rounded-lg md:rounded-xl text-primary/60 hover:text-secondary flex items-center justify-center border border-gray-100 transition-all"
  >
    {icon}
  </button>
);

export default FlierGenerator;
