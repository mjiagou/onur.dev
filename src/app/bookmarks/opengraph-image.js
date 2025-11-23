import { ImageResponse } from 'next/og'

import { sharedMetadata } from '@/app/shared-metadata'
import { OpenGraphImage } from '@/components/og-image'
import { getPageSeo } from '@/lib/contentful'
import { getBoldFont, getRegularFont } from '@/lib/fonts'

export const alt = 'Bookmarks'
export const size = {
  width: sharedMetadata.ogImage.width,
  height: sharedMetadata.ogImage.height
}
export const contentType = sharedMetadata.ogImage.type

export default async function Image() {
  // 修改开始：接收原始响应
  const [seoDataResponse, regularFontData, boldFontData] = await Promise.all([
    getPageSeo('bookmarks'),
    getRegularFont(),
    getBoldFont()
  ])
  
  // 修改：如果 getPageSeo 返回 null (因 API 失败或未找到)，则使用空对象 {}
  const seoData = seoDataResponse || {}
  // 修改结束

  const { seo: { title, description, ogImageTitle, ogImageSubtitle } = {} } = seoData

  return new ImageResponse(
    (
      <OpenGraphImage
        title={ogImageTitle || title || 'Bookmarks'} 
        description={ogImageSubtitle || description || 'Curated list of bookmarks'}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        }
        url="bookmarks"
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
