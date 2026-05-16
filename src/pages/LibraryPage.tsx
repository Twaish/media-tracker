import { useQuery } from '@tanstack/react-query'
import { PersistedMedia } from '@shared/types'
import { useEffect } from 'react'
import { useMediaStore } from '@/features/media/stores/mediaStore'
import { MediaCard } from '@/features/media/components/MediaCard'
import { getMedia } from '@/features/media/actions'
import { useMediaInspectorStore } from '@/features/media/stores/mediaInspectorStore'
import { MediaInspector } from '@/features/media/components/MediaInspector'
import { motion } from 'framer-motion'
import { useHotkey } from '@/app/hotkeys/hooks/useHotkey'
import { MediaToolbar } from '@/features/media/components/MediaToolbar'
import { getMediaQueryOptions } from '@/features/media/queries'

export default function LibraryPage() {
  return (
    <div className="flex h-full w-full flex-col">
      <MediaToolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hide-scroll h-full w-full overflow-auto">
          <MediaGrid />
        </div>
        <MediaInspector />
      </div>
    </div>
  )
}

function MediaGrid() {
  const setMedias = useMediaStore((s) => s.setMedias)
  const selectMedia = useMediaInspectorStore((s) => s.selectMedia)
  const hasSelectedMedia = useMediaInspectorStore((s) => !!s.selectedMedia)

  const { data: mediaResults, isLoading } = useQuery(getMediaQueryOptions(1, 5))

  useEffect(() => {
    if (mediaResults?.data) {
      setMedias(mediaResults.data as PersistedMedia[])
    }
  }, [mediaResults, setMedias])

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
    <div className="grid h-min flex-1 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-px">
      {!isLoading &&
        mediaResults?.data.map((media) => (
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
