import React from 'react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/guillotina'),
  { ssr: false }
)

export default function Blog() {
  return (
    <>
      <Head>
        <title>Guillotina React - Next.js Example</title>
      </Head>
      <DynamicComponentWithNoSSR />
    </>
  )
}
