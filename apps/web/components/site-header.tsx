import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header page-width">
      <Link className="wordmark" href="/" aria-label="WhiteRabbit home">
        <span className="wordmark-symbol" aria-hidden="true">
          W
        </span>
        <span>WhiteRabbit</span>
      </Link>
      <nav className="site-nav" aria-label="Public navigation">
        <a href="/#platform">Platform</a>
        <a href="/#architecture">Architecture</a>
        <a href="https://github.com/sicparvisventures/whiterabbit">
          Open source
        </a>
      </nav>
      <div className="header-actions">
        <Link className="text-link" href="/account/sign-in">
          Sign in
        </Link>
        <Link
          className="button button-compact button-primary"
          href="/account/create"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
