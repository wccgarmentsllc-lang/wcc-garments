import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  once?: boolean
  style?: React.CSSProperties
}

export function SplitText({ text, className = '', delay = 0, once = true, style }: SplitTextProps) {
  const words = text.split(' ')

  return (
    <div className={`flex flex-wrap ${className}`} style={style}>
      {words.map((word, wi) => (
        <span key={wi} className="mr-[0.28em] overflow-hidden inline-block">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once }}
            transition={{
              duration: 0.8,
              delay: delay + wi * 0.1,
              ease: [0.33, 1, 0.68, 1],
            }}
            className="block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}
