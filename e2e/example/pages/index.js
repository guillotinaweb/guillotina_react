import React from 'react'
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/guillotina'),
  { ssr: false }
)

export default function Blog() {
  return (
    <>
      <DynamicComponentWithNoSSR />
    </>
  )
}
