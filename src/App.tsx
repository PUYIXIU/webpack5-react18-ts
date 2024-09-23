import React, { lazy, Suspense, useState } from 'react'
import logo from '@/assets/imgs/e-duck.png'
import dogLogo from '@/assets/imgs/toby_dog.jpg'
const LazyDemo = lazy(() => import('@/components/LazyDemo'))

const PreloadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /* webpackPreload: true */
      '@/components/PreloadDemo'
    )
)
const PrefetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PrefetchDemo" */
      /* webpackPrefetch: true */
      '@/components/PrefetchDemo'
    )
)

function App() {
  const [show, setShow] = useState(false)

  const onClick = () => {
    import('./app.less')
    setShow(true)
  }

  return (
    <>
      <div>
        <h2>Webpack React Ts111</h2>
        <button onClick={onClick}>show</button>

        {show && (
          <Suspense fallback={null}>
            <LazyDemo />
          </Suspense>
        )}
        {show && (
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
        )}
        {show && (
          <Suspense fallback={null}>
            <PrefetchDemo />
          </Suspense>
        )}
      </div>
    </>
  )
}

export default App
