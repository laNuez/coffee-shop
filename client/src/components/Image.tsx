import { getOptimizeImage } from '../util/util'

type ImageProps = Omit<
  React.ComponentProps<'img'>,
  'src' | 'width' | 'height' | 'alt'
> & {
  src: string
  alt: string
  width: number
  height?: number
}

export const Image = ({ src, width, height, alt, ...props }: ImageProps) => {
  return (
    <img
      src={getOptimizeImage(src, width)}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
