'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // If only one image, show simple display
  if (!images || images.length === 0) {
    return null
  }

  if (images.length === 1) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-primary/30 hover:border-primary transition-all">
        <div className="relative h-96 md:h-full min-h-[500px]">
          <Image
            src={images[0]}
            alt={productName}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-primary/30 hover:border-primary transition-all relative">
        <div className="relative h-96 md:h-full min-h-[500px]">
          <Image
            src={images[currentIndex]}
            alt={`${productName} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-dark/70 hover:bg-dark text-cream p-3 rounded-full transition-all shadow-lg hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-dark/70 hover:bg-dark text-cream p-3 rounded-full transition-all shadow-lg hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-dark/70 text-cream px-3 py-1 rounded-full text-sm font-semibold">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? 'border-primary shadow-lg scale-110'
                  : 'border-cream hover:border-primary/50 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
