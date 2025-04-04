
import React, { useState } from "react";
import { useCanvas } from "../CanvasContext";
import { BANNER_SIZES, BannerSize } from "../types";
import { Square, ChevronRight, CheckSquare, FolderPlus, Link2Icon, X, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const SizesPanel = () => {
  const { selectedSize, setSelectedSize, setActiveSizes, activeSizes, addCustomSize } = useCanvas();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  
  // Group banner sizes by category
  const groupedSizes = {
    "Custom": activeSizes.filter(size => !BANNER_SIZES.some(s => s.name === size.name)),
    "Social Media": BANNER_SIZES.filter(size => 
      size.name.includes("Facebook") || 
      size.name.includes("Instagram") || 
      size.name.includes("Twitter") || 
      size.name.includes("LinkedIn")
    ),
    "Email": BANNER_SIZES.filter(size => size.name.includes("Email")),
    "Ads": BANNER_SIZES.filter(size => 
      !size.name.includes("Email") && 
      !size.name.includes("Facebook") && 
      !size.name.includes("Instagram") && 
      !size.name.includes("Twitter") && 
      !size.name.includes("LinkedIn")
    )
  };

  const handleToggleSize = (size: BannerSize) => {
    const isCurrentlyActive = activeSizes.some(s => s.name === size.name);
    
    if (isCurrentlyActive) {
      // Remove from active sizes if it's not the selected size
      if (size.name === selectedSize.name && activeSizes.length > 1) {
        // If removing selected size, choose another one to be selected
        const nextSize = activeSizes.find(s => s.name !== size.name);
        if (nextSize) {
          setSelectedSize(nextSize);
        }
      }
      
      // Only remove if not the last active size
      if (activeSizes.length > 1) {
        setActiveSizes(activeSizes.filter(s => s.name !== size.name));
      }
    } else {
      // Add to active sizes
      setActiveSizes([...activeSizes, size]);
    }
  };

  const handlePrimarySize = (size: BannerSize) => {
    setSelectedSize(size);
    
    // If the size is not already active, add it
    if (!activeSizes.some(s => s.name === size.name)) {
      setActiveSizes([...activeSizes, size]);
    }
  };

  const selectAllInCategory = (category: string) => {
    // Add all sizes in category to active sizes without duplicates
    const newSizes = [...activeSizes];
    groupedSizes[category].forEach(size => {
      if (!newSizes.some(s => s.name === size.name)) {
        newSizes.push(size);
      }
    });
    setActiveSizes(newSizes);
  };

  const deselectAllInCategory = (category: string) => {
    // Make sure we're not removing all active sizes
    const sizesToRemove = new Set(groupedSizes[category].map(size => size.name));
    const remainingSizes = activeSizes.filter(s => !sizesToRemove.has(s.name));
    
    // Keep at least one size active
    if (remainingSizes.length > 0) {
      setActiveSizes(remainingSizes);
      
      // If the selected size is being removed, change it
      if (sizesToRemove.has(selectedSize.name)) {
        setSelectedSize(remainingSizes[0]);
      }
    }
  };

  const isCategoryPartiallySelected = (category: string) => {
    if (groupedSizes[category].length === 0) return false;
    
    const categorySelectedCount = groupedSizes[category].filter(
      size => activeSizes.some(s => s.name === size.name)
    ).length;
    return categorySelectedCount > 0 && categorySelectedCount < groupedSizes[category].length;
  };

  const isCategoryFullySelected = (category: string) => {
    if (groupedSizes[category].length === 0) return false;
    
    return groupedSizes[category].every(
      size => activeSizes.some(s => s.name === size.name)
    );
  };

  const handleToggleCategory = (category: string) => {
    if (isCategoryFullySelected(category)) {
      deselectAllInCategory(category);
    } else {
      selectAllInCategory(category);
    }
  };

  const handleCreateCustomSize = () => {
    if (!customName.trim()) {
      toast.error("Por favor, forneça um nome para o tamanho personalizado");
      return;
    }

    const width = parseInt(customWidth);
    const height = parseInt(customHeight);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      toast.error("Por favor, forneça dimensões válidas");
      return;
    }

    // Check if a size with this name already exists
    if (activeSizes.some(s => s.name === customName.trim())) {
      toast.error("Já existe um tamanho com este nome");
      return;
    }

    // Add the custom size
    const newSize: BannerSize = {
      name: customName.trim(),
      width,
      height
    };

    addCustomSize(newSize);
    
    // Reset form
    setCustomName("");
    setCustomWidth("");
    setCustomHeight("");
    setIsDialogOpen(false);
    
    toast.success(`Tamanho personalizado "${newSize.name}" criado com sucesso`);
  };

  const handleRemoveCustomSize = (size: BannerSize) => {
    // Only allow removing custom sizes
    if (BANNER_SIZES.some(s => s.name === size.name)) {
      toast.error("Não é possível remover tamanhos predefinidos");
      return;
    }

    // Remove from active sizes
    setActiveSizes(activeSizes.filter(s => s.name !== size.name));

    // If this was the selected size, select another one
    if (selectedSize.name === size.name && activeSizes.length > 1) {
      const nextSize = activeSizes.find(s => s.name !== size.name);
      if (nextSize) {
        setSelectedSize(nextSize);
      }
    }

    toast.success(`Tamanho personalizado "${size.name}" removido`);
  };

  // Determine if the Custom category should be shown
  const showCustomCategory = groupedSizes["Custom"].length > 0;
  
  // Calculate default accordion values
  const defaultAccordionValues = ["Social Media", "Email", "Ads"];
  if (showCustomCategory) {
    defaultAccordionValues.unshift("Custom");
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="p-4 border-b">
        <div className="text-sm font-bold text-[#414651]">Banner Sizes</div>
      </div>

      {/* Size content */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" className="w-full" defaultValue={defaultAccordionValues}>
          {/* Custom Sizes Category - Only show if there are custom sizes */}
          {showCustomCategory && (
            <AccordionItem key="Custom" value="Custom" className="border-b">
              <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="category-Custom"
                    checked={isCategoryFullySelected("Custom")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCategory("Custom");
                    }}
                    className={isCategoryPartiallySelected("Custom") ? "opacity-50" : ""}
                  />
                  <label 
                    htmlFor="category-Custom"
                    className="text-xs font-medium text-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Custom
                  </label>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-2">
                <div className="space-y-1 pl-6">
                  {groupedSizes["Custom"].map((size) => (
                    <div
                      key={size.name}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                        selectedSize.name === size.name ? "bg-purple-100" : "hover:bg-gray-50"
                      }`}
                    >
                      <Checkbox 
                        id={`size-${size.name}`}
                        checked={activeSizes.some(s => s.name === size.name)}
                        onCheckedChange={() => handleToggleSize(size)}
                      />
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handlePrimarySize(size)}
                      >
                        <div className={`text-sm ${selectedSize.name === size.name ? "text-purple-700 font-medium" : ""}`}>
                          {size.name}
                        </div>
                        <div className="text-xs text-gray-500">{size.width} × {size.height}px</div>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveCustomSize(size)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                      
                      {selectedSize.name === size.name && (
                        <ChevronRight className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Standard Categories */}
          {Object.entries(groupedSizes)
            .filter(([category]) => category !== "Custom") // Skip Custom category as it's handled separately
            .map(([category, sizes]) => (
              <AccordionItem key={category} value={category} className="border-b">
                <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={isCategoryFullySelected(category)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCategory(category);
                      }}
                      className={isCategoryPartiallySelected(category) ? "opacity-50" : ""}
                    />
                    <label 
                      htmlFor={`category-${category}`}
                      className="text-xs font-medium text-gray-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {category}
                    </label>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-2">
                  <div className="space-y-1 pl-6">
                    {sizes.map((size) => (
                      <div
                        key={size.name}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                          selectedSize.name === size.name ? "bg-purple-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <Checkbox 
                          id={`size-${size.name}`}
                          checked={activeSizes.some(s => s.name === size.name)}
                          onCheckedChange={() => handleToggleSize(size)}
                        />
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handlePrimarySize(size)}
                        >
                          <div className={`text-sm ${selectedSize.name === size.name ? "text-purple-700 font-medium" : ""}`}>
                            {size.name}
                          </div>
                          <div className="text-xs text-gray-500">{size.width} × {size.height}px</div>
                        </div>
                        {selectedSize.name === size.name && (
                          <ChevronRight className="h-4 w-4 text-purple-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
          ))}
        </Accordion>

        <div className="p-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <FolderPlus className="h-4 w-4 mr-2" />
                Novo Tamanho Personalizado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Tamanho Personalizado</DialogTitle>
                <DialogDescription>
                  Defina um nome e dimensões para o seu tamanho personalizado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="customName" className="text-right text-sm">
                    Nome
                  </label>
                  <Input
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="col-span-3"
                    placeholder="ex: Banner do Site"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="customWidth" className="text-right text-sm">
                    Largura (px)
                  </label>
                  <Input
                    id="customWidth"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="col-span-3"
                    type="number"
                    min="1"
                    placeholder="ex: 800"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="customHeight" className="text-right text-sm">
                    Altura (px)
                  </label>
                  <Input
                    id="customHeight"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="col-span-3"
                    type="number"
                    min="1"
                    placeholder="ex: 600"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCustomSize}>
                  Criar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Link2Icon className="h-4 w-4" />
              <span>Tamanhos Vinculados</span>
            </div>
            <p className="text-xs text-gray-500">
              Alterações nos elementos do tamanho primário serão aplicadas a todos os tamanhos vinculados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
