"use client"

import { useState } from "react"

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const list = images.length > 0 ? images : ["/icon.svg"]

  return (
    <div className="space-y-4">
      <div className="card relative overflow-hidden bg-lime-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={list[active]}
          src={list[active]}
          alt={alt}
          className="animate-fade-up aspect-square w-full object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {list.slice(0, 5).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`card overflow-hidden bg-white p-0 transition ${i === active ? "ring-2 ring-leaf-500" : "opacity-70 hover:opacity-100"}`}
              aria-label={`View image ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
