import { Component } from 'react';
import CardWrapper from '../functional/CardWrapper';

const LOG_KEY = 'inventory_audit_logs';
const MAX_LOGS = 50;
const TOAST_MS = 3000;

class AuditLogger extends Component {
  state = {
    logs: [],
    toast: null,
  };

  toastTimer = null;

  // 1) Load saved logs and subscribe to a global event listener.
  componentDidMount() {
    try {
      const saved = JSON.parse(localStorage.getItem(LOG_KEY));
      if (Array.isArray(saved)) {
        this.setState({ logs: saved });
      }
    } catch {
      // ignore corrupted data and start with an empty log
    }
    window.addEventListener('storage', this.handleStorage);
  }

  // 2) React to a new inventory event, persist the logs, and show a toast.
  componentDidUpdate(prevProps, prevState) {
    const { latestEvent } = this.props;

    if (latestEvent && latestEvent !== prevProps.latestEvent) {
      const entry = { ...latestEvent, time: new Date().toISOString() };
      this.setState((state) => ({
        logs: [entry, ...state.logs].slice(0, MAX_LOGS),
        toast: entry.message,
      }));
      this.showToastTimer();
    }

    if (prevState.logs !== this.state.logs) {
      localStorage.setItem(LOG_KEY, JSON.stringify(this.state.logs));
    }
  }

  // 3) Clean up the timer and the global listener.
  componentWillUnmount() {
    clearTimeout(this.toastTimer);
    window.removeEventListener('storage', this.handleStorage);
  }

  showToastTimer() {
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.setState({ toast: null }), TOAST_MS);
  }

  // Keeps the log in sync when the dashboard is open in another browser tab.
  handleStorage = (event) => {
    if (event.key === LOG_KEY && event.newValue !== JSON.stringify(this.state.logs)) {
      try {
        this.setState({ logs: JSON.parse(event.newValue) || [] });
      } catch {
        // ignore
      }
    }
  };

  handleClear = () => {
    this.setState({ logs: [], toast: null });
  };

  formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  render() {
    const { logs, toast } = this.state;

    return (
      <>
        <CardWrapper title="Audit log" className="audit">
          {logs.length === 0 ? (
            <p className="muted">No activity yet. Add, update, or delete a product to see it here.</p>
          ) : (
            <>
              <ul className="audit-list">
                {logs.map((log) => (
                  <li key={log.id} className="audit-item">
                    <span className={`audit-type audit-${log.type.toLowerCase()}`}>{log.type}</span>
                    <span className="audit-message">{log.message}</span>
                    <time className="muted">{this.formatTime(log.time)}</time>
                  </li>
                ))}
              </ul>
              <button type="button" className="btn btn-small" onClick={this.handleClear}>
                Clear log
              </button>
            </>
          )}
        </CardWrapper>

        {toast && (
          <div className="toast" role="status">
            {toast}
          </div>
        )}
      </>
    );
  }
}

export default AuditLogger;
