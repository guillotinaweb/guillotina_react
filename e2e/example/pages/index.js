import React from 'react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
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
