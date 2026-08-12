import React, { Component } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Vault App Render Error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F3EC] dark:bg-[#060911] text-vault-charcoal dark:text-vault-text flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-vault-surface border border-vault-border rounded-3xl p-6 shadow-xl space-y-4">
            <div className="w-14 h-14 bg-vault-roseLight border border-vault-rose/30 text-vault-rose rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-vault-charcoal dark:text-vault-text">
                Something went wrong
              </h2>
              <p className="text-xs text-vault-muted mt-1 leading-relaxed">
                "An unexpected rendering error occurred. Your financial data and account balance remain safe."
              </p>
            </div>

            <div className="p-3 bg-vault-paper border border-vault-border rounded-xl text-xs font-mono text-vault-muted text-left overflow-x-auto max-h-24">
              {this.state.error?.toString() || 'Unknown UI Error'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-vault-terracotta hover:bg-vault-terracottaHover text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
