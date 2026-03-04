'use client'

import React from 'react'
import StackIcon from 'tech-stack-icons'

// ── Error Boundary ───────────────────────────────────────────────────────────
class IconErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { error: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { error: false }
  }
  static getDerivedStateFromError() { return { error: true } }
  componentDidCatch() { /* suppress console noise */ }
  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <span style={{ fontSize: 10, opacity: 0.3, fontWeight: 700 }}>?</span>
      )
    }
    return this.props.children
  }
}

/**
 * SafeStackIcon — drop-in replacement for <StackIcon>.
 * Renders a fallback instead of throwing when the icon slug is invalid/partial.
 *
 * Usage: <SafeStackIcon name="react" className="w-8 h-8" />
 */
export function SafeStackIcon({
  name,
  className,
  fallback,
}: {
  name: string
  className?: string
  fallback?: React.ReactNode
}) {
  const slug = (name ?? '').trim()
  if (!slug) {
    return fallback
      ? <>{fallback}</>
      : <span style={{ fontSize: 10, opacity: 0.3, fontWeight: 700 }}>?</span>
  }
  return (
    <IconErrorBoundary fallback={fallback}>
      <StackIcon name={slug} className={className} />
    </IconErrorBoundary>
  )
}

export default SafeStackIcon
