import type { Ref } from 'vue'
import type {
  scrollCallWay,
  scrollCallFrom,
  ILenisScrollToOptions,
  lenisTargetScrollTo,
  ILocomotiveScrollOptions,
  ILenisOptions
} from 'locomotive-scroll/dist/types/types'

import type VuecomotiveScroll from './scroll'

export type TCreateFuncOptions = Omit<ILocomotiveScrollOptions, 'lenisOptions' | 'scrollCallback'>

export type TScrollTo = (target: lenisTargetScrollTo, options?: ILenisScrollToOptions) => void

export interface IVuecomotiveScroll {
  scrollTo: TScrollTo

  isReady: Ref<boolean>
  direction: Ref<number>
  isScrolling: Ref<boolean>
  scroll: VuecomotiveScroll
}

export type TLenisOptions = Omit<ILenisOptions, 'wrapper' | 'content'>

export type TPosition =
  | 'start'
  | 'middle'
  | 'end'
  | ',start'
  | ',middle'
  | ',end'
  | 'start,start'
  | 'start,middle'
  | 'start,end'
  | 'middle,start'
  | 'middle,middle'
  | 'middle,end'
  | 'end,start'
  | 'end,middle'
  | 'end,end'

export interface IScrollElementProps {
  position?: TPosition
  offset?: string
  inViewClass?: string
  repeat?: boolean
  speed?: number
  cssProgress?: boolean
  ignoreFold?: boolean
  touchSpeed?: boolean
}

interface IEventPayload {
  target: HTMLElement
}

export interface IIntersectEventPayload extends IEventPayload {
  way: scrollCallWay
  from: scrollCallFrom
}

export interface IProgressEventPayload extends IEventPayload {
  progress: number
}
