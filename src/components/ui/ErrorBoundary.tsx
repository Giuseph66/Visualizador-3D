import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
  detailsVisible?: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, detailsVisible: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Log for debugging purposes
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      const { error, detailsVisible } = this.state;
      return (
        <div style={{ padding: 16, color: "#e11d48" }}>
          <div>Oops! Algo deu errado na interface.</div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #e11d48",
              background: "transparent",
              color: "#e11d48",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
          {error && (
            <>
              <button
                onClick={() =>
                  this.setState((prev) => ({
                    detailsVisible: !prev.detailsVisible,
                  }))
                }
                style={{
                  marginTop: 8,
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: "1px solid #f87171",
                  background: "transparent",
                  color: "#f87171",
                  cursor: "pointer",
                }}
              >
                Detalhes
              </button>
              {detailsVisible && (
                <pre
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: "#1f1f1f",
                    color: "#e5e7eb",
                    borderRadius: 6,
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  {String(error)}
                </pre>
              )}
            </>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}


