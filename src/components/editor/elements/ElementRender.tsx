
import React from 'react';
import { EditorElement } from '../types';

interface ElementRenderProps {
  element: EditorElement;
  scale?: number;
}

export const ElementRender: React.FC<ElementRenderProps> = ({ element, scale = 1 }) => {
  const { type, content, style } = element;
  
  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: style.x,
    top: style.y,
    width: style.width,
    height: style.height,
    backgroundColor: style.backgroundColor || 'transparent',
    color: style.color || '#000',
    fontSize: style.fontSize ? `${style.fontSize}px` : 'inherit',
    fontWeight: style.fontWeight || 'normal',
    fontFamily: style.fontFamily || 'inherit',
    textAlign: style.textAlign as any || 'left',
    lineHeight: style.lineHeight || 'normal',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '0',
    border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : 'none',
    padding: style.padding || '0',
    overflow: 'hidden',
    zIndex: 1,
    opacity: style.opacity !== undefined ? style.opacity : 1,
  };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return <div className="w-full h-full flex items-center" style={{
          fontFamily: style.fontFamily || 'inherit',
          fontWeight: style.fontWeight || 'normal',
          fontSize: style.fontSize ? `${style.fontSize}px` : 'inherit',
          fontStyle: style.fontStyle || 'normal',
          lineHeight: style.lineHeight || 'normal',
          letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : 'normal',
        }}>{content || 'Text Element'}</div>;
      
      case 'image':
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {content ? (
              <img 
                src={content} 
                alt={element.alt || "Element"} 
                className="max-w-full max-h-full" 
                style={{
                  objectFit: style.objectFit as any || 'contain',
                  width: style.objectFit === 'cover' ? '100%' : 'auto',
                  height: style.objectFit === 'cover' ? '100%' : 'auto',
                  transform: style.objectFit === 'cover' && style.scale ? `scale(${style.scale})` : 'none',
                  objectPosition: style.xPercent !== undefined && style.yPercent !== undefined ? 
                    `${style.xPercent}% ${style.yPercent}%` : 'center'
                }} 
              />
            ) : (
              <div className="text-xs text-gray-500">Image</div>
            )}
          </div>
        );
      
      case 'button':
        const buttonContent = (
          <div className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center w-full h-full">
            {content || 'Button'}
          </div>
        );
        
        return (
          <div className="h-full w-full flex items-center justify-center">
            {element.link ? (
              <a 
                href={element.link} 
                target={element.openInNewTab ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="w-full h-full"
              >
                {buttonContent}
              </a>
            ) : buttonContent}
          </div>
        );
      
      case 'container':
        return <div className="w-full h-full border border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-xs text-gray-500">Container</div>
        </div>;
      
      default:
        return <div className="text-xs text-gray-400">Unknown Element Type</div>;
    }
  };

  // For linked elements, wrap in an anchor tag
  if (element.link && type === 'image') {
    return (
      <div style={elementStyle}>
        <a 
          href={element.link} 
          target={element.openInNewTab ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          {renderContent()}
        </a>
      </div>
    );
  }

  return (
    <div style={elementStyle}>
      {renderContent()}
    </div>
  );
};
