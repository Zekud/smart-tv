"use client"

import type React from "react"
import { useEffect, useState, createContext, useContext, useRef } from "react"
import { cn } from "@/lib/utils"

interface KeyboardNavigationContextType {
  focusedElementId: string | null
  setFocusedElementId: (id: string | null) => void
  registerNavigableElement: (id: string, ref: React.RefObject<HTMLElement>) => void
  unregisterNavigableElement: (id: string) => void
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | null>(null)

export function useKeyboardNavigation() {
  const context = useContext(KeyboardNavigationContext)
  if (!context) {
    throw new Error("useKeyboardNavigation must be used within a KeyboardNavigation provider")
  }
  return context
}

interface NavigableElement {
  id: string
  ref: React.RefObject<HTMLElement>
  rect?: DOMRect
}

interface KeyboardNavigationProps {
  children: React.ReactNode
}

export function KeyboardNavigation({ children }: KeyboardNavigationProps) {
  const [focusedElementId, setFocusedElementId] = useState<string | null>(null)
  const navigableElementsRef = useRef<Map<string, NavigableElement>>(new Map())

  const registerNavigableElement = (id: string, ref: React.RefObject<HTMLElement>) => {
    navigableElementsRef.current.set(id, { id, ref })
  }

  const unregisterNavigableElement = (id: string) => {
    navigableElementsRef.current.delete(id)
  }

  // Update element positions
  useEffect(() => {
    const updateElementPositions = () => {
      navigableElementsRef.current.forEach((element) => {
        if (element.ref.current) {
          element.rect = element.ref.current.getBoundingClientRect()
        }
      })
    }

    updateElementPositions()
    window.addEventListener("resize", updateElementPositions)

    return () => {
      window.removeEventListener("resize", updateElementPositions)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        return
      }

      e.preventDefault()

      if (!focusedElementId && navigableElementsRef.current.size > 0) {
        // Focus the first element if none is focused
        const firstElement = Array.from(navigableElementsRef.current.values())[0]
        setFocusedElementId(firstElement.id)
        return
      }

      const currentElement = navigableElementsRef.current.get(focusedElementId!)
      if (!currentElement || !currentElement.rect) return

      const elements = Array.from(navigableElementsRef.current.values()).filter((el) => el.rect)

      let nextElement: NavigableElement | undefined

      switch (e.key) {
        case "ArrowUp":
          nextElement = findClosestElement(elements, currentElement, "up")
          break
        case "ArrowDown":
          nextElement = findClosestElement(elements, currentElement, "down")
          break
        case "ArrowLeft":
          nextElement = findClosestElement(elements, currentElement, "left")
          break
        case "ArrowRight":
          nextElement = findClosestElement(elements, currentElement, "right")
          break
        case "Enter":
          if (currentElement.ref.current) {
            currentElement.ref.current.click()
          }
          break
      }

      if (nextElement) {
        setFocusedElementId(nextElement.id)
        nextElement.ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [focusedElementId])

  const findClosestElement = (
    elements: NavigableElement[],
    currentElement: NavigableElement,
    direction: "up" | "down" | "left" | "right",
  ) => {
    if (!currentElement.rect) return undefined

    const currentRect = currentElement.rect
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2,
    }

    // Filter elements based on direction
    const filteredElements = elements.filter((element) => {
      if (!element.rect || element.id === currentElement.id) return false

      const rect = element.rect
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }

      switch (direction) {
        case "up":
          return center.y < currentCenter.y
        case "down":
          return center.y > currentCenter.y
        case "left":
          return center.x < currentCenter.x
        case "right":
          return center.x > currentCenter.x
      }
    })

    if (filteredElements.length === 0) return undefined

    // Calculate distances and find the closest element
    return filteredElements.reduce((closest, element) => {
      if (!element.rect || !closest.rect) return closest

      const closestRect = closest.rect
      const elementRect = element.rect

      const closestCenter = {
        x: closestRect.left + closestRect.width / 2,
        y: closestRect.top + closestRect.height / 2,
      }

      const elementCenter = {
        x: elementRect.left + elementRect.width / 2,
        y: elementRect.top + elementRect.height / 2,
      }

      const closestDistance = Math.sqrt(
        Math.pow(closestCenter.x - currentCenter.x, 2) + Math.pow(closestCenter.y - currentCenter.y, 2),
      )

      const elementDistance = Math.sqrt(
        Math.pow(elementCenter.x - currentCenter.x, 2) + Math.pow(elementCenter.y - currentCenter.y, 2),
      )

      return elementDistance < closestDistance ? element : closest
    }, filteredElements[0])
  }

  return (
    <KeyboardNavigationContext.Provider
      value={{
        focusedElementId,
        setFocusedElementId,
        registerNavigableElement,
        unregisterNavigableElement,
      }}
    >
      {children}
    </KeyboardNavigationContext.Provider>
  )
}

interface NavigableProps {
  id: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Navigable({ id, children, className, onClick }: NavigableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { focusedElementId, setFocusedElementId, registerNavigableElement, unregisterNavigableElement } =
    useKeyboardNavigation()

  useEffect(() => {
    registerNavigableElement(id, ref)
    return () => {
      unregisterNavigableElement(id)
    }
  }, [id, registerNavigableElement, unregisterNavigableElement])

  return (
    <div
      ref={ref}
      className={cn(
        className,
        focusedElementId === id && "focus-visible outline-2 outline-primary outline",
        "transition-all duration-200",
      )}
      onClick={(e) => {
        setFocusedElementId(id)
        onClick?.()
      }}
      tabIndex={0}
    >
      {children}
    </div>
  )
}
