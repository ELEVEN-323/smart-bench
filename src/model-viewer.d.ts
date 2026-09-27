import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        'auto-rotate'?: boolean
        'camera-controls'?: boolean
        'auto-rotate-delay'?: number
        'rotation-per-second'?: string
        'shadow-intensity'?: string
        'shadow-softness'?: string
        'exposure'?: string
        'camera-orbit'?: string
        'field-of-view'?: string
        'environment-image'?: string
        poster?: string
        ar?: boolean
        loading?: 'auto' | 'lazy' | 'eager'
      }
    }
  }
}

export {}
