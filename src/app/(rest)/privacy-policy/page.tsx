import React from 'react'
import HeadCard from '@/components/common/head-card'
import PrivacyPolicyCard from '@/components/content/privacy-policy-card'

const PrivacyPolicy = () => {
  return (
    <main>
      <HeadCard
        title="Privacy Policy"
        subtitle="Privacy Policy"
        image="/privacy-policy.webp"
      />
      <PrivacyPolicyCard />
    </main>
  )
}

export default PrivacyPolicy