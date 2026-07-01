import { useQuery } from '@tanstack/react-query'
import { PersistedMedia } from '@shared/types'
import { useEffect } from 'react'
import { useMediaStore } from '@/features/media/stores/mediaStore'
import { MediaCard } from '@/features/media/components/MediaCard'
import { useMediaInspectorStore } from '@/features/media/stores/mediaInspectorStore'
import { MediaInspector } from '@/features/media/components/MediaInspector'
import { motion } from 'framer-motion'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { MediaToolbar } from '@/features/media/components/MediaToolbar'
import { getMediaQueryOptions } from '@/features/media/queries'
import { MediaPagination } from '@/features/media/components/MediaPagination'
import { useMediaQueryStore } from '@/features/media/stores/mediaQueryStore'

export default function LibraryPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <MediaToolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hide-scroll flex h-full w-full flex-col overflow-auto">
          <MediaView />
        </div>
        <MediaInspector />
      </div>
    </div>
  )
}

function MediaView() {
  const page = useMediaQueryStore((s) => s.page)
  const limit = useMediaQueryStore((s) => s.limit)
  const search = useMediaQueryStore((s) => s.search)
  const setMedias = useMediaStore((s) => s.setMedias)
  const setPagination = useMediaStore((s) => s.setPagination)

  const { data: mediaResults } = useQuery(
    getMediaQueryOptions(search, page, limit),
  )

  useEffect(() => {
    if (mediaResults?.data) {
      setMedias(mediaResults.data as PersistedMedia[])
    }
    if (mediaResults?.pagination) {
      setPagination(mediaResults.pagination)
    }
  }, [mediaResults, setMedias, setPagination])

  return (
    <>
      <MediaGrid media={mediaResults?.data as PersistedMedia[] | undefined} />
      <MediaPagination />
    </>
  )
}

function MediaGrid({ media = [] }: { media?: PersistedMedia[] }) {
  const selectMedia = useMediaInspectorStore((s) => s.selectMedia)
  const hasSelectedMedia = useMediaInspectorStore((s) => !!s.selectedMedia)

  useHotkey({
    keys: ' ',
    handler(e) {
      const mediaId = document.activeElement?.getAttribute('data-media-id')
      if (mediaId != null) {
        e.preventDefault()
        selectMedia(parseInt(mediaId))
      }
    },
    contexts: [],
  })

  return (
    <div className="mb-auto grid h-min grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-px">
      {media &&
        media.map((media) => (
          <motion.div
            key={media.id}
            layout
            transition={{
              layout: {
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
          >
            <MediaCard
              mediaId={media.id}
              data-media-id={media.id}
              onClick={() => selectMedia(media.id)}
            />
          </motion.div>
        ))}
    </div>
  )
}
