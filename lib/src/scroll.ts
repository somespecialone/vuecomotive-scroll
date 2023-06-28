import { ref, markRaw } from 'vue'
import type { App, Ref } from 'vue'

import type Lenis from '@studio-freight/lenis'
import LocomotiveScroll from 'locomotive-scroll'
import type ScrollElement from 'locomotive-scroll/dist/types/core/ScrollElement'
import type Core from 'locomotive-scroll/dist/types/core/Core'
import type { lenisTargetScrollTo, ILenisScrollToOptions, ILenisOptions } from 'locomotive-scroll/dist/types/types'

import { scrollInstKey, scrollToKey } from './keys'
import ScrollView from './components/ScrollView.vue'
import ScrollComponent from './components/ScrollComponent.vue'
import { infiniteGenerator } from './utils'

// @ts-expect-error
export default class VuecomotiveScroll extends LocomotiveScroll {
  public isReady: Ref<boolean>
  public direction: Ref<number>
  public isScrolling: Ref<boolean>

  /**
   * @internal
   */
  _idGenerator: Generator<number>

  /**
   * Ugly lenis options getter
   * @internal
   */
  get lenisOptionsGetter(): ILenisOptions {
    // @ts-expect-error
    return this.lenisOptions
  }

  /**
   * @internal
   */
  getId(): number {
    return this._idGenerator.next().value
  }

  public scrollTo(target: lenisTargetScrollTo, options?: ILenisScrollToOptions) {
    this.isReady.value && this.lenis?.scrollTo(target, options)
  }

  public get core(): Core | null {
    // @ts-expect-error
    return this.coreInstance || null
  }

  public get scrollElements(): ScrollElement[] {
    // @ts-expect-error
    return this.core?.scrollElements || []
  }

  public get lenis(): Lenis | null {
    // @ts-expect-error
    return this.lenisInstance || null
  }

  /**
   * @internal
   */
  install(app: App) {
    markRaw(this) // makes this non-reactive

    this._idGenerator = infiniteGenerator()
    this.isReady = ref(false)
    this.direction = ref(1)
    this.isScrolling = ref(false)
    const scrollTo = this.scrollTo.bind(this)

    app.component('ScrollView', ScrollView)
    app.component('ScrollComponent', ScrollComponent)
    app.config.globalProperties.$scroll = this
    app.config.globalProperties.$scrollTo = scrollTo

    app.provide(scrollInstKey, this)
    app.provide(scrollToKey, scrollTo)
  }

  // @ts-expect-error
  private _init() {}

  /**
   * @internal
   */
  init(doneCallback = (data: { core: Core; lenis: Lenis }) => {}) {
    const self = this
    // max performance
    let direction = 1
    let isScrolling = false

    // @ts-expect-error
    this.scrollCallback = (l: Lenis) => {
      direction != l.direction && (this.direction.value = direction = l.direction)
    }

    // @ts-expect-error
    super._init()

    // waiting for Core, Lenis instances in `_init` will be created
    requestAnimationFrame(() => {
      // patch Lenis property
      // https://github.com/studio-freight/lenis/blob/0370ab155771e2e6771f2039c7d15514662af975/src/index.js#L455
      const descr = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.lenis!), 'isScrolling')!
      Object.defineProperty(this.lenis!, 'isScrolling', {
        get() {
          return descr.get!.call(this)
        },
        set(value: boolean) {
          descr.set!.call(this, value)
          isScrolling != value && (self.isScrolling.value = isScrolling = value)
        }
      })

      this.isReady.value = true

      doneCallback({ core: this.core!, lenis: this.lenis! })
    })
  }

  public destroy() {
    this.isReady.value = false
    super.destroy()
  }
}
