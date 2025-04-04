import { useState, useEffect, useRef } from "react";
import { EditorElement } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  AlignEndVertical,
  MoveVertical,
  MoveHorizontal,
  Plus,
  Minus,
  Check
} from "lucide-react";

interface TextPanelProps {
  element: EditorElement;
  updateElementStyle: (property: string, value: any) => void;
  updateElementContent: (content: string) => void;
  activeTab: string;
}

export const TextPanel = ({ element, updateElementStyle, updateElementContent, activeTab }: TextPanelProps) => {
  // Setup refs for maintaining focus on inputs
  const colorInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);
  
  // State for the form elements
  const [linkType, setLinkType] = useState("webpage");
  const [linkUrl, setLinkUrl] = useState("");
  const [newTab, setNewTab] = useState(true);
  const [colorPickerValue, setColorPickerValue] = useState(element.style.color || "#414651");
  const [fontSizeValue, setFontSizeValue] = useState<string>(String(element.style.fontSize || 16));
  const [lineHeightValue, setLineHeightValue] = useState<string>(String(element.style.lineHeight || 1.5));
  const [letterSpacingValue, setLetterSpacingValue] = useState<string>(String(element.style.letterSpacing || 0));

  // Sync form state with element props when element changes
  useEffect(() => {
    setColorPickerValue(element.style.color || "#414651");
    setFontSizeValue(String(element.style.fontSize || 16));
    setLineHeightValue(String(element.style.lineHeight || 1.5));
    setLetterSpacingValue(String(element.style.letterSpacing || 0));
    
    // Também sincronizar link se houver
    if (element.link) {
      setLinkUrl(element.link.url || "");
      setLinkType(element.link.type || "webpage");
      setNewTab(element.link.newTab !== false);
    } else {
      setLinkUrl("");
      setLinkType("webpage");
      setNewTab(true);
    }
  }, [element]);

  // Font weight options
  const fontWeightOptions = [
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
    { value: "bold", label: "Bold" },
  ];

  // Font family options
  const fontFamilyOptions = [
    { value: "Arial", label: "Arial" },
    { value: "Geist", label: "Geist" },
    { value: "Inter", label: "Inter" },
    { value: "Roboto", label: "Roboto" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Poppins", label: "Poppins" },
    { value: "Lato", label: "Lato" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Oswald", label: "Oswald" },
    { value: "Source Sans Pro", label: "Source Sans Pro" },
    { value: "Merriweather", label: "Merriweather" },
    { value: "Raleway", label: "Raleway" },
    { value: "PT Sans", label: "PT Sans" },
    { value: "Quicksand", label: "Quicksand" },
    { value: "Nunito", label: "Nunito" },
    { value: "Work Sans", label: "Work Sans" },
    { value: "Fira Sans", label: "Fira Sans" },
  ];

  // Função segura para atualizar o estilo do elemento
  const safeUpdateStyle = (property: string, value: any) => {
    if (typeof updateElementStyle === 'function') {
      updateElementStyle(property, value);
    } else {
      console.error('updateElementStyle não é uma função', updateElementStyle);
    }
  };

  // Função segura para atualizar o conteúdo do elemento
  const safeUpdateContent = (content: string) => {
    if (typeof updateElementContent === 'function') {
      updateElementContent(content);
    } else {
      console.error('updateElementContent não é uma função', updateElementContent);
    }
  };

  // Font size controls with direct input
  const handleFontSizeChange = (value: string) => {
    // Allow only numbers
    if (/^[0-9]*$/.test(value) || value === '') {
      setFontSizeValue(value);
      if (value !== '') {
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue > 0) {
          safeUpdateStyle("fontSize", numValue);
        }
      }
    }
  };

  const increaseFontSize = () => {
    const currentSize = element.style.fontSize || 16;
    const newSize = currentSize + 1;
    setFontSizeValue(String(newSize));
    safeUpdateStyle("fontSize", newSize);
  };

  const decreaseFontSize = () => {
    const currentSize = element.style.fontSize || 16;
    const newSize = Math.max(8, currentSize - 1);
    setFontSizeValue(String(newSize));
    safeUpdateStyle("fontSize", newSize);
  };

  // Line height controls with direct input
  const handleLineHeightChange = (value: string) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setLineHeightValue(value);
      if (value !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
          safeUpdateStyle("lineHeight", numValue);
        }
      }
    }
  };

  const increaseLineHeight = () => {
    const currentLineHeight = element.style.lineHeight || 1.5;
    const newLineHeight = parseFloat((Math.min(3, currentLineHeight + 0.1).toFixed(1)));
    setLineHeightValue(String(newLineHeight));
    safeUpdateStyle("lineHeight", newLineHeight);
  };

  const decreaseLineHeight = () => {
    const currentLineHeight = element.style.lineHeight || 1.5;
    const newLineHeight = parseFloat((Math.max(1, currentLineHeight - 0.1).toFixed(1)));
    setLineHeightValue(String(newLineHeight));
    safeUpdateStyle("lineHeight", newLineHeight);
  };

  // Letter spacing controls with direct input
  const handleLetterSpacingChange = (value: string) => {
    if (/^-?[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setLetterSpacingValue(value);
      if (value !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          safeUpdateStyle("letterSpacing", numValue);
        }
      }
    }
  };

  const increaseLetterSpacing = () => {
    const currentSpacing = element.style.letterSpacing || 0;
    const newSpacing = parseFloat(((currentSpacing + 0.1).toFixed(1)));
    setLetterSpacingValue(String(newSpacing));
    safeUpdateStyle("letterSpacing", newSpacing);
  };

  const decreaseLetterSpacing = () => {
    const currentSpacing = element.style.letterSpacing || 0;
    const newSpacing = parseFloat((Math.max(-0.5, currentSpacing - 0.1).toFixed(1)));
    setLetterSpacingValue(String(newSpacing));
    safeUpdateStyle("letterSpacing", newSpacing);
  };

  // Text style controls
  const toggleFontStyle = (style: string) => {
    if (style === 'italic') {
      const newStyle = element.style.fontStyle === "italic" ? "normal" : "italic";
      safeUpdateStyle("fontStyle", newStyle);
    } else if (style === 'underline' || style === 'line-through') {
      const currentDecoration = element.style.textDecoration || "none";
      let newDecoration;
      
      if (currentDecoration.includes(style)) {
        newDecoration = currentDecoration.replace(style, "").trim() || "none";
      } else {
        newDecoration = currentDecoration === "none" ? style : `${currentDecoration} ${style}`;
      }
      
      safeUpdateStyle("textDecoration", newDecoration);
    }
  };

  // Wrapping handlers with useCallback to ensure reference stability
  const handleFontFamilyChange = (value: string) => {
    if (value && value !== element.style.fontFamily) {
      safeUpdateStyle("fontFamily", value);
    }
  };

  const handleFontWeightChange = (value: string) => {
    if (value && value !== element.style.fontWeight) {
      safeUpdateStyle("fontWeight", value);
    }
  };

  // Prevenção de propagação de eventos para componentes Select
  const preventPropagation = () => {
    // Adiciona um listener de evento temporário para capturar e parar eventos de teclado
    document.addEventListener('keydown', (e) => e.stopPropagation(), { once: true });
  };

  // Content Panel - for editing the content and link
  const ContentPanel = () => (
    <div className="space-y-6 p-4">
      <div className="text-center text-sm text-gray-500 mb-4">Conteúdo</div>

      <div className="border rounded-lg p-3 relative">
        <textarea
          ref={contentTextareaRef}
          value={element.content}
          onChange={(e) => safeUpdateContent(e.target.value)}
          className="w-full resize-none border-0 focus:outline-none min-h-[80px]"
          placeholder="Text Element"
          onKeyDown={(e) => e.stopPropagation()} // Prevent event bubbling
        />
        <div className="w-2 h-2 bg-gray-600 opacity-60 absolute bottom-3 right-3"></div>
      </div>

      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Vincular a</div>

        <Select 
          value={linkType} 
          onValueChange={setLinkType}
          onOpenChange={(open) => { if (open) preventPropagation() }}
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Página da Web" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webpage">Página da Web</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Telefone</SelectItem>
          </SelectContent>
        </Select>

        <input
          ref={linkUrlRef}
          type="text"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()} // Prevent event bubbling
          placeholder="Link"
          className="w-full px-3 py-2 border rounded-md bg-white"
        />

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox
            id="newTab"
            checked={newTab}
            onCheckedChange={(checked) => setNewTab(checked as boolean)}
          />
          <label htmlFor="newTab" className="text-sm text-gray-700">
            Abrir link em nova guia
          </label>
        </div>
      </div>
    </div>
  );

  // Style Panel - for typography, alignment, and colors
  const StylePanel = () => (
    <div className="space-y-4 p-4">
      <div className="text-center text-sm text-gray-500 mb-4">Estilo</div>

      {/* Typography Section */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Tipografia</div>
        <Select 
          value={element.style.fontFamily || "Arial"} 
          onValueChange={(value) => {
            if (value && value !== element.style.fontFamily) {
              safeUpdateStyle("fontFamily", value);
            }
          }}
          onOpenChange={(open) => { if (open) preventPropagation() }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha uma fonte" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilyOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Style Section */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Estilo de fonte</div>
        <div className="flex items-center justify-between">
          <Select 
            value={element.style.fontWeight || "normal"} 
            onValueChange={(value) => {
              if (value && value !== element.style.fontWeight) {
                safeUpdateStyle("fontWeight", value);
              }
            }}
            onOpenChange={(open) => { if (open) preventPropagation() }}
          >
            <SelectTrigger className="w-full mr-2">
              <SelectValue placeholder="Peso da fonte" />
            </SelectTrigger>
            <SelectContent>
              {fontWeightOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => toggleFontStyle("italic")}
              className={`p-2 rounded-md ${element.style.fontStyle === "italic" ? "bg-gray-200" : "bg-white border"}`}
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              onClick={() => toggleFontStyle("underline")}
              className={`p-2 rounded-md ${element.style.textDecoration?.includes("underline") ? "bg-gray-200" : "bg-white border"}`}
            >
              <Underline size={16} />
            </button>
            <button
              type="button"
              onClick={() => toggleFontStyle("line-through")}
              className={`p-2 rounded-md ${element.style.textDecoration?.includes("line-through") ? "bg-gray-200" : "bg-white border"}`}
            >
              <Strikethrough size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Font Size, Line Height, Letter Spacing Controls */}
      <div className="flex justify-center space-x-4">
        {/* Font Size */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-gray-700">Aa</span>
          <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
            <button type="button" onClick={decreaseFontSize} className="p-1">
              <Minus size={14} />
            </button>
            <input
              type="text"
              value={fontSizeValue}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-10 text-center bg-transparent border-0 focus:outline-none text-xs"
            />
            <button type="button" onClick={increaseFontSize} className="p-1">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Line Height */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-gray-700">
            <MoveVertical size={14} />
          </span>
          <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
            <button type="button" onClick={decreaseLineHeight} className="p-1">
              <Minus size={14} />
            </button>
            <input
              type="text"
              value={lineHeightValue}
              onChange={(e) => handleLineHeightChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-10 text-center bg-transparent border-0 focus:outline-none text-xs"
            />
            <button type="button" onClick={increaseLineHeight} className="p-1">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs text-gray-700">
            <MoveHorizontal size={14} />
          </span>
          <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
            <button type="button" onClick={decreaseLetterSpacing} className="p-1">
              <Minus size={14} />
            </button>
            <input
              type="text"
              value={letterSpacingValue}
              onChange={(e) => handleLetterSpacingChange(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-10 text-center bg-transparent border-0 focus:outline-none text-xs"
            />
            <button type="button" onClick={increaseLetterSpacing} className="p-1">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Parágrafo</div>
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            onClick={() => safeUpdateStyle("textAlign", "left")}
            className={`p-2 rounded-md ${element.style.textAlign === "left" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => safeUpdateStyle("textAlign", "center")}
            className={`p-2 rounded-md ${element.style.textAlign === "center" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => safeUpdateStyle("textAlign", "right")}
            className={`p-2 rounded-md ${element.style.textAlign === "right" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>

      {/* Vertical Alignment */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Alinhamento</div>
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            onClick={() => safeUpdateStyle("verticalAlign", "top")}
            className={`p-2 rounded-md ${element.style.verticalAlign === "top" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignStartVertical size={16} />
          </button>
          <button
            type="button"
            onClick={() => safeUpdateStyle("verticalAlign", "middle")}
            className={`p-2 rounded-md ${element.style.verticalAlign === "middle" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignVerticalDistributeCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => safeUpdateStyle("verticalAlign", "bottom")}
            className={`p-2 rounded-md ${element.style.verticalAlign === "bottom" ? "bg-gray-200" : "bg-white border"}`}
          >
            <AlignEndVertical size={16} />
          </button>
        </div>
      </div>

      {/* Color Section */}
      <div className="space-y-2">
        <div className="text-center text-sm text-gray-500">Cor</div>
        <div>
          <label className="text-xs text-gray-500">Cor do texto</label>
          <div className="flex mt-1">
            <input
              type="color"
              value={element.style.color || "#000000"}
              onChange={(e) => {
                setColorPickerValue(e.target.value);
                safeUpdateStyle("color", e.target.value);
              }}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <input
              ref={colorInputRef}
              type="text"
              value={element.style.color || "#000000"}
              onChange={(e) => {
                setColorPickerValue(e.target.value);
                safeUpdateStyle("color", e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()} // Prevent event bubbling
              className="flex-1 px-3 py-2 border rounded ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render the appropriate panel based on active tab
  return (
    <div>
      {activeTab === "content" ? <ContentPanel /> : <StylePanel />}
    </div>
  );
};
