export function DataChart({ dataset }: { dataset: Array<{ year: number; value: number }> }) {
  const width = 620;
  const height = 250;
  const pad = 28;
  const values = dataset.map((point) => point.value);
  const min = Math.min(...values) - 10;
  const max = Math.max(...values) + 10;
  const x = (index: number) => pad + index * ((width - pad * 2) / (dataset.length - 1));
  const y = (value: number) => height - pad - ((value - min) / (max - min)) * (height - pad * 2);
  const points = dataset.map((point, index) => `${x(index)},${y(point.value)}`).join(" ");

  return (
    <div className="chart" aria-label="Data chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#353535" />
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#353535" />
        <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke="#202020" />
        <polyline points={points} fill="none" stroke="#eedc00" strokeWidth="2" />
        <g fill="#eedc00">
          {dataset.map((point, index) => (
            <circle key={point.year} cx={x(index)} cy={y(point.value)} r="4">
              <title>{`${point.year}: ${point.value}`}</title>
            </circle>
          ))}
        </g>
      </svg>
      <div className="chart-labels meta muted">
        <span>{dataset[0]?.year}</span>
        <span>{dataset[dataset.length - 1]?.year}</span>
      </div>
    </div>
  );
}
