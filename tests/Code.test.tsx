import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vite-plus/test';
import { Code } from '../lib/ui/Code';

describe('Code', () => {
  it('renders code text', () => {
    render(() => <Code code="npm install cdx" />);

    expect(screen.getByText('npm install cdx')).toBeInTheDocument();
  });

  it('renders filename and language in the header', () => {
    render(() => <Code code="console.log('hello')" fileName="app.ts" language="typescript" />);

    expect(screen.getByText('app.ts')).toBeInTheDocument();
  });

  it('renders language tag when no filename is given', () => {
    render(() => <Code code="console.log('hello')" language="bash" />);

    expect(screen.getByText('bash')).toBeInTheDocument();
  });

  it('shows copy button by default', () => {
    render(() => <Code code="npm install cdx" />);

    expect(screen.getByTitle('Copy code')).toBeInTheDocument();
  });

  it('hides copy button when showCopy is false', () => {
    render(() => <Code code="npm install cdx" showCopy={false} />);

    expect(screen.queryByTitle('Copy code')).not.toBeInTheDocument();
  });

  it('renders code inside a pre and code element', () => {
    const { container } = render(() => <Code code="line1\n  line2" />);

    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    const code = pre!.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code).toHaveTextContent('line1');
    expect(code).toHaveTextContent('line2');
  });

  it('renders file icon when fileName is provided', () => {
    const { container } = render(() => <Code code="console.log('test')" fileName="test.js" />);

    // The FileCode icon from lucide renders as an SVG
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
