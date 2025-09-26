import React from 'react'
import HeadCard from '@/components/common/head-card'
import FaqContent from '@/components/faq'

const FAQPage = () => {
  return (
    <main>
      <HeadCard
        title="FAQ"
        subtitle="FAQ"
        image="/privacy-policy.webp"
      />
      <FaqContent />
    </main>
  )
}

export default FAQPage