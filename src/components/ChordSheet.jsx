// Muestra la letra con acordes respetando los espacios (fuente monoespaciada).
// Las líneas que solo tienen acordes se resaltan para leerlas más fácil.
const CHORD = /^[A-G][b#]?(?:m|min|maj|dim|aug)?(?:7|9|11|13)?(?:\/[A-G][b#]?)?$/

function isChordLine(line) {
  const tokens = line.trim().split(/\s+/).filter(Boolean)
  return tokens.length > 0 && tokens.every((t) => CHORD.test(t))
}

export default function ChordSheet({ content, fontSize = 16 }) {
  const lines = (content || '').split('\n')
  return (
    <pre className="chord-sheet" style={{ fontSize }}>
      {lines.map((line, i) => (
        <span key={i} className={isChordLine(line) ? 'chord-line' : undefined}>
          {line}
          {'\n'}
        </span>
      ))}
    </pre>
  )
}
