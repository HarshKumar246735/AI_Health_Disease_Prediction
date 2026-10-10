export function Spinner({ size = 28 }) {
  return <span className="spinner" style={{ width: size, height: size }} role="status" aria-label="Loading" />;
}

export default function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size={36} />
    </div>
  );
}
