import { draftMode } from 'next/headers'
import { ImageResponse } from 'next/og'

import { sharedMetadata } from '@/app/shared-metadata'
import { OpenGraphImage } from '@/components/og-image'
import { getAllPostSlugs, getWritingSeo } from '@/lib/contentful'
import { getBoldFont, getRegularFont } from '@/lib/fonts'
import { isDevelopment } from '@/lib/utils'

export const dynamic = 'force-static'

export const size = {
  width: sharedMetadata.ogImage.width,
  height: sharedMetadata.ogImage.height
}

export async function generateStaticParams() {
  const allPosts = await getAllPostSlugs()
  return allPosts.map((post) => ({ slug: post.slug }))
}

export async function GET(_, props) {
  const params = await props.params
  const { isEnabled } = await draftMode()
  const { slug } = params
  
  const [seoData, regularFontData, boldFontData] = await Promise.all([
    getWritingSeo(slug, isDevelopment ? true : isEnabled),
    getRegularFont(),
    getBoldFont()
  ])
  
  if (!seoData) return null
  
  const {
    seo: { title, ogImageTitle, ogImageSubtitle }
  } = seoData

  // 🛡️ 关键修复：检测标题是否包含非拉丁字符（如中文）
  // 如果包含中文，强制使用 "New Post" 作为安全标题，防止构建时字体加载超时崩溃
  const displayTitle = ogImageTitle || title
  const hasNonLatin = /[^\u0000-\u007f]/.test(displayTitle)
  const safeTitle = hasNonLatin ? 'New Post' : displayTitle

  return new ImageResponse(
    (
      <OpenGraphImage
        title={safeTitle}
        description={ogImageSubtitle || 'by Onur Şuyalçınkaya'}
        url="writing"
      />
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Geist Sans',
          data: regularFontData,
          style: 'normal',
          weight: 400
        },
        {
          name: 'Geist Sans',
          data: boldFontData,
          style: 'normal',
          weight: 500
        }
      ]
    }
  )
}
